import { useEffect, useReducer, useState } from 'react'
import { InformationPanel, PrimaryNav, ProvinceNavigator } from './components/ExperiencePanels'
import { LandmarkExperience } from './components/LandmarkExperience'
import { getProvince, provinces } from './data/heritage'
import { useReducedMotion } from './hooks/useReducedMotion'
import { experienceReducer, initialExperienceState, landmarkSections, type ExperiencePanel, type LandmarkSection } from './state/experienceState'

export default function App() {
  const [entered, setEntered] = useState(false)
  const [state, dispatch] = useReducer(experienceReducer, initialExperienceState)
  const [ready, setReady] = useState(false)
  const [resetNonce, setResetNonce] = useState(0)
  const reducedMotion = useReducedMotion()
  const province = getProvince(state.provinceId)
  const landmark = province.landmark
  const sceneReady = ready

  useEffect(() => {
    document.title = `${landmark.name} · Indonesia 3D Landmarks`
  }, [landmark.name])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && dispatch({ type: 'close-panel' })
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  function openPanel(panel: Exclude<ExperiencePanel, null>) {
    dispatch({ type: 'open-panel', panel })
  }

  function selectProvince(provinceId: string) {
    setReady(false)
    setResetNonce((value) => value + 1)
    dispatch({ type: 'select-province', provinceId })
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
    <main className={`experience experience--${landmark.slug}`} data-scene-ready={sceneReady} data-reduced-motion={reducedMotion}>
      <LandmarkExperience landmark={landmark} onReady={() => setReady(true)} resetNonce={resetNonce} />

      <header className="identity">
        <p className="eyebrow">Indonesia 3D Landmarks · {province.code}</p>
        <h1>{landmark.shortName}</h1>
        <p className="location">{landmark.location}</p>
      </header>

      <PrimaryNav active={state.panel} onOpen={openPanel} />

      <aside className="fact" aria-label="Landmark status">
        <span>{landmark.facts[0].value}</span>
        <p>{landmark.type}</p>
      </aside>

      <nav className="section-nav" aria-label="Landmark information">
        {landmarkSections.map((section) => <button key={section.id} type="button" onClick={() => openPanel(section.id)}>{section.label}</button>)}
      </nav>
      <button className="story-trigger" type="button" onClick={() => openPanel('overview')}>Story &amp; sources</button>

      <div className="controls" aria-label="3D viewer controls"><p className="hint"><span className="hint-desktop">Drag to rotate · Scroll to zoom</span><span className="hint-mobile">Drag to rotate · Pinch to zoom</span></p><button type="button" onClick={() => setResetNonce((value) => value + 1)} aria-label="Reset camera view"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.6 9A8 8 0 1 1 4 13M4.6 9V4.8M4.6 9h4.2" /></svg>Reset view</button></div>

      <button className="province-trigger" type="button" onClick={() => openPanel('explore')}><span>{province.code}</span><span><small>Current province</small>{province.name}</span><b aria-hidden="true">＋</b></button>

      {state.panel === 'explore' && <ProvinceNavigator provinces={provinces} activeId={province.id} onSelect={selectProvince} onClose={() => dispatch({ type: 'close-panel' })} />}
      {state.panel && state.panel !== 'explore' && <InformationPanel key={state.panel} panel={state.panel} province={province} onSection={(section: LandmarkSection) => openPanel(section)} onNext={() => selectProvince(provinces[(provinces.findIndex((item) => item.id === province.id) + 1) % provinces.length].id)} onClose={() => dispatch({ type: 'close-panel' })} />}

      <div className={`loading ${ready ? 'loading--hidden' : ''}`} role="status" aria-live="polite"><span className="loading-mark" aria-hidden="true" /><p>Preparing the miniature</p></div>
    </main>
  )
}
