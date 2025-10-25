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
      name: 'responseOptions',
      title: 'Response Options',
      type: 'array',
      of: [{type: 'string'}],
      validation: (Rule) =>
        Rule.required().min(2).error('At least two response options are required.'),
    }),
  ],
})
