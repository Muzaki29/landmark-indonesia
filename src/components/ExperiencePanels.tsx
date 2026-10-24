import { useEffect, useMemo, useRef, useState } from 'react'
import {
  comparisonLabels,
  furtherReadings,
  getSourcesForClaims,
  provinces as heritageProvinces,
  searchLandmarks,
  type Hotspot,
  type Landmark,
  type Province,
  type SourceRecord,
} from '../data/heritage'
import { landmarkSections, type ExperiencePanel, type ExploreMode, type LandmarkSection } from '../state/experienceState'
import type { CameraView } from '../data/heritage'

export function PrimaryNav({ active, onOpen }: { active: ExperiencePanel; onOpen: (panel: Exclude<ExperiencePanel, null>) => void }) {
  return (
    <nav className="primary-nav" aria-label="Primary">
      {([['explore', 'Explore'], ['about', 'About'], ['collection-sources', 'Sources']] as const).map(([panel, label]) => (
        <button key={panel} type="button" aria-pressed={active === panel} onClick={() => onOpen(panel)}>{label}</button>
      ))}
    </nav>
  )
}

export function ExploreModes({ mode, onMode }: { mode: ExploreMode; onMode: (mode: ExploreMode) => void }) {
  return (
    <div className="explore-modes" role="group" aria-label="3D exploration mode">
      {(['explore', 'architecture', 'history'] as const).map((item) => (
        <button key={item} type="button" aria-pressed={mode === item} onClick={() => onMode(item)}>{item}</button>
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
  return <aside className="viewer-controls-panel" aria-label="3D inspection controls"><h2>View</h2><div className="camera-presets">{views.map((view, index) => <button key={view.id} type="button" aria-pressed={activeView === view.id} onClick={() => onView(view.id)}><span>{index + 1}</span>{view.label}</button>)}</div><button className="labels-toggle" type="button" aria-pressed={labels} onClick={onLabels}>Labels <kbd>L</kbd></button><button className="reset-camera" type="button" onClick={onReset}>Reset view <kbd>R</kbd></button></aside>
}

export function ViewerToolbar({ fullscreen, onHelp, onZoomIn, onZoomOut, onFit, onFullscreen }: {
  fullscreen: boolean
  onHelp: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onFit: () => void
  onFullscreen: () => void
}) {
  return <nav className="viewer-toolbar" aria-label="3D viewer toolbar"><button type="button" onClick={onHelp}><span aria-hidden="true">?</span><strong>Help</strong></button><button type="button" onClick={onZoomIn}><span aria-hidden="true">＋</span><strong>Zoom in</strong></button><button type="button" onClick={onZoomOut}><span aria-hidden="true">−</span><strong>Zoom out</strong></button><button type="button" onClick={onFit}><span aria-hidden="true">⌂</span><strong>Fit view</strong></button><button type="button" onClick={onFullscreen}><span aria-hidden="true">⛶</span><strong>{fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</strong></button></nav>
}

export function HelpPanel({ cameraViews, onClose }: { cameraViews: CameraView[]; onClose: () => void }) {
  return <aside className="experience-panel help-panel" aria-label="Help and keyboard shortcuts"><PanelHeader eyebrow="Viewer help" title="Controls & shortcuts" onClose={onClose} /><div className="help-grid"><section><h3>Navigation</h3><dl><div><dt>Drag</dt><dd>Orbit landmark</dd></div><div><dt>Scroll / pinch</dt><dd>Zoom</dd></div><div><dt>Click marker</dt><dd>Select and focus component</dd></div></dl></section><section><h3>Camera</h3><dl>{cameraViews.map((view, index) => <div key={view.id}><dt>{index + 1}</dt><dd>{view.label} view</dd></div>)}<div><dt>R</dt><dd>Reset / fit view</dd></div></dl></section><section><h3>Exploration</h3><dl><div><dt>L</dt><dd>Component labels</dd></div><div><dt>?</dt><dd>Open this help</dd></div><div><dt>Esc</dt><dd>Close panel or hotspot</dd></div></dl></section></div></aside>
}

export function SectionNavigation({ active, onOpen }: { active: LandmarkSection; onOpen: (section: LandmarkSection) => void }) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([])

  function moveFocus(index: number, key: string) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return
    const next = key === 'Home' ? 0 : key === 'End' ? landmarkSections.length - 1 : (index + (key === 'ArrowDown' ? 1 : -1) + landmarkSections.length) % landmarkSections.length
    buttons.current[next]?.focus()
  }

  return (
    <nav className="section-nav" aria-label="Landmark information">
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
          {section.label}
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
  const buttons = useRef<Array<HTMLButtonElement | null>>([])

  function moveFocus(index: number, key: string) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return
    const next = key === 'Home' ? 0 : key === 'End' ? provinces.length - 1 : (index + (key === 'ArrowRight' ? 1 : -1) + provinces.length) % provinces.length
    buttons.current[next]?.focus()
  }

  return (
    <nav className="collection-nav" aria-label="Landmark collection">
      <button className="collection-nav-all" type="button" onClick={onExplore} aria-label="Explore Indonesia atlas">⌁</button>
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
  return [((longitude - 94) / 47) * 800, ((6 - latitude) / 17) * 320]
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
    <aside className="experience-panel atlas-panel" aria-label="Explore Indonesia">
      <PanelHeader eyebrow="Explore Indonesia" title="Digital Heritage Atlas" onClose={onClose} />
      <div className="atlas-switch" role="group" aria-label="Atlas view">
        <button type="button" aria-pressed={view === 'atlas'} onClick={() => setView('atlas')}>Map & search</button>
        <button type="button" aria-pressed={view === 'compare'} onClick={() => setView('compare')}>Compare landmarks</button>
      </div>
      {view === 'compare' ? <CompareLandmarks provinces={provinces} /> : <>
        <div className="atlas-tools">
          <label><span>Search collection</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Landmark, province, city, period…" /></label>
          <label><span>Province</span><select value={provinceFilter} onChange={(event) => setProvinceFilter(event.target.value)}><option value="all">All active provinces</option>{provinces.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        </div>
        <div className="indonesia-map" aria-label="Map of Indonesia with active landmark locations">
          <svg viewBox="0 0 800 320" role="img" aria-label="Indonesia boundary from Natural Earth"><path d={indonesiaPath(mapData)} /></svg>
          {provinces.map((item) => item.landmark.coordinates && <button
            key={item.id}
            type="button"
            className={item.id === activeId ? 'map-marker map-marker--active' : 'map-marker'}
            style={{ left: `${((item.landmark.coordinates.longitude - 94) / 47) * 100}%`, top: `${((6 - item.landmark.coordinates.latitude) / 17) * 100}%` }}
            onClick={() => onSelect(item.id)}
            aria-label={`Open ${item.landmark.name}, ${item.name}`}
          ><span>{item.code}</span><strong>{item.landmark.shortName}</strong></button>)}
          {!mapData && <p>Geographic boundary unavailable. The verified collection list remains accessible below.</p>}
        </div>
        <p className="map-credit">Boundary: Natural Earth 1:110m, public domain. Markers use official heritage coordinates.</p>
        <div className="atlas-results" aria-live="polite">
          <p>{results.length} verified landmark{results.length === 1 ? '' : 's'}</p>
          {results.map((item) => <button key={item.id} type="button" onClick={() => onSelect(item.id)}>
            <span>{item.code}</span><span><strong>{item.landmark.name}</strong><small>{item.landmark.cityRegency} · {item.name}</small></span><em>Open 3D →</em>
          </button>)}
          {results.length === 0 && <p className="empty-note">No verified landmark in the current collection matches this search.</p>}
        </div>
      </>}
    </aside>
  )
}

export function CompareLandmarks({ provinces }: { provinces: Province[] }) {
  const rows = Object.entries(comparisonLabels).filter(([key]) => provinces.some(({ landmark }) => landmark.comparison[key]))
  return (
    <div className="compare-view">
      <p className="compare-intro">A source-backed comparison. Missing fields are left blank and fields unavailable for every landmark are hidden.</p>
      <div className="compare-table" role="table" aria-label="Landmark comparison">
        <div className="compare-row compare-head" role="row"><span role="columnheader">Field</span>{provinces.map(({ landmark }) => <strong role="columnheader" key={landmark.id}>{landmark.shortName}</strong>)}</div>
        {rows.map(([key, label]) => <div className="compare-row" role="row" key={key}><span role="rowheader">{label}</span>{provinces.map(({ landmark }) => <div role="cell" key={landmark.id}>{landmark.comparison[key]?.value ?? <span className="unknown-value">Not established</span>}{landmark.comparison[key] && <ClaimSources landmark={landmark} claimIds={landmark.comparison[key]!.claimIds} enabled />}</div>)}</div>)}
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
  if (panel === 'about') {
    return <aside className="experience-panel information-panel" aria-label="About this collection"><PanelHeader eyebrow="About the project" title="A source-backed cultural atlas" onClose={onClose} /><div className="panel-content prose about-content"><p>Indonesia Digital Heritage Atlas connects real-time 3D studies with claim-level evidence, regional context, and related heritage.</p><section><h3>Independent project</h3><p>This is an independent educational project. It does not claim affiliation with Indonesian government institutions or the publishers cited in the collection.</p></section><section><h3>3D methodology</h3><p>Every scene is a procedural interpretive study. Verified dimensions are used when available; proportions and landscape details are disclosed as visual approximations rather than survey records.</p></section><section><h3>Research methodology</h3><p><strong>Verified</strong> uses authoritative official evidence. <strong>Supported</strong> uses credible academic or institutional evidence. <strong>Disputed</strong> preserves material disagreement. <strong>Unverified</strong> marks insufficient evidence. <strong>Further reading</strong> remains separate until checked.</p></section><section><h3>Contribute</h3><p>Corrections, authoritative sources, landmark suggestions, and research leads are reviewed before publication.</p><a href="https://github.com/Muzaki29/landmark-indonesia/issues/new" target="_blank" rel="noreferrer">Suggest a correction or source ↗</a></section><section className="support-project"><h3>Dukung proyek ini</h3><p>Support continued research and interactive documentation of Indonesian heritage.</p><a href="https://saweria.co/muzakiabdullah" target="_blank" rel="noreferrer">Support this independent project ↗</a></section><section><h3>Credits</h3><p>Development, interface design, procedural 3D, and research: Muzaki Abdullah Irsyad. Geographic boundary: Natural Earth, public domain. Historical facts remain credited to their listed source institutions.</p></section></div></aside>
  }

  if (panel === 'collection-sources') {
    return <aside className="experience-panel information-panel" aria-label="Collection sources"><PanelHeader eyebrow="Collection" title="Sources & reading" onClose={onClose} /><SourceList landmark={province.landmark} collectionView /></aside>
  }

  return (
    <aside className="experience-panel information-panel" aria-label={`${province.landmark.name} information`}>
      <PanelHeader eyebrow={`${province.code} · ${province.name}`} title={province.landmark.name} onClose={onClose} />
      <div className="panel-tools"><nav className="panel-section-nav" aria-label="Landmark sections">{landmarkSections.map((section) => <button key={section.id} type="button" aria-pressed={panel === section.id} onClick={() => onSection(section.id)}>{section.label}</button>)}</nav><button className="evidence-toggle" type="button" aria-pressed={evidenceMode} onClick={onEvidenceMode}>{evidenceMode ? 'Hide sources' : 'Show sources'}</button></div>
      <LandmarkSectionContent landmark={province.landmark} section={panel} evidenceMode={evidenceMode} onHotspot={onHotspot} />
      {panel === 'sources' && <button className="next-landmark" type="button" onClick={onNext}>Next landmark <span aria-hidden="true">→</span></button>}
    </aside>
  )
}

function PanelHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) {
  return <header className="panel-header"><div><p>{eyebrow}</p><h2>{title}</h2></div><button type="button" onClick={onClose} aria-label="Close panel">×</button></header>
}

function LandmarkSectionContent({ landmark, section, evidenceMode, onHotspot }: { landmark: Landmark; section: LandmarkSection; evidenceMode: boolean; onHotspot: (id: string) => void }) {
  if (section === 'overview') {
    return <div className="panel-content"><p className="lead">{landmark.shortDescription}<ClaimSources landmark={landmark} claimIds={[landmark.overviewClaimId]} enabled={evidenceMode} /></p><dl className="metadata"><div><dt>Location</dt><dd>{landmark.location}</dd></div><div><dt>Type</dt><dd>{landmark.type}</dd></div>{landmark.heritageStatus && <div><dt>Heritage status</dt><dd>{landmark.heritageStatus.value}<ClaimSources landmark={landmark} claimIds={landmark.heritageStatus.claimIds} enabled={evidenceMode} /></dd></div>}</dl><dl className="fact-grid">{landmark.facts.map((fact) => <div key={fact.id}><dt>{fact.label}</dt><dd>{fact.value}<ClaimSources landmark={landmark} claimIds={[fact.id]} enabled={evidenceMode} /></dd></div>)}</dl></div>
  }

  if (section === 'history' || section === 'architecture') {
    const paragraphs = landmark[section]
    return <div className="panel-content prose"><h3>{section}</h3>{paragraphs.map((paragraph) => <p key={paragraph.id}>{paragraph.text}<ClaimSources landmark={landmark} claimIds={[paragraph.id]} enabled={evidenceMode} /></p>)}{section === 'architecture' && <><div className="architecture-parts"><h3>Explore components</h3>{landmark.hotspots.map((hotspot) => <button key={hotspot.id} type="button" onClick={() => onHotspot(hotspot.id)}><span>{hotspot.category}</span><strong>{hotspot.title}</strong><small>{hotspot.summary}</small></button>)}</div><p className="model-note"><strong>3D interpretation</strong>{landmark.modelNote}</p></>}</div>
  }

  if (section === 'timeline') {
    return <div className="panel-content"><h3>Timeline</h3><ol className="timeline">{landmark.timeline.map((entry) => <li key={entry.id}><div className="timeline-entry"><time>{entry.year}</time><span><strong>{entry.title}</strong><p>{entry.text}<ClaimSources landmark={landmark} claimIds={[entry.id]} enabled={evidenceMode} /></p></span></div>{entry.sceneAction && <button className="timeline-focus" type="button" onClick={() => onHotspot(entry.sceneAction!.hotspotId)}>View in 3D</button>}</li>)}</ol></div>
  }

  if (section === 'cultural-context') {
    return <div className="panel-content prose"><h3>Konteks daerah</h3>{landmark.culturalContext.map((paragraph) => <p key={paragraph.id}>{paragraph.text}<ClaimSources landmark={landmark} claimIds={[paragraph.id]} enabled={evidenceMode} /></p>)}</div>
  }

  if (section === 'connected-heritage') {
    const groups = ['PLACE', 'EVENT', 'PERSON', 'CULTURAL_CONTEXT'] as const
    return <div className="panel-content connected-content"><h3>Connected Heritage</h3><p className="connected-intro">Trace this landmark through verified places, events, people, and cultural context.</p>{groups.map((type) => {
      const relations = landmark.relations.filter((relation) => relation.type === type)
      return relations.length > 0 && <section key={type}><h4>{type.replace('_', ' ')}</h4>{relations.map((relation) => <article key={relation.id}><strong>{relation.title}</strong><p>{relation.summary}<ClaimSources landmark={landmark} claimIds={relation.claimIds} enabled={evidenceMode} /></p></article>)}</section>
    })}</div>
  }

  return <SourceList landmark={landmark} />
}

function statusLabel(source: SourceRecord) {
  return source.verificationStatus ?? (source.status === 'verified' ? 'VERIFIED' : 'FURTHER_READING')
}

function SourceList({ landmark, collectionView = false }: { landmark: Landmark; collectionView?: boolean }) {
  const sources = collectionView ? heritageProvinces.flatMap((item) => item.landmark.sources) : landmark.sources
  const uniqueSources = [...new Map(sources.map((item) => [item.id, item])).values()]
  const readings = collectionView ? furtherReadings : furtherReadings.filter((reading) => reading.landmarkId === landmark.id)
  const groups = ['VERIFIED', 'SUPPORTED', 'DISPUTED', 'UNVERIFIED'] as const
  return (
    <div className="panel-content sources-content">
      {groups.map((status) => {
        const items = uniqueSources.filter((item) => statusLabel(item) === status)
        return items.length > 0 && <section className="source-group" key={status}><h3>{status === 'DISPUTED' ? 'Disputed / notes' : `${status.toLowerCase()} sources`}</h3><ol className="source-list">{items.map((item) => <li key={item.id}><span>{status} · {item.sourceType ?? item.category}</span><strong>{item.title}</strong><p>{item.institution}{item.published ? ` · ${item.published}` : ''}</p><small>Accessed {item.accessedAt ?? '24 October 2026'}</small><a href={item.url} target="_blank" rel="noreferrer">Open source <span aria-hidden="true">↗</span></a></li>)}</ol></section>
      })}
      {readings.length > 0 && <section className="source-group"><h3>Further reading · Not yet checked</h3>{readings.map((reading) => <article className="further-reading" key={reading.id}><span>Further reading · Not yet checked</span><p>{reading.citation}</p><small>{reading.scope}</small>{reading.url && <a href={reading.url} target="_blank" rel="noreferrer">Open publication <span aria-hidden="true">↗</span></a>}</article>)}</section>}
      {collectionView && <p className="source-method">Further-reading entries remain discovery material and are not used as evidence until checked.</p>}
    </div>
  )
}

export function HotspotCard({ landmark, hotspot, evidenceMode, onClose }: { landmark: Landmark; hotspot: Hotspot; evidenceMode: boolean; onClose: () => void }) {
  return <aside className="hotspot-card" aria-live="polite"><button type="button" onClick={onClose} aria-label="Close hotspot detail">×</button><span>{hotspot.category}</span><h2>{hotspot.title}</h2><p>{hotspot.summary}<ClaimSources landmark={landmark} claimIds={hotspot.claimIds} enabled={evidenceMode} /></p></aside>
}

export function ClaimSources({ landmark, claimIds, enabled = true }: { landmark: Landmark; claimIds: string[]; enabled?: boolean }) {
  if (!enabled) return null
  const sources = getSourcesForClaims(landmark, claimIds)
  return <span className="claim-sources" aria-label="Evidence">{sources.map((item) => {
    const index = landmark.sources.findIndex((source) => source.id === item.id)
    return <EvidenceMarker key={item.id} source={item} index={index} />
  })}</span>
}

function EvidenceMarker({ source, index }: { source: SourceRecord; index: number }) {
  const [open, setOpen] = useState(false)
  return <span className="evidence-marker"><button type="button" aria-expanded={open} aria-label={`Evidence ${index + 1}: ${source.title}`} onClick={() => setOpen((value) => !value)}>[{String(index + 1).padStart(2, '0')}]</button>{open && <span className="evidence-popover"><strong>{source.title}</strong><span>{source.institution}</span>{source.published && <span>Published {source.published}</span>}<span>{source.sourceType ?? source.category}</span><span>{statusLabel(source)} · accessed {source.accessedAt ?? '24 October 2026'}</span><a href={source.url} target="_blank" rel="noreferrer">Open external source ↗</a></span>}</span>
}
