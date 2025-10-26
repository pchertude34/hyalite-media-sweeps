'use client'
import React, {useState} from 'react'
import QuestionResponseButtons from './QuestionResponseButtons'
import {ClientQuestionQueryResult, Question} from '@/sanity.types'

type QuestionCardProps = {
  leadingQuestion: Question
  surveyQuestions: Question[]
}

export function QuestionCard(props: QuestionCardProps) {
  const {leadingQuestion, surveyQuestions} = props
  const [hasAnsweredLeadingQuestion, setHasAnsweredLeadingQuestion] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)

  function handleLeadingQuestionAnswered(answer: {
    _key?: string
    answerText: string
    answerUrl?: string
  }) {
    setHasAnsweredLeadingQuestion(true)
  }

  function handleSurveyQuestionAnswered(answer: {
    _key?: string
    answerText: string
    answerUrl?: string
  }) {
    setQuestionIndex((prevIndex) => prevIndex + 1)

    if (answer.answerUrl) {
      window.open(answer.answerUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-800 p-4">
      <article className="flex flex-col w-full max-w-4xl min-h-64 p-6 rounded-lg shadow-sm bg-white items-center">
        <div className="my-auto h-full w-full">
          {!hasAnsweredLeadingQuestion ? (
            <>
              <h2 className="text-2xl font-semibold mb-10 text-center">
                {leadingQuestion.questionText}
              </h2>
              <QuestionResponseButtons
                answers={leadingQuestion.answers}
                onAnswer={handleLeadingQuestionAnswered}
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center mb-10">
                {surveyQuestions[questionIndex].questionText}
              </h2>
              <QuestionResponseButtons
                answers={surveyQuestions[questionIndex].answers}
                onAnswer={handleSurveyQuestionAnswered}
              />
            </>
          )}
        </div>
      </article>
    </div>
  )
}
