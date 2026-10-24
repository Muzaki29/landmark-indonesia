import { useEffect, useState } from 'react'
import type { Landmark } from '../data/heritage'
import { useI18n } from '../i18n'
import type { InspectionMode } from '../state/experienceState'

type SectionAxis = 'x' | 'y' | 'z'
type ModelStudy = { view: 'FRONT' | 'SIDE' | 'TOP'; asset: string; classification: 'MODEL_STUDY'; interpretiveNotice: { id: string; en: string } }
type Manifest = { blueprintViews: ModelStudy[] }
const modeKeys = { explore: 'normalView', xray: 'xray', 'section-cut': 'sectionCut', blueprint: 'blueprint' } as const

export function InspectionPanel({ landmark, mode, axis, position, onMode, onAxis, onPosition, onClose }: {
  landmark: Landmark; mode: InspectionMode; axis: SectionAxis; position: number
  onMode: (mode: InspectionMode) => void; onAxis: (axis: SectionAxis) => void; onPosition: (position: number) => void; onClose: () => void
}) {
  const { locale, t } = useI18n()
  const capabilities = landmark.inspectionCapabilities
  const capability = mode === 'xray' ? capabilities.xray : mode === 'section-cut' ? capabilities.sectionCut : mode === 'blueprint' ? capabilities.blueprint : null
  return <aside className="inspection-panel" aria-label={t('inspectionMenu')}>
    <header><div><span>{t('inspection3d')}</span><strong>{landmark.shortName}</strong></div><button type="button" onClick={onClose} aria-label={t('closePanel')}>×</button></header>
    <div className="inspection-modes" role="group" aria-label={t('inspectionMenu')}>
      {(['explore', 'xray', 'section-cut', 'blueprint'] as const).map((item) => {
        const itemCapability = item === 'xray' ? capabilities.xray : item === 'section-cut' ? capabilities.sectionCut : item === 'blueprint' ? capabilities.blueprint : null
        return <button key={item} type="button" aria-pressed={mode === item} disabled={itemCapability?.status === 'UNAVAILABLE'} onClick={() => onMode(item)}><strong>{t(modeKeys[item])}</strong>{itemCapability && <span>{t(itemCapability.status.toLowerCase() as 'available' | 'limited' | 'unavailable')}</span>}</button>
      })}
    </div>
    {capability && <p className="inspection-note"><strong>{capability.status}</strong>{capability.description[locale]}</p>}
    {mode === 'section-cut' && <div className="section-controls"><span>{t('sectionAxis')}</span><div role="group" aria-label={t('sectionAxis')}>{(['x', 'y', 'z'] as const).map((item) => <button type="button" key={item} aria-pressed={axis === item} onClick={() => onAxis(item)}>{item.toUpperCase()}</button>)}</div><label>{t('position')}<input type="range" min="-1" max="1" step="0.05" value={position} onChange={(event) => onPosition(Number(event.target.value))} /></label></div>}
    {mode === 'blueprint' && <BlueprintModelStudy landmark={landmark} />}
  </aside>
}

function BlueprintModelStudy({ landmark }: { landmark: Landmark }) {
  const { locale, t } = useI18n()
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [active, setActive] = useState<'FRONT' | 'SIDE' | 'TOP'>('FRONT')
  useEffect(() => {
    if (landmark.slug !== 'monas') return
    let mounted = true
    fetch('/generated/heritage/monas/manifest.json')
      .then((response) => response.ok ? response.json() as Promise<Manifest> : Promise.reject(new Error(String(response.status))))
      .then((value) => { if (mounted) setManifest(value) })
      .catch(() => { if (mounted) setManifest(null) })
    return () => { mounted = false }
  }, [landmark.slug])
  if (landmark.slug !== 'monas' || !manifest) return <p className="model-study-notice">{t('modelStudyNotice')}</p>
  const study = manifest.blueprintViews.find((item) => item.view === active)
  return <section className="model-study"><div className="model-study-tabs" role="group" aria-label={t('blueprintStudy')}>{(['FRONT', 'SIDE', 'TOP'] as const).map((view) => <button key={view} type="button" aria-pressed={active === view} onClick={() => setActive(view)}>{t(view.toLowerCase() as 'front' | 'side' | 'top')}</button>)}</div>{study && <img src={`/generated/heritage/monas/${study.asset}`} width="1600" height="1200" loading="lazy" alt={`${landmark.name} · ${active} · ${t('blueprintStudy')}`} />}<p><strong>{t('blueprintStudy')} · MODEL STUDY</strong>{study?.interpretiveNotice[locale] ?? t('modelStudyNotice')}</p></section>
}
