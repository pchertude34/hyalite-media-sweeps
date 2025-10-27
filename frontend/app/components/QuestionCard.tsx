'use client'
import React, {useState} from 'react'
import QuestionResponseButtons from './QuestionResponseButtons'
import {ClientQuestionQueryResult, Question} from '@/sanity.types'
import {InferSelectModel} from 'drizzle-orm'
import {usersTable} from '@/db/schema'

type QuestionCardProps = {
  leadingQuestion: Question
  surveyQuestions: Question[]
  user?: InferSelectModel<typeof usersTable>
  onSurveyQuestionAnswered: (data: FormData) => void
}

export function QuestionCard(props: QuestionCardProps) {
  const {leadingQuestion, surveyQuestions, user, onSurveyQuestionAnswered} = props
  const [hasAnsweredLeadingQuestion, setHasAnsweredLeadingQuestion] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(
    user?.page && user?.page < surveyQuestions.length ? user?.page : 0,
  )

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
    // wrap around to the first question if at the end
    setQuestionIndex((prevIndex) => {
      if (prevIndex + 1 >= surveyQuestions.length) {
        return 0
      }
      return prevIndex + 1
    })

    if (answer.answerUrl) {
      window.open(answer.answerUrl, '_blank', 'noopener,noreferrer')
    }

    if (user) {
      const formData = new FormData()
      formData.append('externalId', user.externalId)
      formData.append('page', String(questionIndex + 1))
      onSurveyQuestionAnswered(formData)
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
