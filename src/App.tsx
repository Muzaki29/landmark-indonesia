import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { ClaimSources, CollectionNavigator, ExploreModes, HelpPanel, HotspotCard, InformationPanel, PrimaryNav, ProvinceNavigator, SectionNavigation, ViewerControls, ViewerToolbar } from './components/ExperiencePanels'
import { LandmarkExperience } from './components/LandmarkExperience'
import { InspectionPanel } from './components/InspectionPanel'
import { GuidedTourPanel } from './components/GuidedTour'
import { getLocalizedProvince, getProvinces, type CameraView } from './data/heritage'
import { getHeritageTour } from './data/tours'
import { displaySearch, resolveDisplayMode } from './displayModes'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useI18n, type Locale } from './i18n'
import { experienceReducer, initialExperienceState, landmarkSections, type BlueprintView, type DisplayMode, type ExperiencePanel, type ExploreMode, type LandmarkSection } from './state/experienceState'
import { readViewerState, viewerSearch } from './state/viewerState'
import type { ViewerCommand } from './scenes/CameraControls'
import { parsePublicRoute, publicPath } from './routing'
import { applyPageMetadata, createPageMetadata } from './seo'

export default function App() {
  const { locale, setLocale, t } = useI18n()
  const initialRoute = useRef(typeof window === 'undefined' ? { locale, panel: null, entered: false } : parsePublicRoute(window.location.pathname)).current
  const initialProvinceId = initialRoute.provinceId ?? initialExperienceState.provinceId
  const initialLandmark = getLocalizedProvince(initialProvinceId, locale).landmark
  const initialViewer = useRef(readViewerState(typeof window === 'undefined' ? '' : window.location.search, initialLandmark)).current
  const [entered, setEntered] = useState(initialRoute.entered)
  const [state, dispatch] = useReducer(experienceReducer, { ...initialExperienceState, provinceId: initialProvinceId, panel: initialRoute.panel })
  const [ready, setReady] = useState(false)
  const [resetNonce, setResetNonce] = useState(0)
  const [exploring, setExploring] = useState(initialRoute.entered && (initialViewer.displayMode !== 'real' || Boolean(initialViewer.activeHotspotId) || Boolean(initialViewer.tour)))
  const [mode, setMode] = useState<ExploreMode>(initialViewer.activeHotspotId || initialViewer.tour ? 'architecture' : 'explore')
  const [evidenceMode, setEvidenceMode] = useState(initialViewer.evidenceMode)
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(initialViewer.activeHotspotId)
  const [cameraViewId, setCameraViewId] = useState<CameraView['id']>(initialViewer.cameraViewId)
  const [viewerCommand, setViewerCommand] = useState<ViewerCommand | null>(null)
  const [labels, setLabels] = useState(initialViewer.labels)
  const [helpOpen, setHelpOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialViewer.displayMode)
  const [blueprintView, setBlueprintView] = useState<BlueprintView>(initialViewer.blueprintView)
  const [sectionCut, setSectionCut] = useState(initialViewer.sectionCut)
  const [sectionAxis, setSectionAxis] = useState<'x' | 'y' | 'z'>(initialViewer.sectionAxis)
  const [sectionPosition, setSectionPosition] = useState(initialViewer.sectionPosition)
  const [tourSession, setTourSession] = useState<{ step: number; paused: boolean } | null>(initialViewer.tour ? { step: initialViewer.tour.step, paused: initialViewer.tour.paused } : null)
  const experienceRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const provinces = getProvinces(locale)
  const province = getLocalizedProvince(state.provinceId, locale)
  const landmark = province.landmark
  const tour = useMemo(() => getHeritageTour(landmark, locale), [landmark, locale])
  const tourStep = tourSession ? tour.steps[tourSession.step] : null
  const activeDisplayMode = resolveDisplayMode(displayMode, landmark.inspectionCapabilities.display)
  const sceneReady = ready
  const activeSection = landmarkSections.find(({ id }) => id === state.panel)?.id ?? 'overview'
  const activeHotspot = landmark.hotspots.find(({ id }) => id === activeHotspotId) ?? null
  const cameraView = tourStep?.camera ?? landmark.cameraViews.find(({ id }) => id === cameraViewId) ?? landmark.cameraViews[0]

  useEffect(() => {
    const route = { locale, provinceId: state.provinceId, panel: state.panel, entered }
    applyPageMetadata(createPageMetadata(route, province))
    if (window.location.pathname === '/') window.history.replaceState(null, '', publicPath(route))
  }, [entered, locale, province, state.panel, state.provinceId])

  useEffect(() => {
    const rawMode = new URLSearchParams(window.location.search).get('display')
    if (rawMode && rawMode !== activeDisplayMode) {
      window.history.replaceState(null, '', `${window.location.pathname}${displaySearch(window.location.search, activeDisplayMode, blueprintView)}`)
    }
  }, [activeDisplayMode, blueprintView])

  useEffect(() => {
    const onPopState = () => {
      const route = parsePublicRoute(window.location.pathname)
      setLocale(route.locale)
      setEntered(route.entered)
      const targetProvinceId = route.provinceId ?? initialExperienceState.provinceId
      const target = getLocalizedProvince(targetProvinceId, route.locale).landmark
      const nextViewer = readViewerState(window.location.search, target)
      setDisplayMode(nextViewer.displayMode)
      setBlueprintView(nextViewer.blueprintView)
      setSectionCut(nextViewer.sectionCut)
      setCameraViewId(nextViewer.cameraViewId)
      setTourSession(nextViewer.tour ? { step: nextViewer.tour.step, paused: nextViewer.tour.paused } : null)
      setActiveHotspotId(nextViewer.activeHotspotId)
      setLabels(nextViewer.labels)
      setExploring(Boolean(nextViewer.activeHotspotId || nextViewer.tour) || nextViewer.displayMode !== 'real')
      if (route.provinceId) dispatch({ type: 'select-province', provinceId: route.provinceId })
      if (route.panel) dispatch({ type: 'open-panel', panel: route.panel })
      else dispatch({ type: 'close-panel' })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [setLocale])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement) return
      if (event.key === 'Escape') {
        setHelpOpen(false)
        setActiveHotspotId(null)
        setSectionCut(false)
        setTourSession(null)
        dispatch({ type: 'close-panel' })
        const params = new URLSearchParams(window.location.search)
        params.delete('tour'); params.delete('step'); params.delete('hotspot')
        window.history.replaceState(null, '', `${window.location.pathname}${params.size ? `?${params}` : ''}`)
      }
      if (tourSession && event.key === 'ArrowLeft') { event.preventDefault(); selectTourStep(tourSession.step - 1) }
      if (tourSession && event.key === 'ArrowRight') { event.preventDefault(); selectTourStep(tourSession.step + 1) }
      if (tourSession && event.key === ' ') { event.preventDefault(); setTourSession((value) => value && ({ ...value, paused: !value.paused })) }
      if (event.key.toLowerCase() === 'l') setLabels((value) => !value)
      if (event.key.toLowerCase() === 'r') resetView()
      if (event.key === '?') setHelpOpen((value) => !value)
      const viewIndex = Number(event.key) - 1
      if (viewIndex >= 0 && landmark.cameraViews[viewIndex]) selectCameraView(landmark.cameraViews[viewIndex].id)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  // Keyboard listener is rebound when the active tour step changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landmark.cameraViews, tourSession])

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
    navigate(panel, state.provinceId)
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
    if (provinceId === state.provinceId) {
      dispatch({ type: 'close-panel' })
      navigate(null, provinceId)
      return
    }
    const nextDisplayMode = resolveDisplayMode(displayMode, getLocalizedProvince(provinceId, locale).landmark.inspectionCapabilities.display)
    setReady(false)
    setExploring(false)
    setMode('explore')
    setActiveHotspotId(null)
    setCameraViewId('3d')
    setLabels(false)
    setTourSession(null)
    setSectionCut(false)
    setDisplayMode(nextDisplayMode)
    if (nextDisplayMode === 'blueprint') setSectionCut(false)
    setSectionPosition(0)
    setResetNonce((value) => value + 1)
    dispatch({ type: 'select-province', provinceId })
    navigate(null, provinceId, locale, nextDisplayMode)
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
    const step = tour.steps.findIndex((item) => item.hotspotId === id)
    if (tourSession && step >= 0) setTourSession({ step, paused: false })
    replaceExperienceSearch(activeDisplayMode, tourSession && step >= 0 ? { step, paused: false } : tourSession, id)
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

  function selectDisplayMode(nextMode: DisplayMode) {
    const next = resolveDisplayMode(nextMode, landmark.inspectionCapabilities.display)
    setDisplayMode(next)
    if (next === 'blueprint') setSectionCut(false)
    replaceExperienceSearch(next, tourSession, activeHotspotId)
  }

  function selectBlueprintView(nextView: BlueprintView) {
    setBlueprintView(nextView)
    window.history.replaceState(null, '', `${window.location.pathname}${displaySearch(window.location.search, activeDisplayMode, nextView)}`)
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await experienceRef.current?.requestFullscreen()
  }

  function startTour(index = 0) {
    setExploring(true)
    setMode('architecture')
    selectTourStep(index)
  }

  function selectTourStep(index: number) {
    const nextIndex = Math.max(0, Math.min(tour.steps.length - 1, index))
    const step = tour.steps[nextIndex]
    if (!step) return
    const nextMode = resolveDisplayMode(step.displayMode ?? activeDisplayMode, landmark.inspectionCapabilities.display)
    setTourSession({ step: nextIndex, paused: false })
    setCameraViewId(step.camera.id)
    setActiveHotspotId(step.hotspotId ?? null)
    setLabels(step.labels)
    setDisplayMode(nextMode)
    setSectionCut(false)
    if (step.blueprintView) setBlueprintView(step.blueprintView)
    replaceExperienceSearch(nextMode, { step: nextIndex, paused: false }, step.hotspotId ?? null, step.blueprintView)
  }

  function exitTour() {
    setTourSession(null)
    setActiveHotspotId(null)
    replaceExperienceSearch(activeDisplayMode, null, null)
  }

  function replaceExperienceSearch(nextMode: DisplayMode, session: typeof tourSession, hotspotId: string | null, nextBlueprint = blueprintView) {
    const search = viewerSearch({ displayMode: nextMode, blueprintView: nextBlueprint, sectionCut, sectionAxis, sectionPosition, activeHotspotId: hotspotId, cameraViewId, labels, evidenceMode, tour: session ? { id: tour.id, ...session } : null })
    window.history.replaceState(null, '', `${window.location.pathname}${search}`)
  }

  async function shareExperience() {
    try { await navigator.clipboard.writeText(window.location.href) }
    catch { window.prompt(t('copyLink'), window.location.href) }
  }

  function navigate(panel: ExperiencePanel, provinceId: string, nextLocale = locale, nextDisplayMode = activeDisplayMode) {
    const path = publicPath({ locale: nextLocale, provinceId, panel, entered: true })
    window.history.pushState(null, '', `${path}${displaySearch(window.location.search, nextDisplayMode, blueprintView)}`)
  }

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale)
    const path = publicPath({ locale: nextLocale, provinceId: state.provinceId, panel: state.panel, entered })
    window.history.replaceState(null, '', `${path}${displaySearch(window.location.search, activeDisplayMode, blueprintView)}`)
  }

  if (!entered) {
    return (
      <main className="landing" data-reduced-motion={reducedMotion}>
        <LanguageSelector locale={locale} onLocale={changeLocale} className="landing-language" />
        <div className="landing-index" aria-hidden="true"><span>01</span><span>02</span><span>03</span></div>
        <div className="landing-content">
          <p>Indonesia</p>
          <h1>{t('interactiveHeritage').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
          <p>{t('landingSummary')}</p>
          <button type="button" onClick={() => { setEntered(true); navigate(null, state.provinceId) }}>{t('exploreIndonesia')} <span aria-hidden="true">→</span></button>
        </div>
        <footer className="landing-footer"><span>Jakarta</span><span>Yogyakarta</span><span>Sumatera Barat</span></footer>
      </main>
    )
  }

  return (
    <main ref={experienceRef} className={`experience experience--${landmark.slug}${exploring ? ' experience--exploring' : ''}`} data-scene-ready={sceneReady} data-reduced-motion={reducedMotion}>
      <LandmarkExperience landmark={landmark} onReady={() => setReady(true)} resetNonce={resetNonce} mode={mode} activeHotspot={activeHotspot} onHotspot={selectHotspot} cameraView={cameraView} command={viewerCommand} labels={labels} displayMode={activeDisplayMode} sectionCut={sectionCut} sectionAxis={sectionAxis} sectionPosition={sectionPosition} />

      <header className="brand-header">
        <img src="/images/nusantara-brand-horizontal.webp" alt="Indonesia — Warisan Budaya Nusantara" />
        <PrimaryNav active={state.panel} onOpen={openPanel} />
        <LanguageSelector locale={locale} onLocale={changeLocale} />
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
          {exploring ? t('viewIntroduction') : `${t('explore')} ${landmark.shortName}`} <span aria-hidden="true">→</span>
        </button>
      </section>

      <SectionNavigation active={activeSection} onOpen={openPanel} />
      {exploring && <ExploreModes mode={mode} onMode={selectMode} />}
      {exploring && <button className="global-evidence-toggle" type="button" aria-pressed={evidenceMode} onClick={() => setEvidenceMode((value) => !value)}>{evidenceMode ? t('sourcesOn') : t('showSourcesShort')}</button>}
      {exploring && <ViewerControls views={landmark.cameraViews} activeView={cameraViewId} labels={labels} onView={selectCameraView} onLabels={() => setLabels((value) => !value)} onReset={resetView} />}
      <button className="story-trigger" type="button" onClick={() => openPanel('overview')}>{t('exploreStory')} <span aria-hidden="true">＋</span></button>

      <div className="controls" aria-label={t('viewerToolbar')}>
        <p className="hint"><span aria-hidden="true">☝</span><span className="hint-desktop">{t('dragRotate')}</span><span className="hint-mobile">{t('dragPinch')}</span></p>
        <button type="button" onClick={resetView} aria-label={t('resetCamera')}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.6 9A8 8 0 1 1 4 13M4.6 9V4.8M4.6 9h4.2" /></svg>{t('resetView')}</button>
      </div>

      {exploring && <ViewerToolbar fullscreen={fullscreen} onHelp={() => setHelpOpen(true)} onZoomIn={() => sendViewerCommand('zoom-in')} onZoomOut={() => sendViewerCommand('zoom-out')} onFit={resetView} onShare={shareExperience} onFullscreen={toggleFullscreen} />}
      {exploring && <InspectionPanel landmark={landmark} mode={activeDisplayMode} blueprintView={blueprintView} sectionCut={sectionCut} axis={sectionAxis} position={sectionPosition} onMode={selectDisplayMode} onBlueprintView={selectBlueprintView} onSectionCut={setSectionCut} onAxis={setSectionAxis} onPosition={setSectionPosition} />}

      <CollectionNavigator provinces={provinces} activeId={province.id} onSelect={selectProvince} onExplore={() => openPanel('explore')} />

      {!tourSession && exploring && <button className="tour-trigger" type="button" onClick={() => startTour()}>{tour.title} <span aria-hidden="true">→</span></button>}
      {tourSession && <GuidedTourPanel key={`${landmark.id}-${tourSession.step}`} landmark={landmark} tour={tour} stepIndex={tourSession.step} paused={tourSession.paused} onStep={selectTourStep} onPause={() => setTourSession((value) => value && ({ ...value, paused: !value.paused }))} onExit={exitTour} />}

      {activeHotspot && !tourSession && <HotspotCard landmark={landmark} hotspot={activeHotspot} evidenceMode={evidenceMode} onClose={() => setActiveHotspotId(null)} />}
      {helpOpen && <HelpPanel cameraViews={landmark.cameraViews} onClose={() => setHelpOpen(false)} />}

      {state.panel === 'explore' && <ProvinceNavigator provinces={provinces} activeId={province.id} onSelect={selectProvince} onClose={() => dispatch({ type: 'close-panel' })} />}
      {state.panel && state.panel !== 'explore' && state.panel !== 'compare' && <InformationPanel key={state.panel} panel={state.panel} province={province} evidenceMode={evidenceMode} onEvidenceMode={() => setEvidenceMode((value) => !value)} onSection={(section: LandmarkSection) => openPanel(section)} onHotspot={selectHotspot} onNext={() => selectProvince(provinces[(provinces.findIndex((item) => item.id === province.id) + 1) % provinces.length].id)} onClose={() => dispatch({ type: 'close-panel' })} />}

      <div className={`loading ${ready ? 'loading--hidden' : ''}`} role="status" aria-live="polite">
        <img src="/images/nusantara-brand-horizontal.webp" alt="" />
        <span>{t('landmark')} {province.code}</span>
        <strong>{landmark.shortName}</strong>
        <p>{t('preparingMiniature')}</p>
      </div>
    </main>
  )
}

function LanguageSelector({ locale, onLocale, className = '' }: { locale: Locale; onLocale: (locale: Locale) => void; className?: string }) {
  const { t } = useI18n()
  return <div className={`locale-switch ${className}`} role="group" aria-label={t('language')}>{(['id', 'en'] as const).map((item) => <button key={item} type="button" aria-pressed={locale === item} onClick={() => onLocale(item)}>{item.toUpperCase()}</button>)}</div>
}
