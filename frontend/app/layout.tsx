import './globals.css'

import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing, toPlainText} from 'next-sanity'
import {Toaster} from 'sonner'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {DraftModeToast} from '@/app/components/DraftModeToast'

import {handleError} from './client-utils'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
// export async function generateMetadata(): Promise<Metadata> {
//   const {data: settings} = await sanityFetch({
//     query: settingsQuery,
//     perspective: 'published',
//     // Metadata should never contain stega
//     stega: false,
//   })
//   const title = 'Sweeps'
//   // const description = settings?.description || demo.description

//   return {
//     title: {
//       template: `%s | ${title}`,
//       default: title,
//     },
//     // description: toPlainText(description),
//   }
// }

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <body>
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <SanityLive onError={handleError} />
        <main>{children}</main>
      </body>
    </html>
  )
}
