import {pathsAreEqual, stringToPath} from 'sanity'
import {defineMigration, set} from 'sanity/migrate'

const targetPath = stringToPath('leadingQuestion.questionText')

export default defineMigration({
  title: 'string to block content',
  documentTypes: ['client'],

  migrate: {
    string(node, path, ctx) {
      if (pathsAreEqual(path, targetPath)) {
        return set([
          {
            style: 'normal',
            _type: 'block',
            children: [
              {
                _type: 'span',
                marks: [],
                text: node,
              },
            ],
            markDefs: [],
          },
        ])
      }
    },
  },
})
