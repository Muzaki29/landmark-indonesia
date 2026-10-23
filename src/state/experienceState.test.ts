import { describe, expect, it } from 'vitest'
import { experienceReducer, initialExperienceState } from './experienceState'

describe('experience navigation', () => {
  it('switches province and closes the current panel', () => {
    const open = experienceReducer(initialExperienceState, { type: 'open-panel', panel: 'history' })
    expect(experienceReducer(open, { type: 'select-province', provinceId: 'province-yogyakarta' })).toEqual({
      provinceId: 'province-yogyakarta',
      panel: null,
    })
  })

  it('opens and closes information sections', () => {
    const open = experienceReducer(initialExperienceState, { type: 'open-panel', panel: 'timeline' })
    expect(open.panel).toBe('timeline')
    expect(experienceReducer(open, { type: 'close-panel' }).panel).toBeNull()
  })
})
