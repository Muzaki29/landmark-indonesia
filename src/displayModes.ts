import type { BlueprintView, DisplayMode } from './state/experienceState'

export const DISPLAY_MODES = ['real', 'clay', 'xray', 'blueprint'] as const
export const BLUEPRINT_VIEWS = ['FRONT', 'SIDE', 'TOP'] as const

type DisplayCapabilities = Record<DisplayMode, { status: 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE' }>

export function requestedDisplayMode(search: string): DisplayMode {
  const value = new URLSearchParams(search).get('display')
  return DISPLAY_MODES.includes(value as DisplayMode) ? value as DisplayMode : 'real'
}

export function requestedBlueprintView(search: string): BlueprintView {
  const value = new URLSearchParams(search).get('view')?.toUpperCase()
  return BLUEPRINT_VIEWS.includes(value as BlueprintView) ? value as BlueprintView : 'FRONT'
}

export function resolveDisplayMode(requested: DisplayMode, capabilities: DisplayCapabilities): DisplayMode {
  return capabilities[requested].status === 'UNAVAILABLE' ? 'real' : requested
}

export function displaySearch(search: string, mode: DisplayMode, view: BlueprintView): string {
  const params = new URLSearchParams(search)
  if (mode === 'real') params.delete('display')
  else params.set('display', mode)
  if (mode === 'blueprint') params.set('view', view.toLowerCase())
  else params.delete('view')
  const value = params.toString()
  return value ? `?${value}` : ''
}

export function shouldLoadDisplayManifest(mode: DisplayMode, landmarkSlug: string) {
  return landmarkSlug === 'monas' && (mode === 'xray' || mode === 'blueprint')
}
