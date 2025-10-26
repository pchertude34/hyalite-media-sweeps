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
      name: 'leadingQuestion',
      title: 'Leading Question',
      type: 'question',
    }),
    defineField({
      name: 'surveyQuestions',
      title: 'Survey Questions',
      type: 'array',
      of: [{type: 'question'}],
    }),
  ],
})
