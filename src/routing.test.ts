import { describe, expect, it } from 'vitest'
import { landmarkPath, parsePublicRoute } from './routing'

describe('public landmark routes', () => {
  it('resolves locale, landmark, and deep-linked section', () => {
    expect(parsePublicRoute('/id/jakarta/monumen-nasional/sejarah')).toMatchObject({ locale: 'id', provinceId: 'province-jakarta', panel: 'history', entered: true })
    expect(parsePublicRoute('/en/jakarta/national-monument/archive')).toMatchObject({ locale: 'en', provinceId: 'province-jakarta', panel: 'archive', entered: true })
    expect(parsePublicRoute('/id/yogyakarta/tugu-pal-putih')).toMatchObject({ locale: 'id', provinceId: 'province-yogyakarta', panel: null, entered: true })
  })

  it('builds localized landmark URLs', () => {
    expect(landmarkPath('province-jakarta', 'id', 'sources')).toBe('/id/jakarta/monumen-nasional/sumber')
    expect(landmarkPath('province-jakarta', 'en')).toBe('/en/jakarta/national-monument')
    expect(landmarkPath('province-sumatera-barat', 'en')).toBe('/en/west-sumatra/jam-gadang')
  })
})
