import { useRef } from 'react'
import { furtherReadings, provinces as heritageProvinces, type Landmark, type Province } from '../data/heritage'
import { landmarkSections, type ExperiencePanel, type LandmarkSection } from '../state/experienceState'

export function PrimaryNav({ active, onOpen }: { active: ExperiencePanel; onOpen: (panel: Exclude<ExperiencePanel, null>) => void }) {
  return (
    <nav className="primary-nav" aria-label="Primary">
      {([['explore', 'Explore'], ['about', 'About'], ['collection-sources', 'Sources']] as const).map(([panel, label]) => (
        <button key={panel} type="button" aria-pressed={active === panel} onClick={() => onOpen(panel)}>{label}</button>
      ))}
    </nav>
  )
}

export function ProvinceNavigator({ provinces, activeId, onSelect, onClose }: {
  provinces: Province[]
  activeId: string
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([])

  function moveFocus(index: number, key: string) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) return
    const next = key === 'Home' ? 0 : key === 'End' ? provinces.length - 1 : (index + (key === 'ArrowDown' ? 1 : -1) + provinces.length) % provinces.length
    buttons.current[next]?.focus()
  }

  return (
    <aside className="experience-panel province-panel" aria-label="Explore provinces">
      <PanelHeader eyebrow="Explore Indonesia" title="Three provinces" onClose={onClose} />
      <div className="province-list">
        {provinces.map((province, index) => (
          <button
            key={province.id}
            ref={(node) => { buttons.current[index] = node }}
            type="button"
            className={activeId === province.id ? 'province-option province-option--active' : 'province-option'}
            aria-current={activeId === province.id ? 'true' : undefined}
            onClick={() => onSelect(province.id)}
            onKeyDown={(event) => { if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) event.preventDefault(); moveFocus(index, event.key) }}
          >
            <span>{province.code}</span>
            <span><strong>{province.name}</strong><small>{province.landmark.name}</small></span>
            <em>Interactive 3D</em>
          </button>
        ))}
      </div>
    </aside>
  )
}

export function InformationPanel({ panel, province, onSection, onNext, onClose }: {
  panel: Exclude<ExperiencePanel, 'explore' | null>
  province: Province
  onSection: (section: LandmarkSection) => void
  onNext?: () => void
  onClose: () => void
}) {
  if (panel === 'about') {
    return <aside className="experience-panel information-panel" aria-label="About this collection"><PanelHeader eyebrow="About" title="A living cultural index" onClose={onClose} /><div className="prose"><p>Indonesia 3D Landmarks is an interactive exploration of Indonesian landmarks using real-time 3D visualization and source-backed cultural information.</p><p>The procedural scenes are interpretive studies rather than photogrammetric or archaeological surveys. The project has no claimed government partnership.</p></div></aside>
  }

  if (panel === 'collection-sources') {
    return <aside className="experience-panel information-panel" aria-label="Collection sources"><PanelHeader eyebrow="Collection" title="Sources & reading" onClose={onClose} /><SourceList landmark={province.landmark} collectionView /></aside>
  }

  return (
    <aside className="experience-panel information-panel" aria-label={`${province.landmark.name} information`}>
      <PanelHeader eyebrow={`${province.code} · ${province.name}`} title={province.landmark.name} onClose={onClose} />
      <nav className="panel-section-nav" aria-label="Landmark sections">
        {landmarkSections.map((section) => <button key={section.id} type="button" aria-pressed={panel === section.id} onClick={() => onSection(section.id)}>{section.label}</button>)}
      </nav>
      <LandmarkSectionContent landmark={province.landmark} section={panel} />
      {panel === 'sources' && <button className="next-landmark" type="button" onClick={onNext}>Next landmark <span aria-hidden="true">→</span></button>}
    </aside>
  )
}

function PanelHeader({ eyebrow, title, onClose }: { eyebrow: string; title: string; onClose: () => void }) {
  return <header className="panel-header"><div><p>{eyebrow}</p><h2>{title}</h2></div><button type="button" onClick={onClose} aria-label="Close panel">×</button></header>
}

function LandmarkSectionContent({ landmark, section }: { landmark: Landmark; section: LandmarkSection }) {
  if (section === 'overview') {
    return <div className="panel-content"><p className="lead">{landmark.shortDescription}<ClaimSources landmark={landmark} sourceIds={landmark.overviewSourceIds} /></p><dl className="metadata"><div><dt>Location</dt><dd>{landmark.location}</dd></div><div><dt>Type</dt><dd>{landmark.type}</dd></div></dl><dl className="fact-grid">{landmark.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}<ClaimSources landmark={landmark} sourceIds={fact.sourceIds} /></dd></div>)}</dl>{landmark.culturalContext.length > 0 && <section className="context-note"><h3>Cultural context</h3>{landmark.culturalContext.map((paragraph) => <p key={paragraph.text}>{paragraph.text}<ClaimSources landmark={landmark} sourceIds={paragraph.sourceIds} /></p>)}</section>}</div>
  }

  if (section === 'history' || section === 'architecture') {
    const paragraphs = landmark[section]
    return <div className="panel-content prose"><h3>{section}</h3>{paragraphs.map((paragraph) => <p key={paragraph.text}>{paragraph.text}<ClaimSources landmark={landmark} sourceIds={paragraph.sourceIds} /></p>)}{section === 'architecture' && <p className="model-note"><strong>3D interpretation</strong>{landmark.modelNote}</p>}</div>
  }

  if (section === 'timeline') {
    return <div className="panel-content"><h3>Timeline</h3><ol className="timeline">{landmark.timeline.map((entry) => <li key={`${entry.year}-${entry.title}`}><time>{entry.year}</time><div><strong>{entry.title}</strong><p>{entry.text}<ClaimSources landmark={landmark} sourceIds={entry.sourceIds} /></p></div></li>)}</ol></div>
  }

  return <SourceList landmark={landmark} />
}

function SourceList({ landmark, collectionView = false }: { landmark: Landmark; collectionView?: boolean }) {
  const sources = collectionView ? heritageProvinces.flatMap((item) => item.landmark.sources) : landmark.sources
  const readings = collectionView ? furtherReadings : furtherReadings.filter((reading) => reading.landmarkId === landmark.id)
  return (
    <div className="panel-content sources-content">
      <h3>Verified sources</h3>
      <ol className="source-list">{sources.map((source) => <li key={source.id}><span>Verified · {source.category}</span><strong>{source.title}</strong><p>{source.institution}{source.published ? ` · ${source.published}` : ''}</p><a href={source.url} target="_blank" rel="noreferrer">Open source <span aria-hidden="true">↗</span></a></li>)}</ol>
      <h3>Further reading</h3>
      {readings.map((reading) => <article className="further-reading" key={reading.id}><span>Not yet checked</span><p>{reading.citation}</p><small>{reading.scope}</small><a href={reading.url} target="_blank" rel="noreferrer">Open publication <span aria-hidden="true">↗</span></a></article>)}
      {collectionView && <p className="source-method">“Further reading” entries are listed for discovery and are not used as evidence for landmark facts until checked.</p>}
    </div>
  )
}

function ClaimSources({ landmark, sourceIds }: { landmark: Landmark; sourceIds: string[] }) {
  return <span className="claim-sources" aria-label="Supporting sources">{sourceIds.map((id) => {
    const index = landmark.sources.findIndex((source) => source.id === id)
    const source = landmark.sources[index]
    return source ? <a key={id} href={source.url} target="_blank" rel="noreferrer" aria-label={`Source ${index + 1}: ${source.title}`}>[{index + 1}]</a> : null
  })}</span>
}
