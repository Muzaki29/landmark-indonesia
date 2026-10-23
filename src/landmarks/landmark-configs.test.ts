import { describe, expect, it } from 'vitest'
import { JAM_GADANG_MODEL } from './jam-gadang/config'
import { TUGU_MODEL } from './tugu/config'

describe('procedural landmark configurations', () => {
  it('keeps Tugu levels within its model height', () => {
    expect(TUGU_MODEL.shaftBottom + TUGU_MODEL.shaftHeight).toBeLessThan(TUGU_MODEL.totalHeight)
  })

  it('scales the verified Jam Gadang height consistently', () => {
    expect(JAM_GADANG_MODEL.verifiedHeightMetres * JAM_GADANG_MODEL.sceneScale).toBe(JAM_GADANG_MODEL.totalHeight)
    expect(JAM_GADANG_MODEL.roofBase).toBeGreaterThan(JAM_GADANG_MODEL.clockCentre)
  })
})
