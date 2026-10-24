import { useState } from 'react'
import type { HeritageTour } from '../data/tours'
import type { Landmark } from '../data/heritage'
import { canDisplayArchiveAsset } from '../data/heritage'
import { ClaimSources } from './ExperiencePanels'
import { useI18n } from '../i18n'

export function GuidedTourPanel({ landmark, tour, stepIndex, paused, onStep, onPause, onExit }: {
  landmark: Landmark
  tour: HeritageTour
  stepIndex: number
  paused: boolean
  onStep: (index: number) => void
  onPause: () => void
  onExit: () => void
}) {
  const { locale, t } = useI18n()
  const [archiveId, setArchiveId] = useState<string | null>(null)
  const step = tour.steps[stepIndex]
  const archive = landmark.archive.find(({ id }) => id === archiveId)
  if (!step) return null
  const copy = locale === 'id'
    ? { prev: 'Sebelumnya', next: 'Berikutnya', pause: 'Jeda', resume: 'Lanjutkan', exit: 'Keluar tur', source: 'Bukti', archive: 'Arsip terkait', close: 'Tutup arsip', rights: 'Hak penggunaan', original: 'Buka sumber asli' }
    : { prev: 'Previous', next: 'Next', pause: 'Pause', resume: 'Resume', exit: 'Exit tour', source: 'Evidence', archive: 'Related archive', close: 'Close archive', rights: 'Rights', original: 'Open original source' }
  return <>
    <aside className="tour-panel" aria-label={tour.title} aria-live="polite">
      <header><span>{tour.title}</span><strong>{String(stepIndex + 1).padStart(2, '0')} / {String(tour.steps.length).padStart(2, '0')}</strong><button type="button" onClick={onExit} aria-label={copy.exit}>×</button></header>
      <div className="tour-copy"><span>{step.hotspotId ? landmark.hotspots.find(({ id }) => id === step.hotspotId)?.category : copy.source}</span><h2>{step.title}</h2><p>{step.body}<ClaimSources landmark={landmark} claimIds={step.claimIds} /></p></div>
      {step.archiveItemIds.length > 0 && <div className="tour-archive"><strong>{copy.archive}</strong>{step.archiveItemIds.map((id) => { const item = landmark.archive.find((entry) => entry.id === id); return item && <button type="button" key={id} onClick={() => setArchiveId(id)}>{item.title[locale]} <span aria-hidden="true">＋</span></button> })}</div>}
      <footer><button type="button" disabled={stepIndex === 0 || paused} onClick={() => onStep(stepIndex - 1)}>← {copy.prev}</button><button type="button" onClick={onPause}>{paused ? copy.resume : copy.pause}</button><button type="button" disabled={stepIndex === tour.steps.length - 1 || paused} onClick={() => onStep(stepIndex + 1)}>{copy.next} →</button></footer>
    </aside>
    {archive && <aside className="archive-overlay" role="dialog" aria-modal="true" aria-label={archive.title[locale]}>
      <button type="button" onClick={() => setArchiveId(null)} aria-label={copy.close}>×</button>
      <span>{archive.type.replaceAll('_', ' ')}</span><h2>{archive.title[locale]}</h2>
      {canDisplayArchiveAsset(archive) && archive.asset && <img src={archive.asset} alt={archive.caption[locale]} />}
      <p>{archive.caption[locale]}</p><dl>{(archive.year || archive.date) && <div><dt>{t('yearDate')}</dt><dd>{archive.year ?? archive.date}</dd></div>}{archive.creator && <div><dt>{t('creator')}</dt><dd>{archive.creator}</dd></div>}{archive.institution && <div><dt>{t('institution')}</dt><dd>{archive.institution}</dd></div>}<div><dt>{copy.rights}</dt><dd>{archive.license ?? archive.rightsStatus}</dd></div><div><dt>{t('verification')}</dt><dd>{archive.verificationStatus}</dd></div></dl>
      <a href={archive.sourceUrl} target="_blank" rel="noreferrer">{copy.original} ↗</a>
    </aside>}
  </>
}
