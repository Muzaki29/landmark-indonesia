import { describe, expect, it } from 'vitest'
import { provinces } from './data/heritage'
import { createPageMetadata, SITE_URL } from './seo'

describe('public metadata', () => {
  it('generates localized canonical, alternate, Open Graph image, and structured data', () => {
    const metadata = createPageMetadata({ locale: 'id', entered: true, provinceId: 'province-jakarta', panel: 'archive' }, provinces[0])
    expect(metadata.canonical).toBe(`${SITE_URL}/id/jakarta/monumen-nasional/arsip`)
    expect(metadata.alternateEn).toBe(`${SITE_URL}/en/jakarta/national-monument/archive`)
    expect(metadata.image).toBe(`${SITE_URL}/og/monas-id.png`)
    expect(JSON.stringify(metadata.structuredData)).toContain('TouristAttraction')
  })

  it('uses landmark-specific metadata', () => {
    const titles = provinces.map((province) => createPageMetadata({ locale: 'en', entered: true, provinceId: province.id, panel: null }, province).title)
    expect(new Set(titles).size).toBe(3)
  })
})
