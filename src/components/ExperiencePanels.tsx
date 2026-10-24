import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getComparisonLabels,
  getFurtherReadings,
  getProvinces,
  getSourcesForClaims,
  searchLandmarks,
  type Hotspot,
  type Landmark,
  type Province,
  type SourceRecord,
} from '../data/heritage'
import { landmarkSections, type ExperiencePanel, type ExploreMode, type LandmarkSection } from '../state/experienceState'
import type { CameraView } from '../data/heritage'
import { useI18n, type MessageKey } from '../i18n'
import { INDONESIA_MAP, projectIndonesiaPoint } from '../utils/mapProjection'

function relationLabel(value: string, t: (key: MessageKey) => string) {
  const labels: Record<string, MessageKey> = { PLACE: 'place', EVENT: 'event', PERSON: 'person', CULTURAL_CONTEXT: 'culturalContextGroup', FORM: 'form', STRUCTURE: 'structure', MATERIAL: 'material', FUNCTION: 'function', SYMBOLISM: 'symbolism' }
  return labels[value] ? t(labels[value]) : value
}

export function PrimaryNav({ active, onOpen }: { active: ExperiencePanel; onOpen: (panel: Exclude<ExperiencePanel, null>) => void }) {
  const { t } = useI18n()
  return (
    <nav className="primary-nav" aria-label={t('primary')}>
      {([['explore', 'explore'], ['about', 'about'], ['collection-sources', 'sources']] as const).map(([panel, key]) => (
        <button key={panel} type="button" aria-pressed={active === panel} onClick={() => onOpen(panel)}>{t(key)}</button>
      ))}
      <a href="https://saweria.co/muzakiabdullah" target="_blank" rel="noreferrer">{t('support')}<span aria-hidden="true">↗</span></a>
    </nav>
  )
}

export function ExploreModes({ mode, onMode }: { mode: ExploreMode; onMode: (mode: ExploreMode) => void }) {
  const { t } = useI18n()
  const labels = { explore: t('exploreMode'), architecture: t('architectureMode'), history: t('historyMode') }
  return (
    <div className="explore-modes" role="group" aria-label={t('explorationMode')}>
      {(['explore', 'architecture', 'history'] as const).map((item) => (
        <button key={item} type="button" aria-pressed={mode === item} onClick={() => onMode(item)}>{labels[item]}</button>
      ))}
    </div>
  )
}

export function ViewerControls({ views, activeView, labels, onView, onLabels, onReset }: {
  views: CameraView[]
  activeView: string
  labels: boolean
  onView: (id: CameraView['id']) => void
  onLabels: () => void
  onReset: () => void
}) {
  const { t } = useI18n()
  return <aside className="viewer-controls-panel" aria-label={t('inspectionControls')}><h2>{t('view')}</h2><div className="camera-presets">{views.map((view, index) => <button key={view.id} type="button" aria-pressed={activeView === view.id} onClick={() => onView(view.id)}><span>{index + 1}</span>{view.label}</button>)}</div><button className="labels-toggle" type="button" aria-pressed={labels} onClick={onLabels}>{t('labels')} <kbd>L</kbd></button><button className="reset-camera" type="button" onClick={onReset}>{t('resetView')} <kbd>R</kbd></button></aside>
}

export function ViewerToolbar({ fullscreen, onHelp, onZoomIn, onZoomOut, onFit, onFullscreen }: {
  fullscreen: boolean
  onHelp: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onFullscreen: () => void
}) {
  const { t } = useI18n()
  return <nav className="viewer-toolbar" aria-label={t('viewerToolbar')}><button type="button" onClick={onHelp}><span aria-hidden="true">?</span><strong>{t('help')}</strong></button><button type="button" onClick={onZoomIn}><span aria-hidden="true">＋</span><strong>{t('zoomIn')}</strong></button><button type="button" onClick={onZoomOut}><span aria-hidden="true">−</span><strong>{t('zoomOut')}</strong></button><button type="button" onClick={onFit}><span aria-hidden="true">⌂</span><strong>{t('fitView')}</strong></button><button type="button" onClick={onFullscreen}><span aria-hidden="true">⛶</span><strong>{fullscreen ? t('exitFullscreen') : t('fullscreen')}</strong></button></nav>
}

export function HelpPanel({ cameraViews, onClose }: { cameraViews: CameraView[]; onClose: () => void }) {
  const { t } = useI18n()
  return <aside className="experience-panel help-panel" aria-label={t('controlsShortcuts')}><PanelHeader eyebrow={t('viewerHelp')} title={t('controlsShortcuts')} onClose={onClose} /><div className="help-grid"><section><h3>{t('navigation')}</h3><dl><div><dt>{t('drag')}</dt><dd>{t('orbitLandmark')}</dd></div><div><dt>{t('scrollPinch')}</dt><dd>{t('zoom')}</dd></div><div><dt>{t('clickMarker')}</dt><dd>{t('selectFocus')}</dd></div></dl></section><section><h3>{t('camera')}</h3><dl>{cameraViews.map((view, index) => <div key={view.id}><dt>{index + 1}</dt><dd>{view.label} {t('cameraView')}</dd></div>)}<div><dt>R</dt><dd>{t('resetFit')}</dd></div></dl></section><section><h3>{t('exploration')}</h3><dl><div><dt>L</dt><dd>{t('componentLabels')}</dd></div><div><dt>?</dt><dd>{t('openHelp')}</dd></div><div><dt>Esc</dt><dd>{t('closePanelHotspot')}</dd></div></dl></section></div></aside>
}

export function SectionNavigation({ active, onOpen }: { active: LandmarkSection; onOpen: (section: LandmarkSection) => void }) {
  const { t } = useI18n()
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const sectionLabels: Record<LandmarkSection, string> = { overview: t('overview'), history: t('history'), architecture: t('architecture'), timeline: t('timeline'), 'cultural-context': t('culturalContext'), 'connected-heritage': t('connectedHeritage'), sources: t('sources') }

  function moveFocus(index: number, key: string) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return
    const next = key === 'Home' ? 0 : key === 'End' ? landmarkSections.length - 1 : (index + (key === 'ArrowDown' ? 1 : -1) + landmarkSections.length) % landmarkSections.length
    buttons.current[next]?.focus()
  }

  return (
    <nav className="section-nav" aria-label={t('landmarkInformation')}>
      <span className="section-nav-mark" aria-hidden="true">✦</span>
      {landmarkSections.map((section, index) => (
        <button
          key={section.id}
          ref={(node) => { buttons.current[index] = node }}
          type="button"
          aria-pressed={active === section.id}
          onClick={() => onOpen(section.id)}
          onKeyDown={(event) => {
            if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) event.preventDefault()
            moveFocus(index, event.key)
          }}
        >
          <span aria-hidden="true" />
          {sectionLabels[section.id]}
        </button>
      ))}
    </nav>
  )
}

export function CollectionNavigator({ provinces, activeId, onSelect, onExplore }: {
  provinces: Province[]
  activeId: string
  onSelect: (id: string) => void
  onExplore: () => void
}) {
  const { t } = useI18n()
  const buttons = useRef<Array<HTMLButtonElement | null>>([])

  function moveFocus(index: number, key: string) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return
    const next = key === 'Home' ? 0 : key === 'End' ? provinces.length - 1 : (index + (key === 'ArrowRight' ? 1 : -1) + provinces.length) % provinces.length
    buttons.current[next]?.focus()
  }

  return (
    <nav className="collection-nav" aria-label={t('landmarkCollection')}>
      <button className="collection-nav-all" type="button" onClick={onExplore} aria-label={t('exploreAtlas')}>⌁</button>
      <div className="collection-nav-items">
        {provinces.map((province, index) => (
          <button
            key={province.id}
            ref={(node) => { buttons.current[index] = node }}
            type="button"
            aria-current={activeId === province.id ? 'page' : undefined}
            onClick={() => onSelect(province.id)}
            onKeyDown={(event) => {
              if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) event.preventDefault()
              moveFocus(index, event.key)
            }}
          >
            <span>{province.code}</span>
            <strong>{province.shortName}</strong>
          </button>
        ))}
      </div>
    </nav>
  )
}

type GeoJson = { features: Array<{ geometry: { type: 'Polygon' | 'MultiPolygon'; coordinates: number[][][] | number[][][][] } }> }

function mapPoint([longitude, latitude]: number[]) {
  const { x, y } = projectIndonesiaPoint(longitude, latitude)
  return [x, y]
}

function ringPath(ring: number[][]) {
  return ring.map((point, index) => `${index ? 'L' : 'M'}${mapPoint(point).join(' ')}`).join(' ') + 'Z'
}

function indonesiaPath(data: GeoJson | null) {
  if (!data) return ''
  return data.features.flatMap(({ geometry }) => {
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates as number[][][]] : geometry.coordinates as number[][][][]
    return polygons.flatMap((polygon) => polygon.map(ringPath))
  }).join(' ')
}

export function ProvinceNavigator({ provinces, activeId, onSelect, onClose }: {
  provinces: Province[]
  activeId: string
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [provinceFilter, setProvinceFilter] = useState('all')
  const [view, setView] = useState<'atlas' | 'compare'>('atlas')
  const [mapData, setMapData] = useState<GeoJson | null>(null)

  useEffect(() => {
    let active = true
    fetch('/data/indonesia-natural-earth.geojson')
      .then((response) => response.ok ? response.json() as Promise<GeoJson> : Promise.reject(new Error('Map unavailable')))
      .then((data) => { if (active) setMapData(data) })
      .catch(() => { if (active) setMapData(null) })
    return () => { active = false }
  }, [])

  const results = useMemo(() => searchLandmarks(query, provinceFilter === 'all' ? provinces : provinces.filter(({ id }) => id === provinceFilter)), [provinceFilter, provinces, query])

  return (
    <aside className="experience-panel atlas-panel" aria-label={t('exploreIndonesia')}>
      <PanelHeader eyebrow={t('exploreIndonesia')} title={t('digitalHeritageAtlas')} onClose={onClose} />
      <div className="atlas-switch" role="group" aria-label={t('atlasView')}>
        <button type="button" aria-pressed={view === 'atlas'} onClick={() => setView('atlas')}>{t('mapSearch')}</button>
        <button type="button" aria-pressed={view === 'compare'} onClick={() => setView('compare')}>{t('compareLandmarks')}</button>
      </div>
      {view === 'compare' ? <CompareLandmarks provinces={provinces} /> : <>
        <div className="atlas-tools">
          <label><span>{t('searchCollection')}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchPlaceholder')} /></label>
          <label><span>{t('province')}</span><select value={provinceFilter} onChange={(event) => setProvinceFilter(event.target.value)}><option value="all">{t('allActiveProvinces')}</option>{provinces.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        </div>
        <div className="indonesia-map" aria-label={t('indonesiaMap')}>
          <svg viewBox={`0 0 ${INDONESIA_MAP.width} ${INDONESIA_MAP.height}`} role="img" aria-label={t('naturalEarthBoundary')}><path d={indonesiaPath(mapData)} /></svg>
          {provinces.map((item) => {
            if (!item.landmark.coordinates) return null
            const point = projectIndonesiaPoint(item.landmark.coordinates.longitude, item.landmark.coordinates.latitude)
            return <button
              key={item.id}
              type="button"
              className={item.id === activeId ? 'map-marker map-marker--active' : 'map-marker'}
              data-landmark={item.landmark.slug}
              style={{ left: `${(point.x / INDONESIA_MAP.width) * 100}%`, top: `${(point.y / INDONESIA_MAP.height) * 100}%` }}
              onClick={() => onSelect(item.id)}
              aria-label={`${t('openLandmark')} ${item.landmark.name}, ${item.name}`}
            ><span>{item.code}</span><strong>{item.landmark.shortName}</strong></button>
          })}
          {!mapData && <p>{t('mapUnavailable')}</p>}
        </div>
        <p className="map-credit">{t('mapCredit')}</p>
        <div className="atlas-results" aria-live="polite">
          <p>{results.length} {results.length === 1 ? t('verifiedLandmark') : t('verifiedLandmarks')}</p>
          {results.map((item) => <button key={item.id} type="button" onClick={() => onSelect(item.id)}>
            <span>{item.code}</span><span><strong>{item.landmark.name}</strong><small>{item.landmark.cityRegency} · {item.name}</small></span><em>{t('open3d')} →</em>
          </button>)}
          {results.length === 0 && <p className="empty-note">{t('noSearchResults')}</p>}
        </div>
      </>}
    </aside>
  )
}

export function CompareLandmarks({ provinces }: { provinces: Province[] }) {
  const { locale, t } = useI18n()
  const rows = Object.entries(getComparisonLabels(locale)).filter(([key]) => provinces.some(({ landmark }) => landmark.comparison[key]))
  return (
    <div className="compare-view">
      <p className="compare-intro">{t('comparisonIntro')}</p>
      <div className="compare-table" role="table" aria-label={t('compareLandmarks')}>
        <div className="compare-row compare-head" role="row"><span role="columnheader">{t('field')}</span>{provinces.map(({ landmark }) => <strong role="columnheader" key={landmark.id}>{landmark.shortName}</strong>)}</div>
        {rows.map(([key, label]) => <div className="compare-row" role="row" key={key}><span role="rowheader">{label}</span>{provinces.map(({ landmark }) => <div role="cell" key={landmark.id}>{landmark.comparison[key]?.value ?? <span className="unknown-value">{t('notEstablished')}</span>}{landmark.comparison[key] && <ClaimSources landmark={landmark} claimIds={landmark.comparison[key]!.claimIds} enabled />}</div>)}</div>)}
      </div>
    </div>
  )
}

export function InformationPanel({ panel, province, evidenceMode, onEvidenceMode, onSection, onHotspot, onNext, onClose }: {
  panel: Exclude<ExperiencePanel, 'explore' | 'compare' | null>
  province: Province
  evidenceMode: boolean
  onEvidenceMode: () => void
  onSection: (section: LandmarkSection) => void
  onHotspot: (id: string) => void
  onNext?: () => void
  onClose: () => void
}) {
  const { t } = useI18n()
  const sectionLabels: Record<LandmarkSection, string> = { overview: t('overview'), history: t('history'), architecture: t('architecture'), timeline: t('timeline'), 'cultural-context': t('culturalContext'), 'connected-heritage': t('connectedHeritage'), sources: t('sources') }
  if (panel === 'about') {
    return <aside className="experience-panel information-panel" aria-label={t('aboutCollection')}><PanelHeader eyebrow={t('aboutProject')} title={t('atlasTitle')} onClose={onClose} /><div className="panel-content prose about-content"><p>{t('aboutIntro')}</p><section><h3>{t('independentProject')}</h3><p>{t('independentBody')}</p></section><section><h3>{t('methodology3d')}</h3><p>{t('methodology3dBody')}</p></section><section><h3>{t('researchMethodology')}</h3><p>{t('researchBody')}</p></section><section><h3>{t('contribute')}</h3><p>{t('contributeBody')}</p><a href="https://github.com/Muzaki29/landmark-indonesia/issues/new" target="_blank" rel="noreferrer">{t('suggestCorrection')} ↗</a></section><section><h3>{t('credits')}</h3><p>{t('creditsBody')}</p></section></div></aside>
  }

  if (panel === 'collection-sources') {
    return <aside className="experience-panel information-panel" aria-label={t('collectionSources')}><PanelHeader eyebrow={t('collection')} title={t('sourcesReading')} onClose={onClose} /><SourceList landmark={province.landmark} collectionView /></aside>
  }

  return (
    <aside className="experience-panel information-panel" aria-label={`${province.landmark.name} · ${t('landmarkInformation')}`}>
      <PanelHeader eyebrow={`${province.code} · ${province.name}`} title={province.landmark.name} onClose={onClose} />
      <div className="panel-tools"><nav className="panel-section-nav" aria-label={t('landmarkSections')}>{landmarkSections.map((section) => <button key={section.id} type="button" aria-pressed={panel === section.id} onClick={() => onSection(section.id)}>{sectionLabels[section.id]}</button>)}</nav><button className="evidence-toggle" type="button" aria-pressed={evidenceMode} onClick={onEvidenceMode}>{evidenceMode ? t('hideSources') : t('showSources')}</button></div>
      <LandmarkSectionContent landmark={province.landmark} section={panel} evidenceMode={evidenceMode} onHotspot={onHotspot} />
      {panel === 'sources' && <button className="next-landmark" type="button" onClick={onNext}>{t('nextLandmark')} <span aria-hidden="true">→</span></button>}
    </aside>
  )
}

function PanelHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) {
  const { t } = useI18n()
  return <header className="panel-header"><div><p>{eyebrow}</p><h2>{title}</h2></div><button type="button" onClick={onClose} aria-label={t('closePanel')}>×</button></header>
}

function LandmarkSectionContent({ landmark, section, evidenceMode, onHotspot }: { landmark: Landmark; section: LandmarkSection; evidenceMode: boolean; onHotspot: (id: string) => void }) {
  const { t } = useI18n()
  if (section === 'overview') {
    return <div className="panel-content"><p className="lead">{landmark.shortDescription}<ClaimSources landmark={landmark} claimIds={[landmark.overviewClaimId]} enabled={evidenceMode} /></p><dl className="metadata"><div><dt>{t('location')}</dt><dd>{landmark.location}</dd></div><div><dt>{t('type')}</dt><dd>{landmark.type}</dd></div>{landmark.heritageStatus && <div><dt>{t('heritageStatus')}</dt><dd>{landmark.heritageStatus.value}<ClaimSources landmark={landmark} claimIds={landmark.heritageStatus.claimIds} enabled={evidenceMode} /></dd></div>}</dl><dl className="fact-grid">{landmark.facts.map((fact) => <div key={fact.id}><dt>{fact.label}</dt><dd>{fact.value}<ClaimSources landmark={landmark} claimIds={[fact.id]} enabled={evidenceMode} /></dd></div>)}</dl></div>
  }

  if (section === 'history' || section === 'architecture') {
    const paragraphs = landmark[section]
    return <div className="panel-content prose"><h3>{section === 'history' ? t('history') : t('architecture')}</h3>{paragraphs.map((paragraph) => <p key={paragraph.id}>{paragraph.text}<ClaimSources landmark={landmark} claimIds={[paragraph.id]} enabled={evidenceMode} /></p>)}{section === 'architecture' && <><div className="architecture-parts"><h3>{t('exploreComponents')}</h3>{landmark.hotspots.map((hotspot) => <button key={hotspot.id} type="button" onClick={() => onHotspot(hotspot.id)}><span>{relationLabel(hotspot.category, t)}</span><strong>{hotspot.title}</strong><small>{hotspot.summary}</small></button>)}</div><p className="model-note"><strong>{t('interpretation3d')}</strong>{landmark.modelNote}</p></>}</div>
  }

  if (section === 'timeline') {
    return <div className="panel-content"><h3>{t('timeline')}</h3><ol className="timeline">{landmark.timeline.map((entry) => <li key={entry.id}><div className="timeline-entry"><time>{entry.year}</time><span><strong>{entry.title}</strong><p>{entry.text}<ClaimSources landmark={landmark} claimIds={[entry.id]} enabled={evidenceMode} /></p></span></div>{entry.sceneAction && <button className="timeline-focus" type="button" onClick={() => onHotspot(entry.sceneAction!.hotspotId)}>{t('view3d')}</button>}</li>)}</ol></div>
  }

  if (section === 'cultural-context') {
    return <div className="panel-content prose"><h3>{t('regionalContext')}</h3>{landmark.culturalContext.map((paragraph) => <p key={paragraph.id}>{paragraph.text}<ClaimSources landmark={landmark} claimIds={[paragraph.id]} enabled={evidenceMode} /></p>)}</div>
  }

  if (section === 'connected-heritage') {
    const groups = ['PLACE', 'EVENT', 'PERSON', 'CULTURAL_CONTEXT'] as const
    return <div className="panel-content connected-content"><h3>{t('connectedHeritage')}</h3><p className="connected-intro">{t('connectedIntro')}</p>{groups.map((type) => {
      const relations = landmark.relations.filter((relation) => relation.type === type)
      return relations.length > 0 && <section key={type}><h4>{relationLabel(type, t)}</h4>{relations.map((relation) => <article key={relation.id}><strong>{relation.title}</strong><p>{relation.summary}<ClaimSources landmark={landmark} claimIds={relation.claimIds} enabled={evidenceMode} /></p></article>)}</section>
    })}</div>
  }

  return <SourceList landmark={landmark} />
}

function statusLabel(source: SourceRecord) {
  return source.verificationStatus ?? (source.status === 'verified' ? 'VERIFIED' : 'FURTHER_READING')
}

function SourceList({ landmark, collectionView = false }: { landmark: Landmark; collectionView?: boolean }) {
  const { locale, t } = useI18n()
  const sources = collectionView ? getProvinces(locale).flatMap((item) => item.landmark.sources) : landmark.sources
  const uniqueSources = [...new Map(sources.map((item) => [item.id, item])).values()]
  const allReadings = getFurtherReadings(locale)
  const readings = collectionView ? allReadings : allReadings.filter((reading) => reading.landmarkId === landmark.id)
  const groups = ['VERIFIED', 'SUPPORTED', 'DISPUTED', 'UNVERIFIED'] as const
  const statusLabels = { VERIFIED: t('verifiedSources'), SUPPORTED: t('supportedSources'), DISPUTED: t('disputedNotes'), UNVERIFIED: t('unverifiedSources') }
  return (
    <div className="panel-content sources-content">
      {groups.map((status) => {
        const items = uniqueSources.filter((item) => statusLabel(item) === status)
        return items.length > 0 && <section className="source-group" key={status}><h3>{statusLabels[status]}</h3><ol className="source-list">{items.map((item) => <li key={item.id}><span>{statusLabels[status]} · {item.sourceType ?? item.category}</span><strong>{item.title}</strong><p>{item.institution}{item.published ? ` · ${item.published}` : ''}</p><small>{t('accessed')} {item.accessedAt ?? '24 October 2026'}</small><a href={item.url} target="_blank" rel="noreferrer">{t('openSource')} <span aria-hidden="true">↗</span></a></li>)}</ol></section>
      })}
      {readings.length > 0 && <section className="source-group"><h3>{t('furtherReading')} · {t('notYetChecked')}</h3>{readings.map((reading) => <article className="further-reading" key={reading.id}><span>{t('furtherReading')} · {t('notYetChecked')}</span><p>{reading.citation}</p><small>{reading.scope}</small>{reading.url && <a href={reading.url} target="_blank" rel="noreferrer">{t('openPublication')} <span aria-hidden="true">↗</span></a>}</article>)}</section>}
      {collectionView && <p className="source-method">{t('furtherReadingMethod')}</p>}
    </div>
  )
}

export function HotspotCard({ landmark, hotspot, evidenceMode, onClose }: { landmark: Landmark; hotspot: Hotspot; evidenceMode: boolean; onClose: () => void }) {
  const { t } = useI18n()
  return <aside className="hotspot-card" aria-live="polite"><button type="button" onClick={onClose} aria-label={t('closeHotspot')}>×</button><span>{relationLabel(hotspot.category, t)}</span><h2>{hotspot.title}</h2><p>{hotspot.summary}<ClaimSources landmark={landmark} claimIds={hotspot.claimIds} enabled={evidenceMode} /></p></aside>
}

export function ClaimSources({ landmark, claimIds, enabled = true }: { landmark: Landmark; claimIds: string[]; enabled?: boolean }) {
  const { t } = useI18n()
  if (!enabled) return null
  const sources = getSourcesForClaims(landmark, claimIds)
  return <span className="claim-sources" aria-label={t('evidence')}>{sources.map((item) => {
    const index = landmark.sources.findIndex((source) => source.id === item.id)
    return <EvidenceMarker key={item.id} source={item} index={index} />
  })}</span>
}

function EvidenceMarker({ source, index }: { source: SourceRecord; index: number }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const localizedStatus = statusLabel(source) === 'VERIFIED' ? t('verifiedSources') : statusLabel(source) === 'SUPPORTED' ? t('supportedSources') : statusLabel(source) === 'DISPUTED' ? t('disputedNotes') : t('unverifiedSources')
  return <span className="evidence-marker"><button type="button" aria-expanded={open} aria-label={`${t('evidence')} ${index + 1}: ${source.title}`} onClick={() => setOpen((value) => !value)}>[{String(index + 1).padStart(2, '0')}]</button>{open && <span className="evidence-popover"><strong>{source.title}</strong><span>{source.institution}</span>{source.published && <span>{t('published')} {source.published}</span>}<span>{source.sourceType ?? source.category}</span><span>{localizedStatus} · {t('accessed')} {source.accessedAt ?? '24 October 2026'}</span><a href={source.url} target="_blank" rel="noreferrer">{t('openExternalSource')} ↗</a></span>}</span>
}
