import { describe, expect, it } from 'vitest'
import { displaySearch, requestedBlueprintView, requestedDisplayMode, resolveDisplayMode, shouldLoadDisplayManifest } from './displayModes'

const capabilities = {
  real: { status: 'AVAILABLE' as const }, clay: { status: 'AVAILABLE' as const },
  xray: { status: 'LIMITED' as const }, blueprint: { status: 'UNAVAILABLE' as const },
}

describe('display modes', () => {
  it('defaults invalid and missing queries to real', () => {
    expect(requestedDisplayMode('')).toBe('real')
    expect(requestedDisplayMode('?display=unknown')).toBe('real')
  })

  it('keeps available and limited modes but falls back from unavailable modes', () => {
    expect(resolveDisplayMode('clay', capabilities)).toBe('clay')
    expect(resolveDisplayMode('xray', capabilities)).toBe('xray')
    expect(resolveDisplayMode('blueprint', capabilities)).toBe('real')
  })

  it('serializes one mode and blueprint view without losing other queries', () => {
    expect(displaySearch('?lang=en&display=xray', 'blueprint', 'SIDE')).toBe('?lang=en&display=blueprint&view=side')
    expect(displaySearch('?lang=en&display=clay&view=top', 'real', 'FRONT')).toBe('?lang=en')
    expect(requestedBlueprintView('?display=blueprint&view=top')).toBe('TOP')
  })

  it('keeps manifest assets lazy until Monas needs X-Ray or Blueprint metadata', () => {
    expect(shouldLoadDisplayManifest('real', 'monas')).toBe(false)
    expect(shouldLoadDisplayManifest('blueprint', 'monas')).toBe(true)
    expect(shouldLoadDisplayManifest('blueprint', 'tugu-pal-putih')).toBe(false)
  })
})
