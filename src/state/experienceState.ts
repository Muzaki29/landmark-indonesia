export type LandmarkSection = 'overview' | 'history' | 'architecture' | 'timeline' | 'cultural-context' | 'connected-heritage' | 'sources'
export type ExperiencePanel = 'explore' | 'compare' | 'about' | 'collection-sources' | LandmarkSection | null
export type ExploreMode = 'explore' | 'architecture' | 'history'

export const landmarkSections: { id: LandmarkSection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'History' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'cultural-context', label: 'Cultural Context' },
  { id: 'connected-heritage', label: 'Connected Heritage' },
  { id: 'sources', label: 'Sources' },
]

export interface ExperienceState {
  provinceId: string
  panel: ExperiencePanel
}

export type ExperienceAction =
  | { type: 'select-province'; provinceId: string }
  | { type: 'open-panel'; panel: Exclude<ExperiencePanel, null> }
  | { type: 'close-panel' }

export const initialExperienceState: ExperienceState = {
  provinceId: 'province-jakarta',
  panel: null,
}

export function experienceReducer(state: ExperienceState, action: ExperienceAction): ExperienceState {
  switch (action.type) {
    case 'select-province':
      return { provinceId: action.provinceId, panel: null }
    case 'open-panel':
      return { ...state, panel: action.panel }
    case 'close-panel':
      return { ...state, panel: null }
  }
}
