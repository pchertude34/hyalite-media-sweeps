'use client'
import React, {useState} from 'react'
import clxs from 'clsx'

type Props = {
  answers: {
    _key?: string
    answerText: string
    answerUrl?: string
  }[]
  className?: string
  onAnswer: (answer: {_key?: string; answerText: string; answerUrl?: string}) => void
}

export default function QuestionOptions({answers, className, onAnswer}: Props) {
  if (!Array.isArray(answers) || answers.length === 0) {
    return <div className="text-sm text-gray-500">No options provided.</div>
  }

  return (
    <ul
      className={clxs(
        'flex flex-col sm:flex-row gap-4 justify-center mx-auto items-stretch',
        className,
      )}
    >
      {answers.map((answer) => {
        return (
          <li key={answer._key} className="flex-1 flex">
            <button
              type="button"
              onClick={() => {
                onAnswer(answer)
              }}
              className="text-lg cursor-pointer rounded-md bg-blue-900 px-4 py-4 text-white hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full"
            >
              {answer.answerText}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
