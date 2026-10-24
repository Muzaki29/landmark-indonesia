import type { Province } from './data/heritage'
import { landmarkPath, publicPath, type PublicRoute } from './routing'
import type { LandmarkSection } from './state/experienceState'

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://muzaki29.github.io/landmark-indonesia').replace(/\/$/, '')

export interface PageMetadata {
  title: string
  description: string
  canonical: string
  alternateId: string
  alternateEn: string
  image: string
  structuredData: Record<string, unknown>
}

export function createPageMetadata(route: PublicRoute, province: Province): PageMetadata {
  const { locale } = route
  const landmark = province.landmark
  const section = route.panel && !['explore', 'compare', 'about', 'collection-sources'].includes(route.panel) ? route.panel as LandmarkSection : undefined
  const path = publicPath(route)
  const canonical = `${SITE_URL}${path}`
  const isLandmark = route.entered && Boolean(route.provinceId) && route.panel !== 'explore' && route.panel !== 'about'
  const title = isLandmark
    ? `${landmark.name}${section ? ` · ${section.replaceAll('-', ' ')}` : ''} · Indonesia 3D Landmarks`
    : route.panel === 'explore' ? `${locale === 'id' ? 'Jelajahi Indonesia' : 'Explore Indonesia'} · Indonesia 3D Landmarks`
      : route.panel === 'about' ? `${locale === 'id' ? 'Tentang Proyek' : 'About the Project'} · Indonesia 3D Landmarks`
        : 'Indonesia 3D Landmarks'
  const description = isLandmark ? landmark.shortDescription : locale === 'id'
    ? 'Jelajahi warisan Indonesia melalui landmark 3D interaktif dan bukti sumber yang dapat ditelusuri.'
    : 'Explore Indonesian heritage through interactive 3D landmarks and traceable source evidence.'
  const alternateRoute = { ...route, locale: locale === 'id' ? 'en' as const : 'id' as const }
  const image = `${SITE_URL}/og/${landmark.slug}-${locale}.png`
  const structuredData = isLandmark ? {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', name: title, description, url: canonical, inLanguage: locale, mainEntity: { '@id': `${canonical}#landmark` } },
      { '@type': 'TouristAttraction', '@id': `${canonical}#landmark`, name: landmark.name, description: landmark.shortDescription, geo: landmark.coordinates && { '@type': 'GeoCoordinates', latitude: landmark.coordinates.latitude, longitude: landmark.coordinates.longitude } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Indonesia 3D Landmarks', item: `${SITE_URL}/${locale}` },
        { '@type': 'ListItem', position: 2, name: province.name, item: `${SITE_URL}${landmarkPath(province.id, locale)}` },
        ...(section ? [{ '@type': 'ListItem', position: 3, name: section.replaceAll('-', ' '), item: canonical }] : []),
      ] },
    ],
  } : { '@context': 'https://schema.org', '@type': route.entered ? 'WebPage' : 'WebSite', name: title, description, url: canonical, inLanguage: locale }

  return {
    title, description, canonical, image, structuredData,
    alternateId: `${SITE_URL}${publicPath(locale === 'id' ? route : alternateRoute)}`,
    alternateEn: `${SITE_URL}${publicPath(locale === 'en' ? route : alternateRoute)}`,
  }
}

function meta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.append(element)
  }
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
}

function link(rel: string, hreflang?: string) {
  const selector = `link[rel="${rel}"]${hreflang ? `[hreflang="${hreflang}"]` : ''}`
  let element = document.head.querySelector<HTMLLinkElement>(selector)
  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    if (hreflang) element.hreflang = hreflang
    document.head.append(element)
  }
  return element
}

export function applyPageMetadata(metadata: PageMetadata) {
  document.title = metadata.title
  meta('meta[name="description"]', { name: 'description', content: metadata.description })
  meta('meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' })
  meta('meta[property="og:title"]', { property: 'og:title', content: metadata.title })
  meta('meta[property="og:description"]', { property: 'og:description', content: metadata.description })
  meta('meta[property="og:image"]', { property: 'og:image', content: metadata.image })
  meta('meta[property="og:url"]', { property: 'og:url', content: metadata.canonical })
  meta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
  meta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
  meta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title })
  meta('meta[name="twitter:description"]', { name: 'twitter:description', content: metadata.description })
  meta('meta[name="twitter:image"]', { name: 'twitter:image', content: metadata.image })
  link('canonical').href = metadata.canonical
  link('alternate', 'id').href = metadata.alternateId
  link('alternate', 'en').href = metadata.alternateEn
  link('alternate', 'x-default').href = metadata.alternateId
  let script = document.head.querySelector<HTMLScriptElement>('script[data-heritage-structured-data]')
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.heritageStructuredData = ''
    document.head.append(script)
  }
  script.textContent = JSON.stringify(metadata.structuredData)
}
