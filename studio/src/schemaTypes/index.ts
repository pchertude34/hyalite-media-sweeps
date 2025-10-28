import {settings} from './singletons/settings'
import {client} from './documents/client'
import {question} from './objects/question'
import {answer} from './objects/answer'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  client,
  // Objects
  question,
  answer,
]
