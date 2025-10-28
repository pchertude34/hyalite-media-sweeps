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
      of: [{type: 'answer'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
