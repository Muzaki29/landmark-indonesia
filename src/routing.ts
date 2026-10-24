import type { Locale } from './i18n'
import type { Province } from './data/heritage'
import type { ExperiencePanel, LandmarkSection } from './state/experienceState'

type LandmarkRoute = {
  provinceId: Province['id']
  province: Record<Locale, string>
  landmark: Record<Locale, string>
}

export const LANDMARK_ROUTES: LandmarkRoute[] = [
  { provinceId: 'province-jakarta', province: { id: 'jakarta', en: 'jakarta' }, landmark: { id: 'monumen-nasional', en: 'national-monument' } },
  { provinceId: 'province-yogyakarta', province: { id: 'yogyakarta', en: 'yogyakarta' }, landmark: { id: 'tugu-pal-putih', en: 'tugu-pal-putih' } },
  { provinceId: 'province-sumatera-barat', province: { id: 'sumatera-barat', en: 'west-sumatra' }, landmark: { id: 'jam-gadang', en: 'jam-gadang' } },
]

const SECTION_SLUGS: Record<LandmarkSection, Record<Locale, string>> = {
  overview: { id: 'ikhtisar', en: 'overview' },
  history: { id: 'sejarah', en: 'history' },
  architecture: { id: 'arsitektur', en: 'architecture' },
  timeline: { id: 'linimasa', en: 'timeline' },
  'cultural-context': { id: 'konteks-budaya', en: 'cultural-context' },
  'connected-heritage': { id: 'keterkaitan-warisan', en: 'connected-heritage' },
  archive: { id: 'arsip', en: 'archive' },
  sources: { id: 'sumber', en: 'sources' },
}

export interface PublicRoute {
  locale: Locale
  provinceId?: string
  panel: ExperiencePanel
  entered: boolean
}

export function landmarkPath(provinceId: string, locale: Locale, section?: LandmarkSection) {
  const route = LANDMARK_ROUTES.find((item) => item.provinceId === provinceId) ?? LANDMARK_ROUTES[0]
  const base = `/${locale}/${route.province[locale]}/${route.landmark[locale]}`
  return section ? `${base}/${SECTION_SLUGS[section][locale]}` : base
}

export function publicPath(route: PublicRoute) {
  if (!route.entered) return `/${route.locale}`
  if (route.panel === 'explore') return `/${route.locale}/${route.locale === 'id' ? 'jelajahi' : 'explore'}`
  if (route.panel === 'about') return `/${route.locale}/${route.locale === 'id' ? 'tentang' : 'about'}`
  const section = route.panel && !['compare', 'collection-sources'].includes(route.panel) ? route.panel as LandmarkSection : undefined
  return landmarkPath(route.provinceId ?? LANDMARK_ROUTES[0].provinceId, route.locale, section)
}

export function parsePublicRoute(pathname: string): PublicRoute {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  const locale: Locale = parts[0] === 'en' ? 'en' : 'id'
  if (parts.length <= 1) return { locale, panel: null, entered: false }
  if (parts[1] === (locale === 'id' ? 'jelajahi' : 'explore')) return { locale, panel: 'explore', entered: true }
  if (parts[1] === (locale === 'id' ? 'tentang' : 'about')) return { locale, panel: 'about', entered: true }

  const landmark = LANDMARK_ROUTES.find((item) => item.province[locale] === parts[1] && item.landmark[locale] === parts[2])
  if (!landmark) return { locale, panel: null, entered: false }
  const section = Object.entries(SECTION_SLUGS).find(([, slugs]) => slugs[locale] === parts[3])?.[0] as LandmarkSection | undefined
  return { locale, provinceId: landmark.provinceId, panel: section ?? null, entered: true }
}

export const SITEMAP_PATHS = [
  '/id', '/en', '/id/jelajahi', '/en/explore', '/id/tentang', '/en/about',
  ...LANDMARK_ROUTES.flatMap((route) => (['id', 'en'] as const).flatMap((locale) => [
    landmarkPath(route.provinceId, locale),
    ...(['history', 'architecture', 'archive', 'sources'] as LandmarkSection[]).map((section) => landmarkPath(route.provinceId, locale, section)),
  ])),
]
