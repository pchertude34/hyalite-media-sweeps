'use client'

import {isCorsOriginError} from 'next-sanity'
import {toast} from 'sonner'

export function handleError(error: unknown) {
  if (isCorsOriginError(error)) {
    // If the error is a CORS origin error, let's display that specific error.
    const {addOriginUrl} = error
    toast.error(`Sanity Live couldn't connect`, {
      description: `Your origin is blocked by CORS policy`,
      duration: Infinity,
      action: addOriginUrl
        ? {
            label: 'Manage',
            onClick: () => window.open(addOriginUrl.toString(), '_blank'),
          }
        : undefined,
    })
  } else if (error instanceof Error) {
    console.error(error)
    toast.error(error.name, {description: error.message, duration: Infinity})
  } else {
    console.error(error)
    toast.error('Unknown error', {
      description: 'Check the console for more details',
      duration: Infinity,
    })
  }
}

export function renderTemplate(template: string, values: Record<string, string | undefined>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '')
}

export function renderTemplateInBlockContent(
  blocks: any[],
  values: Record<string, string | undefined>,
): any[] {
  return blocks.map((block) => {
    if (block._type !== 'block' || !block.children) {
      return block
    }
    return {
      ...block,
      children: block.children.map((child: any) => ({
        ...child,
        text: renderTemplate(child.text, values),
      })),
    }
  })
}

export function convertBlocksToPlainText(blocks: any[]): string {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map((child: any) => child.text).join('')
    })
    .join('\n\n')
}
