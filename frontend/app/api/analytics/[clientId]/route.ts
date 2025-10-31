import {NextRequest, NextResponse} from 'next/server'
import {db} from '@/db'
import {questionAnalyticsTable} from '@/db/schema'
import {eq, count, and, gte, lte, sql} from 'drizzle-orm'

const {NEXT_PUBLIC_SANITY_STUDIO_URL = ''} = process.env

export async function GET(request: NextRequest, {params}: {params: Promise<{clientId: string}>}) {
  try {
    const {clientId} = await params
    const {searchParams} = new URL(request.url)

    // Get timeframe parameters
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const timeframe = searchParams.get('timeframe') // 'last7days', 'last30days', 'last90days', 'custom'

    // Build date conditions
    let dateConditions: any[] = [eq(questionAnalyticsTable.clientId, clientId)]

    if (timeframe && timeframe !== 'all') {
      let startDateTime: Date | null = null
      let endDateTime: Date | null = null

      switch (timeframe) {
        case 'last24hours':
          startDateTime = new Date(Date.now() - 24 * 60 * 60 * 1000)
          break
        case 'last7days':
          startDateTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'last30days':
          startDateTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'last90days':
          startDateTime = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          break
        case 'custom':
          if (startDate) startDateTime = new Date(startDate)
          if (endDate) endDateTime = new Date(endDate + 'T23:59:59.999Z') // End of day
          break
      }

      if (startDateTime) {
        dateConditions.push(gte(questionAnalyticsTable.createdAt, startDateTime))
      }
      if (endDateTime) {
        dateConditions.push(lte(questionAnalyticsTable.createdAt, endDateTime))
      }
    }

    // Get analytics data for this client with date filtering
    const analytics = await db
      .select({
        questionId: questionAnalyticsTable.questionId,
        answerText: questionAnalyticsTable.answerText,
        answerStatus: questionAnalyticsTable.answerStatus,
        count: count(),
      })
      .from(questionAnalyticsTable)
      .where(and(...dateConditions))
      .groupBy(
        questionAnalyticsTable.questionId,
        questionAnalyticsTable.answerText,
        questionAnalyticsTable.answerStatus,
      )

    // Transform data for charts
    const chartData = analytics.reduce((acc: any[], item) => {
      const existing = acc.find((d: any) => d.questionId === item.questionId)
      if (existing) {
        existing[item.answerStatus] = (existing[item.answerStatus] || 0) + item.count
        existing.total = (existing.total || 0) + item.count
      } else {
        acc.push({
          questionId: item.questionId,
          [item.answerStatus]: item.count,
          total: item.count,
        })
      }
      return acc
    }, [])

    const res = NextResponse.json({
      success: true,
      data: chartData,
    })

    res.headers.set('Access-Control-Allow-Origin', NEXT_PUBLIC_SANITY_STUDIO_URL)
    res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return res
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({success: false, error: 'Failed to fetch analytics'}, {status: 500})
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, {status: 204})
  res.headers.set('Access-Control-Allow-Origin', NEXT_PUBLIC_SANITY_STUDIO_URL)
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return res
}
