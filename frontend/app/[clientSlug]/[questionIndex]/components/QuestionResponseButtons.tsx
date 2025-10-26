'use client'
import React, {useState} from 'react'

type Props = {
  options: string[]
}

export default function QuestionOptions({options}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!Array.isArray(options) || options.length === 0) {
    return <div className="text-sm text-gray-500">No options provided.</div>
  }

  return (
    <ul className="space-y-3">
      {options.map((opt, i) => {
        const selected = i === selectedIndex
        return (
          <li key={i}>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setSelectedIndex(i)
                console.log('selected option', i, opt)
              }}
              className={`w-full text-left p-3 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                selected
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-800'
              }`}
            >
              {opt}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
