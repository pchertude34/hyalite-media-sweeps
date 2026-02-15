import React, {useEffect, useState} from 'react'
import {BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import {Card, Stack, Box, Text, Label, Select, Inline, Button} from '@sanity/ui'
import {RefreshIcon} from '@sanity/icons'
import DatePicker from 'react-multi-date-picker'
import {Grid} from 'gridjs-react'

import './gridjs-mermaid.css'

// Use NEXT_PUBLIC_ prefix for client-side access, with fallback
const {SANITY_STUDIO_APP_URL} = process.env

type AnalyticsGraphProps = {
  document: {
    displayed: any // The current document data
    draft: any // Draft version of the document
    published: any // Published version of the document
    _id: string
    _type: string
  }
  documentId: string
  schemaType: any // Schema type definition
  onClose?: () => void
  onMenuAction?: (action: any) => void
}

type AnalyticsData = {
  questionText: Array<{
    children?: Array<{
      marks?: Array<string>
      text?: string
      _type: 'span'
      _key: string
    }>
    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote'
    listItem?: 'bullet' | 'number'
    markDefs?: Array<{
      href?: string
      _type: 'link'
      _key: string
    }>
    level?: number
    _type: 'block'
    _key: string
  }>
  questionId: string
  positive?: number
  negative?: number
  total: number
  impressions?: number
  questionIndex: number
  questionTextPlain?: string
}

export function AnalyticsGraph(props: AnalyticsGraphProps) {
  const [data, setData] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<string>('last24hours')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const clientSlug = props.document.displayed?.slug?.current
  const surveyQuestions = props.document.displayed?.surveyQuestions || []

  async function fetchAnalyticsData() {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        timeframe,
      })

      if (timeframe === 'custom') {
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
      }

      const response = await fetch(
        `${process.env.SANITY_STUDIO_APP_URL}/api/analytics/${clientSlug}?${params.toString()}`,
      )
      const result = await response.json()

      if (result.success) {
        // add question index and text to each data item
        result.data = result.data.map((item: AnalyticsData) => {
          const questionIndex = surveyQuestions.findIndex((q: any) => q._key === item.questionId)
          const questionText =
            questionIndex !== -1 ? surveyQuestions[questionIndex].questionText : 'Unknown Question'
          const questionTextPlain =
            Array.isArray(questionText) && questionText.length
              ? convertBlocksToPlainText(questionText)
              : String(questionText || '')
          return {
            ...item,
            questionText,
            questionIndex,
            questionTextPlain,
          }
        })

        // sort by question index
        result.data.sort((a: any, b: any) => a.questionIndex - b.questionIndex)

        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch analytics')
        setData([])
      }
    } catch (err) {
      setError('Failed to fetch analytics data')
      setData([])
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!clientSlug) return
    fetchAnalyticsData()
  }, [clientSlug])

  return (
    <Stack space={4} padding={4}>
      <Text size={4}>Survey Analytics for {props.document.displayed?.name}</Text>
      <Card padding={4} shadow={1} radius={2} tone="neutral">
        <Stack space={2}>
          <Label size={2}>Time Period:</Label>
          <Inline space={2}>
            <Select
              value={timeframe}
              onChange={(event) => {
                const value = (event.target as HTMLSelectElement).value
                setTimeframe(value)
              }}
            >
              <option value="custom">Custom Range</option>
              <option value="last24hours">Last 24 Hours</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </Select>
            <Button
              tone="primary"
              text="Refresh"
              icon={RefreshIcon}
              onClick={fetchAnalyticsData}
              loading={loading}
            />
          </Inline>
          {timeframe === 'custom' && (
            <DatePicker
              style={{
                borderRadius: '4px',
                border: '1px solid var(--card-border-color)',
                fontSize: 'var(--font-size-2)',
                color: 'var(--text-color)',
                padding: '6px 12px',
                boxShadow: 'var(--card-shadow)',
                backgroundColor: 'var(--card-bg-color)',
              }}
              range
              onChange={(value) => {
                const [day1, day2] = value
                setStartDate(day1 ? day1.format('YYYY-MM-DD') : '')
                setEndDate(day2 ? day2.format('YYYY-MM-DD') : '')
              }}
            />
          )}
        </Stack>
      </Card>
      <Card padding={4} shadow={1} radius={2} tone="neutral">
        <Stack space={2}>
          {error && <Text style={{color: 'red'}}>Error: {error}</Text>}
          <BarChart
            style={{width: '100%', aspectRatio: 1.618}}
            responsive
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="questionTextPlain"
              tick={{fontSize: 12}}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
              tickFormatter={(value) => {
                const text = String(value || '')
                return text.length > 12 ? `${text.slice(0, 12)}...` : text
              }}
            />
            <YAxis width="auto" />
            <Tooltip
              content={({active, payload, label}) => {
                if (active && payload && payload.length) {
                  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0)
                  return (
                    <Card padding={3} shadow={1} radius={2} tone="default">
                      <Stack space={2}>
                        <Text weight="semibold">{`${label}`}</Text>
                        {payload.map((entry, index) => (
                          <Text key={index} style={{color: entry.color}}>
                            {`${
                              entry.dataKey === 'positive'
                                ? 'Positive'
                                : entry.dataKey === 'negative'
                                  ? 'Negative'
                                  : 'Impressions'
                            }: ${entry.value}`}
                          </Text>
                        ))}
                        <Text weight="semibold">{`Total: ${total}`}</Text>
                      </Stack>
                    </Card>
                  )
                }
                return null
              }}
            />
            <Legend />

            <Bar
              dataKey="positive"
              stackId="a"
              fill="#4ade80"
              name="Positive Responses"
              activeBar={<Rectangle fill="#22c55e" stroke="#16a34a" />}
            />
            <Bar
              dataKey="negative"
              stackId="a"
              fill="#f87171"
              name="Negative Responses"
              activeBar={<Rectangle fill="#ef4444" stroke="#dc2626" />}
            />
            <Bar
              dataKey="impressions"
              fill="#9ca3af"
              name="Impressions"
              activeBar={<Rectangle fill="#6b7280" stroke="#4b5563" />}
            />
          </BarChart>
        </Stack>
      </Card>
      <Card padding={4} shadow={1} radius={2} tone="neutral">
        <Grid
          data={data.map((item) => ({
            questionIndex: item.questionIndex + 1,
            questionText: convertBlocksToPlainText(item.questionText),
            positive: item.positive || 0,
            negative: item.negative || 0,
            impressions: item.impressions || 0,
            total: item.total,
          }))}
          sort={true}
          resizable
          columns={[
            {name: '#', id: 'questionIndex', width: '80px'},
            {id: 'questionText', name: 'Question'},
            {id: 'positive', name: '+', width: '80px'},
            {id: 'negative', name: '-', width: '80px'},
            {id: 'total', name: 'Total', width: '80px'},
            {id: 'impressions', name: 'Impressions', width: '80px'},
          ]}
        />
      </Card>
    </Stack>
  )
}

export function convertBlocksToPlainText(blocks: any[]): string {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map((child: any) => child.text).join('')
    })
    .join('\n\n')
}
