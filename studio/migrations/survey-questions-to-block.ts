import {pathsAreEqual, stringToPath} from 'sanity'
import {defineMigration, set} from 'sanity/migrate'

const targetPath = stringToPath('surveyQuestions')

export default defineMigration({
  title: 'string to block content',
  documentTypes: ['client'],

  migrate: {
    array(node, path, ctx) {
      if (pathsAreEqual(path, targetPath)) {
        const updatedQuestions = node.map((question: any) => {
          if (typeof question.questionText === 'string') {
            return {
              ...question,
              questionText: [
                {
                  style: 'normal',
                  _type: 'block',
                  children: [
                    {
                      _type: 'span',
                      marks: [],
                      text: question.questionText,
                    },
                  ],
                  markDefs: [],
                },
              ],
            }
          }
          return question
        })
        return set(updatedQuestions)
      }
    },
  },

  // migrate: {
  //   document(doc, context) {
  //     console.log('doc.surveyQuestions :>> ', doc.surveyQuestions)
  //     if (Array.isArray(doc.surveyQuestions)) {
  //       const updatedQuestions = doc.surveyQuestions.map((question: any) => {
  //         if (typeof question.questionText === 'string') {
  //           return {
  //             ...question,
  //             questionText: [
  //               {
  //                 style: 'normal',
  //                 _type: 'block',
  //                 children: [
  //                   {
  //                     _type: 'span',
  //                     marks: [],
  //                     text: question.questionText,
  //                   },
  //                 ],
  //                 markDefs: [],
  //               },
  //             ],
  //           }
  //         }
  //         return question
  //       })
  //       console.log('updatedQuestions :>> ', updatedQuestions)
  //       return {...doc, surveyQuestions: updatedQuestions}
  //     }

  //     return doc
  //   },
  // },
})
