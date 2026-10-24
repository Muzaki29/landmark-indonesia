import { describe, expect, it } from 'vitest'
import { resolveLocale } from './i18n'

describe('language preference', () => {
  it('defaults to Indonesian and lets the URL override persisted state', () => {
    expect(resolveLocale('', null)).toBe('id')
    expect(resolveLocale('', 'en')).toBe('en')
    expect(resolveLocale('?lang=id', 'en')).toBe('id')
    expect(resolveLocale('?lang=en', 'id')).toBe('en')
    expect(resolveLocale('?lang=id', 'id', '/en/jakarta/national-monument')).toBe('en')
  })
})
