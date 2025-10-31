import {AnalyticsGraph} from './components/AnalyticsGraph'
import type {DefaultDocumentNodeResolver} from 'sanity/structure'

export const defaultDocumentNodeResolver: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  if (schemaType === 'client') {
    return S.document().views([S.view.form(), S.view.component(AnalyticsGraph).title('Analytics')])
  }
}
