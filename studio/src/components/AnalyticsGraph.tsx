import React, {useEffect, useState} from 'react'
import {BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
import {Card, Stack, Box, Text, Label, Select, Inline, Button} from '@sanity/ui'
import {RefreshIcon} from '@sanity/icons'

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
  questionText: string
  questionId: string
  positive?: number
  negative?: number
  total: number
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
        `${SANITY_STUDIO_APP_URL}/api/analytics/${clientSlug}?${params.toString()}`,
      )
      const result = await response.json()

      if (result.success) {
        // add question index and text to each data item
        result.data = result.data.map((item: AnalyticsData) => {
          const questionIndex = surveyQuestions.findIndex((q: any) => q._key === item.questionId)
          const questionText =
            questionIndex !== -1 ? surveyQuestions[questionIndex].questionText : 'Unknown Question'
          return {
            ...item,
            questionText,
            questionIndex,
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
              dataKey="questionText"
              tick={{fontSize: 12}}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis width="auto" />
            <Tooltip
              content={({active, payload, label}) => {
                if (active && payload && payload.length) {
                  console.log('payload :>> ', payload)
                  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0)
                  return (
                    <Card padding={3} shadow={1} radius={2} tone="default">
                      <Stack space={2}>
                        <Text weight="semibold">{`${label}`}</Text>
                        {payload.map((entry, index) => (
                          <Text key={index} style={{color: entry.color}}>
                            {`${entry.dataKey === 'positive' ? 'Positive' : 'Negative'}: ${
                              entry.value
                            }`}
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
          </BarChart>
        </Stack>
      </Card>
    </Stack>
    // <div style={{padding: '20px'}}>
    //   <h3 style={{marginBottom: '20px'}}>Survey Analytics for {props.document.displayed?.name}</h3>

    //   {/* Timeframe Controls */}
    //   <div
    //     style={{
    //       marginBottom: '20px',
    //       padding: '15px',
    //       border: '1px solid #e1e5e9',
    //       borderRadius: '4px',
    //       backgroundColor: '#f9f9fb',
    //     }}
    //   >
    //     <div style={{marginBottom: '10px'}}>
    //       <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>
    //         Time Period:
    //       </label>
    //       <select
    //         value={timeframe}
    //         onChange={(e) => setTimeframe(e.target.value)}
    //         style={{padding: '5px 10px', borderRadius: '4px', border: '1px solid #ccc'}}
    //       >
    //         <option value="all">All Time</option>
    //         <option value="last7days">Last 7 Days</option>
    //         <option value="last30days">Last 30 Days</option>
    //         <option value="last90days">Last 90 Days</option>
    //         <option value="custom">Custom Range</option>
    //       </select>
    //     </div>

    //     {timeframe === 'custom' && (
    //       <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
    //         <div>
    //           <label style={{display: 'block', marginBottom: '5px', fontSize: '14px'}}>
    //             Start Date:
    //           </label>
    //           <input
    //             type="date"
    //             value={startDate}
    //             onChange={(e) => setStartDate(e.target.value)}
    //             style={{padding: '5px', borderRadius: '4px', border: '1px solid #ccc'}}
    //           />
    //         </div>
    //         <div>
    //           <label style={{display: 'block', marginBottom: '5px', fontSize: '14px'}}>
    //             End Date:
    //           </label>
    //           <input
    //             type="date"
    //             value={endDate}
    //             onChange={(e) => setEndDate(e.target.value)}
    //             style={{padding: '5px', borderRadius: '4px', border: '1px solid #ccc'}}
    //           />
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //   <BarChart
    //     style={{width: '100%', aspectRatio: 1.618}}
    //     responsive
    //     data={data}
    //     margin={{
    //       top: 5,
    //       right: 0,
    //       left: 0,
    //       bottom: 5,
    //     }}
    //   >
    //     <CartesianGrid strokeDasharray="3 3" />
    //     <XAxis
    //       dataKey="questionText"
    //       tick={{fontSize: 12}}
    //       interval={0}
    //       angle={-45}
    //       textAnchor="end"
    //       height={100}
    //     />
    //     <YAxis width="auto" />
    //     <Tooltip
    //       content={({active, payload, label}) => {
    //         if (active && payload && payload.length) {
    //           const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0)
    //           return (
    //             <div
    //               style={{
    //                 backgroundColor: 'white',
    //                 padding: '8px',
    //                 border: '1px solid #ccc',
    //                 borderRadius: '4px',
    //                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    //               }}
    //             >
    //               <p style={{margin: '0 0 4px 0', fontWeight: 'bold'}}>{`${label}`}</p>
    //               {payload.map((entry, index) => (
    //                 <p key={index} style={{color: entry.color, margin: '2px 0'}}>
    //                   {`${entry.dataKey === 'positive' ? 'Positive' : 'Negative'}: ${entry.value}`}
    //                 </p>
    //               ))}
    //               <p style={{fontWeight: 'bold', margin: '4px 0 0 0'}}>{`Total: ${total}`}</p>
    //             </div>
    //           )
    //         }
    //         return null
    //       }}
    //     />
    //     <Legend />
    //     <Bar
    //       dataKey="positive"
    //       stackId="a"
    //       fill="#4ade80"
    //       name="Positive Responses"
    //       activeBar={<Rectangle fill="#22c55e" stroke="#16a34a" />}
    //     />
    //     <Bar
    //       dataKey="negative"
    //       stackId="a"
    //       fill="#f87171"
    //       name="Negative Responses"
    //       activeBar={<Rectangle fill="#ef4444" stroke="#dc2626" />}
    //     />
    //   </BarChart>
    // </div>
  )
}
