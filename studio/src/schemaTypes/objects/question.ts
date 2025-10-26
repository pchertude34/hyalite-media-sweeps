import {defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

export const question = defineType({
  name: 'question',
  title: 'Question',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'questionText',
      title: 'Question Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answers',
      title: 'Answers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'answerText',
              description: 'The text to display in the button',
              title: 'Answer',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answerUrl',
              description:
                'Optional: URL to link to when this option is selected. If a question has no URL, the user will be taken to the next question when selected.',
              title: 'Answer URL',
              type: 'url',
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.required().min(2).error('At least two response options are required.'),
    }),
  ],
})
