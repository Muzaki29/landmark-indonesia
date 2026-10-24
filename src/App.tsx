import { useEffect, useReducer, useRef, useState } from 'react'
import { ClaimSources, CollectionNavigator, ExploreModes, HelpPanel, HotspotCard, InformationPanel, PrimaryNav, ProvinceNavigator, SectionNavigation, ViewerControls, ViewerToolbar } from './components/ExperiencePanels'
import { LandmarkExperience } from './components/LandmarkExperience'
import { getProvince, provinces, type CameraView } from './data/heritage'
import { useReducedMotion } from './hooks/useReducedMotion'
import { experienceReducer, initialExperienceState, landmarkSections, type ExperiencePanel, type ExploreMode, type LandmarkSection } from './state/experienceState'
import type { ViewerCommand } from './scenes/CameraControls'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [state, dispatch] = useReducer(experienceReducer, initialExperienceState)
  const [ready, setReady] = useState(false)
  const [resetNonce, setResetNonce] = useState(0)
  const [exploring, setExploring] = useState(false)
  const [mode, setMode] = useState<ExploreMode>('explore')
  const [evidenceMode, setEvidenceMode] = useState(false)
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null)
  const [cameraViewId, setCameraViewId] = useState<CameraView['id']>('3d')
  const [viewerCommand, setViewerCommand] = useState<ViewerCommand | null>(null)
  const [labels, setLabels] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const experienceRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const province = getProvince(state.provinceId)
  const landmark = province.landmark
  const sceneReady = ready
  const activeSection = landmarkSections.find(({ id }) => id === state.panel)?.id ?? 'overview'
  const activeHotspot = landmark.hotspots.find(({ id }) => id === activeHotspotId) ?? null
  const cameraView = landmark.cameraViews.find(({ id }) => id === cameraViewId) ?? landmark.cameraViews[0]

  useEffect(() => {
    document.title = `${landmark.name} · Indonesia 3D Landmarks`
  }, [landmark.name])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return
      if (event.key === 'Escape') {
        setHelpOpen(false)
        setActiveHotspotId(null)
        dispatch({ type: 'close-panel' })
      }
      if (event.key.toLowerCase() === 'l') setLabels((value) => !value)
      if (event.key.toLowerCase() === 'r') resetView()
      if (event.key === '?') setHelpOpen((value) => !value)
      const viewIndex = Number(event.key) - 1
      if (viewIndex >= 0 && landmark.cameraViews[viewIndex]) selectCameraView(landmark.cameraViews[viewIndex].id)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [landmark.cameraViews])

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === experienceRef.current)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  function openPanel(panel: Exclude<ExperiencePanel, null>) {
    if (landmarkSections.some(({ id }) => id === panel)) setExploring(true)
    if (panel === 'architecture') setMode('architecture')
    if (panel === 'history' || panel === 'timeline') setMode('history')
    dispatch({ type: 'open-panel', panel })
  }

  function toggleExploration() {
    setExploring((value) => {
      if (value) {
        setMode('explore')
        setActiveHotspotId(null)
        dispatch({ type: 'close-panel' })
      }
      return !value
    })
  }

  function selectProvince(provinceId: string) {
    if (provinceId === state.provinceId) return
    setReady(false)
    setExploring(false)
    setMode('explore')
    setActiveHotspotId(null)
    setCameraViewId('3d')
    setLabels(false)
    setResetNonce((value) => value + 1)
    dispatch({ type: 'select-province', provinceId })
  }

  function selectMode(nextMode: ExploreMode) {
    setExploring(true)
    setMode(nextMode)
    setActiveHotspotId(null)
    if (nextMode === 'history') dispatch({ type: 'open-panel', panel: 'history' })
    else dispatch({ type: 'close-panel' })
  }

  function selectHotspot(id: string) {
    setExploring(true)
    setMode('architecture')
    setActiveHotspotId(id)
  }

  function selectCameraView(id: CameraView['id']) {
    setCameraViewId(id)
    setActiveHotspotId(null)
  }

  function resetView() {
    setCameraViewId('3d')
    setActiveHotspotId(null)
    setResetNonce((value) => value + 1)
  }

  function sendViewerCommand(type: ViewerCommand['type']) {
    setViewerCommand({ id: Date.now(), type })
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await experienceRef.current?.requestFullscreen()
  }

  if (!entered) {
    return (
      <main className="landing" data-reduced-motion={reducedMotion}>
        <div className="landing-index" aria-hidden="true"><span>01</span><span>02</span><span>03</span></div>
        <div className="landing-content">
          <p>Indonesia</p>
          <h1>Interactive<br />3D Heritage</h1>
          <p>Three landmarks. Three provincial stories. One source-backed digital exhibition.</p>
          <button type="button" onClick={() => setEntered(true)}>Explore Indonesia <span aria-hidden="true">→</span></button>
        </div>
        <footer className="landing-footer"><span>Jakarta</span><span>Yogyakarta</span><span>Sumatera Barat</span></footer>
      </main>
    )
  }

  return (
    <main ref={experienceRef} className={`experience experience--${landmark.slug}${exploring ? ' experience--exploring' : ''}`} data-scene-ready={sceneReady} data-reduced-motion={reducedMotion}>
      <LandmarkExperience landmark={landmark} onReady={() => setReady(true)} resetNonce={resetNonce} mode={mode} activeHotspot={activeHotspot} onHotspot={selectHotspot} cameraView={cameraView} command={viewerCommand} labels={labels} />

      <header className="brand-header">
        <img src="/images/nusantara-brand-horizontal.webp" alt="Indonesia — Warisan Budaya Nusantara" />
        <PrimaryNav active={state.panel} onOpen={openPanel} />
        <span className="locale-badge" aria-label="Language: Indonesian"><i aria-hidden="true" />ID</span>
      </header>

      <section className="identity" aria-label={`${landmark.name} introduction`}>
        <p className="eyebrow">Indonesia 3D Landmarks · {province.code}</p>
        <h1>{landmark.shortName}</h1>
        <p className="formal-name">{landmark.name}</p>
        <p className="location">{landmark.location}</p>
        <p className="hero-summary">{landmark.shortDescription}<ClaimSources landmark={landmark} claimIds={[landmark.overviewClaimId]} enabled={evidenceMode} /></p>
        <dl className="hero-facts">
          {landmark.facts.slice(0, 3).map((fact) => <div key={fact.id}><dd>{fact.value}</dd><dt>{fact.label}</dt></div>)}
        </dl>
        <button className="explore-cta" type="button" aria-pressed={exploring} onClick={toggleExploration}>
          {exploring ? 'View introduction' : `Explore ${landmark.shortName}`} <span aria-hidden="true">→</span>
        </button>
      </section>

      <SectionNavigation active={activeSection} onOpen={openPanel} />
      {exploring && <ExploreModes mode={mode} onMode={selectMode} />}
      {exploring && <button className="global-evidence-toggle" type="button" aria-pressed={evidenceMode} onClick={() => setEvidenceMode((value) => !value)}>{evidenceMode ? 'Sources on' : 'Show sources'}</button>}
      {exploring && <ViewerControls views={landmark.cameraViews} activeView={cameraViewId} labels={labels} onView={selectCameraView} onLabels={() => setLabels((value) => !value)} onReset={resetView} />}
      <button className="story-trigger" type="button" onClick={() => openPanel('overview')}>Explore story <span aria-hidden="true">＋</span></button>

      <div className="controls" aria-label="3D viewer controls">
        <p className="hint"><span aria-hidden="true">☝</span><span className="hint-desktop">Drag to rotate · Scroll to zoom</span><span className="hint-mobile">Drag to rotate · Pinch to zoom</span></p>
        <button type="button" onClick={resetView} aria-label="Reset camera view"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.6 9A8 8 0 1 1 4 13M4.6 9V4.8M4.6 9h4.2" /></svg>Reset view</button>
      </div>

      {exploring && <ViewerToolbar fullscreen={fullscreen} onHelp={() => setHelpOpen(true)} onZoomIn={() => sendViewerCommand('zoom-in')} onZoomOut={() => sendViewerCommand('zoom-out')} onFit={resetView} onFullscreen={toggleFullscreen} />}

      <CollectionNavigator provinces={provinces} activeId={province.id} onSelect={selectProvince} onExplore={() => openPanel('explore')} />

      {activeHotspot && <HotspotCard landmark={landmark} hotspot={activeHotspot} evidenceMode={evidenceMode} onClose={() => setActiveHotspotId(null)} />}
      {helpOpen && <HelpPanel cameraViews={landmark.cameraViews} onClose={() => setHelpOpen(false)} />}

      {state.panel === 'explore' && <ProvinceNavigator provinces={provinces} activeId={province.id} onSelect={selectProvince} onClose={() => dispatch({ type: 'close-panel' })} />}
      {state.panel && state.panel !== 'explore' && state.panel !== 'compare' && <InformationPanel key={state.panel} panel={state.panel} province={province} evidenceMode={evidenceMode} onEvidenceMode={() => setEvidenceMode((value) => !value)} onSection={(section: LandmarkSection) => openPanel(section)} onHotspot={selectHotspot} onNext={() => selectProvince(provinces[(provinces.findIndex((item) => item.id === province.id) + 1) % provinces.length].id)} onClose={() => dispatch({ type: 'close-panel' })} />}

      <div className={`loading ${ready ? 'loading--hidden' : ''}`} role="status" aria-live="polite">
        <img src="/images/nusantara-brand-horizontal.webp" alt="" />
        <span>Landmark {province.code}</span>
        <strong>{landmark.shortName}</strong>
        <p>Preparing the miniature</p>
      </div>
    </main>
  )
}
