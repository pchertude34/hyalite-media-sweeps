import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

/**
 * Client schema.  Define and edit the fields for the 'client' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      description: 'A message to display at the top of the survey.',
    }),
    defineField({
      name: 'maxAnswers',
      title: 'Maximum Answers',
      type: 'number',
      initialValue: 5,
      description:
        'Maximum number of answers a user can submit before showing the thank you message. Leave empty for unlimited.',
    }),
    defineField({
      name: 'leadingQuestion',
      title: 'Leading Question',
      type: 'question',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'surveyQuestions',
      title: 'Survey Questions',
      type: 'array',
      of: [{type: 'question'}],
      validation: (Rule) =>
        Rule.required().min(1).error('At least one survey question is required.'),
    }),
    defineField({
      name: 'thankYouMessage',
      title: 'Thank You Message',
      type: 'text',
      description: 'Message to display to users after they complete the survey.',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
