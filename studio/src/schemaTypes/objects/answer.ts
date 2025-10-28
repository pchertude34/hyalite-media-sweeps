import {defineField, defineType} from 'sanity'

export const answer = defineType({
  name: 'answer',
  title: 'Answer',
  type: 'object',
  fields: [
    defineField({
      name: 'answerText',
      title: 'Answer Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answerUrl',
      title: 'Answer URL',
      type: 'url',
      description: 'Optional URL to navigate to when this answer is selected.',
    }),
    defineField({
      name: 'answerType',
      title: 'Answer Type',
      type: 'string',
      options: {
        list: [
          {title: 'Positive', value: 'positive'},
          {title: 'Negative', value: 'negative'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Answer type is required.'),
      initialValue: 'positive',
    }),
  ],
})
