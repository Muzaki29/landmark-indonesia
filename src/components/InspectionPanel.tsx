import { useEffect, useState } from 'react'
import type { Landmark } from '../data/heritage'
import { BLUEPRINT_VIEWS, DISPLAY_MODES, shouldLoadDisplayManifest } from '../displayModes'
import { useI18n, type MessageKey } from '../i18n'
import type { BlueprintView, DisplayMode } from '../state/experienceState'

type SectionAxis = 'x' | 'y' | 'z'
type ModelStudy = {
  view: BlueprintView
  asset: string
  modelVersion: string
  classification: 'MODEL_STUDY'
  verifiedDimensionReferences: string[]
  interpretiveNotice: { id: string; en: string }
}
type Manifest = {
  modelVersion: string
  geometry: { components: Array<{ id: string; classification: 'DOCUMENTED' | 'DERIVED' | 'INTERPRETIVE' }> }
  blueprintViews: ModelStudy[]
  validation: { status: 'PASS' | 'FAIL' }
}

const modeKeys: Record<DisplayMode, MessageKey> = { real: 'real', clay: 'clay', xray: 'xray', blueprint: 'blueprint' }
const componentKeys: Record<string, MessageKey> = { 'museum-base': 'museumBase', 'obelisk-shaft': 'obeliskShaft', 'independence-flame': 'independenceFlame' }

export function InspectionPanel({ landmark, mode, blueprintView, sectionCut, axis, position, onMode, onBlueprintView, onSectionCut, onAxis, onPosition }: {
  landmark: Landmark
  mode: DisplayMode
  blueprintView: BlueprintView
  sectionCut: boolean
  axis: SectionAxis
  position: number
  onMode: (mode: DisplayMode) => void
  onBlueprintView: (view: BlueprintView) => void
  onSectionCut: (enabled: boolean) => void
  onAxis: (axis: SectionAxis) => void
  onPosition: (position: number) => void
}) {
  const { locale, t } = useI18n()
  const [manifest, setManifest] = useState<Manifest | null>()
  const capabilities = landmark.inspectionCapabilities
  const capability = capabilities.display[mode]

  useEffect(() => {
    if (!shouldLoadDisplayManifest(mode, landmark.slug)) return
    const controller = new AbortController()
    fetch('/generated/heritage/monas/manifest.json', { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<Manifest> : Promise.reject(new Error(String(response.status))))
      .then(setManifest)
      .catch((error: unknown) => { if (!(error instanceof DOMException && error.name === 'AbortError')) setManifest(null) })
    return () => controller.abort()
  }, [landmark.slug, mode])

  return <aside className={`display-panel display-panel--${mode}`} aria-label={t('displayModes')}>
    <header><span>{t('display')}</span><strong>{landmark.shortName}</strong></header>
    <div className="display-modes" role="group" aria-label={t('displayModes')}>
      {DISPLAY_MODES.map((item) => {
        const itemCapability = capabilities.display[item]
        const unavailable = itemCapability.status === 'UNAVAILABLE'
        return <button key={item} type="button" aria-pressed={mode === item} aria-describedby={unavailable ? `display-${landmark.slug}-${item}-reason` : undefined} disabled={unavailable} title={itemCapability.description[locale]} onClick={() => onMode(item)}>
          <span>{t(modeKeys[item])}</span>{itemCapability.status !== 'AVAILABLE' && <small>{t(itemCapability.status.toLowerCase() as 'limited' | 'unavailable')}</small>}
        </button>
      })}
    </div>
    {DISPLAY_MODES.map((item) => capabilities.display[item].status === 'UNAVAILABLE' && <span className="sr-only" id={`display-${landmark.slug}-${item}-reason`} key={item}>{capabilities.display[item].description[locale]}</span>)}

    <div className="display-context" aria-live="polite">
      {mode === 'real' && <p className="display-note"><strong>{t('interpretiveModel')}</strong>{capability.description[locale]}</p>}
      {mode === 'clay' && <p className="display-note"><strong>{t('physicalStudy')}</strong>{capability.description[locale]}</p>}
      {mode === 'xray' && <XrayStudy manifest={manifest} description={capability.description[locale]} />}
      {mode === 'blueprint' && <BlueprintModelStudy landmark={landmark} manifest={manifest} active={blueprintView} onActive={onBlueprintView} />}
    </div>

    <section className="inspection-tool" aria-labelledby="inspect-heading">
      <div><span id="inspect-heading">{t('inspect')}</span><small>{t('separateTool')}</small></div>
      <button type="button" aria-pressed={sectionCut} disabled={mode === 'blueprint'} onClick={() => onSectionCut(!sectionCut)}>{t('sectionCut')}<small>{mode === 'blueprint' ? t('notCompatible') : t('limited')}</small></button>
      {sectionCut && mode !== 'blueprint' && <div className="section-controls">
        <span>{t('sectionAxis')}</span>
        <div role="group" aria-label={t('sectionAxis')}>{(['x', 'y', 'z'] as const).map((item) => <button type="button" key={item} aria-pressed={axis === item} onClick={() => onAxis(item)}>{item.toUpperCase()}</button>)}</div>
        <label>{t('position')}<input aria-label={t('position')} type="range" min="-1" max="1" step="0.05" value={position} onChange={(event) => onPosition(Number(event.target.value))} /></label>
        <p>{capabilities.inspection.sectionCut.description[locale]}</p>
      </div>}
    </section>
  </aside>
}

function XrayStudy({ manifest, description }: { manifest: Manifest | null | undefined; description: string }) {
  const { t } = useI18n()
  return <section className="xray-study">
    <p className="display-note"><strong>{t('limitedXray')}</strong>{description}</p>
    {manifest?.geometry.components && <ol className="component-legend">{manifest.geometry.components.map((component) => <li key={component.id}><span>{t(componentKeys[component.id] ?? 'component')}</span><small>{component.classification}</small></li>)}</ol>}
  </section>
}

function BlueprintModelStudy({ landmark, manifest, active, onActive }: { landmark: Landmark; manifest: Manifest | null | undefined; active: BlueprintView; onActive: (view: BlueprintView) => void }) {
  const { locale, t } = useI18n()
  if (manifest === undefined) return <p className="model-study-notice">{t('loadingStudy')}</p>
  if (!manifest) return <p className="model-study-notice">{t('modelStudyUnavailable')}</p>
  const study = manifest.blueprintViews.find((item) => item.view === active)
  return <section className="model-study">
    <div className="study-heading"><span>{t('blueprint')}</span><strong>{t('modelStudy')}</strong><small>{landmark.name}</small></div>
    <div className="model-study-tabs" role="group" aria-label={t('blueprintStudy')}>{BLUEPRINT_VIEWS.map((view) => <button key={view} type="button" aria-pressed={active === view} onClick={() => onActive(view)}>{t(view.toLowerCase() as 'front' | 'side' | 'top')}</button>)}</div>
    {study && <img src={`/generated/heritage/monas/${study.asset}`} width="1600" height="1200" loading="lazy" alt={`${landmark.name} · ${active} · ${t('blueprintStudy')}`} />}
    <dl className="study-metadata">
      <div><dt>{t('classification')}</dt><dd>{study?.classification ?? 'MODEL_STUDY'}</dd></div>
      <div><dt>{t('modelVersion')}</dt><dd>{study?.modelVersion ?? manifest.modelVersion}</dd></div>
      <div><dt>{t('evidenceStatus')}</dt><dd>{manifest.validation.status}</dd></div>
      <div><dt>{t('verifiedDimensions')}</dt><dd>{study?.verifiedDimensionReferences.join(' · ') || '—'}</dd></div>
    </dl>
    <p>{study?.interpretiveNotice[locale] ?? t('modelStudyNotice')}</p>
    <small className="documented-drawing-note">{t('noDocumentedDrawing')}</small>
  </section>
}
