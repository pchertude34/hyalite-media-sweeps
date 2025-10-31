import React from 'react'
import {BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

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

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

export function AnalyticsGraph(props: AnalyticsGraphProps) {
  return (
    <div>
      <BarChart
        style={{width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618}}
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
        <XAxis dataKey="name" />
        <YAxis width="auto" />
        <Tooltip
          content={({active, payload, label}) => {
            if (active && payload && payload.length) {
              const total = payload.reduce((sum, entry) => sum + entry.value, 0)
              return (
                <div className="bg-white p-2 border rounded shadow">
                  <p>{`${label}`}</p>
                  {payload.map((entry, index) => (
                    <p key={index} style={{color: entry.color}}>
                      {`${entry.dataKey}: ${entry.value}`}
                    </p>
                  ))}
                  <p className="font-bold">{`Total: ${total}`}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Bar
          dataKey="pv"
          stackId="a"
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
        <Bar
          dataKey="uv"
          stackId="a"
          fill="#82ca9d"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
      </BarChart>
    </div>
  )
}
