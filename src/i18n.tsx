/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Locale = 'id' | 'en'

const messages = {
  en: {
    explore: 'Explore', about: 'About', sources: 'Sources', support: 'Support', exploreIndonesia: 'Explore Indonesia', interactiveHeritage: 'Interactive\n3D Heritage',
    landingSummary: 'Three landmarks. Three provincial stories. One source-backed digital exhibition.', language: 'Language', primary: 'Primary navigation',
    overview: 'Overview', history: 'History', architecture: 'Architecture', timeline: 'Timeline', culturalContext: 'Cultural Context', connectedHeritage: 'Connected Heritage', archive: 'Archive',
    exploreMode: 'Explore', architectureMode: 'Architecture', historyMode: 'History', explorationMode: '3D exploration mode',
    view: 'View', inspectionControls: '3D inspection controls', labels: 'Labels', resetView: 'Reset view', viewerToolbar: '3D viewer toolbar',
    help: 'Help', zoomIn: 'Zoom in', zoomOut: 'Zoom out', fitView: 'Fit view', fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen',
    viewerHelp: 'Viewer help', controlsShortcuts: 'Controls & shortcuts', navigation: 'Navigation', drag: 'Drag', orbitLandmark: 'Orbit landmark',
    scrollPinch: 'Scroll / pinch', zoom: 'Zoom', clickMarker: 'Click marker', selectFocus: 'Select and focus component', camera: 'Camera', cameraView: 'view',
    resetFit: 'Reset / fit view', exploration: 'Exploration', componentLabels: 'Component labels', openHelp: 'Open this help', closePanelHotspot: 'Close panel or hotspot',
    landmarkInformation: 'Landmark information', landmarkCollection: 'Landmark collection', exploreAtlas: 'Explore Indonesia atlas', digitalHeritageAtlas: 'Digital Heritage Atlas', mapSearch: 'Map & search',
    compareLandmarks: 'Compare landmarks', atlasView: 'Atlas view', searchCollection: 'Search collection', searchPlaceholder: 'Landmark, province, city, period…',
    province: 'Province', allActiveProvinces: 'All active provinces', indonesiaMap: 'Map of Indonesia with active landmark locations', naturalEarthBoundary: 'Indonesia boundary from Natural Earth',
    openLandmark: 'Open', mapUnavailable: 'Geographic boundary unavailable. The verified collection list remains accessible below.',
    mapCredit: 'Boundary: Natural Earth 1:110m, public domain. Markers use official heritage coordinates.', verifiedLandmark: 'verified landmark', verifiedLandmarks: 'verified landmarks',
    open3d: 'Open 3D', noSearchResults: 'No verified landmark in the current collection matches this search.', comparisonIntro: 'A source-backed comparison. Missing fields are left blank and fields unavailable for every landmark are hidden.',
    field: 'Field', notEstablished: 'Not established', aboutCollection: 'About this collection', aboutProject: 'About the project', atlasTitle: 'A source-backed cultural atlas',
    aboutIntro: 'Indonesia Digital Heritage Atlas connects real-time 3D studies with claim-level evidence, regional context, and related heritage.', independentProject: 'Independent project',
    independentBody: 'This is an independent educational project. It does not claim affiliation with Indonesian government institutions or the publishers cited in the collection.',
    methodology3d: '3D methodology', methodology3dBody: 'Every scene is a procedural interpretive study. Verified dimensions are used when available; proportions and landscape details are disclosed as visual approximations rather than survey records.',
    researchMethodology: 'Research methodology', researchBody: 'Verified uses authoritative official evidence. Supported uses credible academic or institutional evidence. Disputed preserves material disagreement. Unverified marks insufficient evidence. Further reading remains separate until checked.',
    contribute: 'Contribute', contributeBody: 'Corrections, authoritative sources, landmark suggestions, and research leads are reviewed before publication.', suggestCorrection: 'Suggest a correction or source',
    credits: 'Credits', creditsBody: 'Development, interface design, procedural 3D, and research: Muzaki Abdullah Irsyad. Geographic boundary: Natural Earth, public domain. Historical facts remain credited to their listed source institutions.',
    collection: 'Collection', sourcesReading: 'Sources & reading', collectionSources: 'Collection sources', landmarkSections: 'Landmark sections', hideSources: 'Hide sources', showSources: 'Show sources',
    location: 'Location', type: 'Type', heritageStatus: 'Heritage status', exploreComponents: 'Explore components', interpretation3d: '3D interpretation', view3d: 'View in 3D',
    regionalContext: 'Regional context', connectedIntro: 'Trace this landmark through verified places, events, people, and cultural context.', place: 'Place', event: 'Event', person: 'Person', culturalContextGroup: 'Cultural context',
    nextLandmark: 'Next landmark', closePanel: 'Close panel', closeHotspot: 'Close hotspot detail', evidence: 'Evidence', published: 'Published', accessed: 'accessed', openExternalSource: 'Open external source',
    verifiedSources: 'Verified sources', supportedSources: 'Supported sources', disputedNotes: 'Disputed / notes', unverifiedSources: 'Unverified sources', openSource: 'Open source',
    furtherReading: 'Further reading', notYetChecked: 'Not yet checked', openPublication: 'Open publication', furtherReadingMethod: 'Further-reading entries remain discovery material and are not used as evidence until checked.',
    exploreStory: 'Explore story', viewIntroduction: 'View introduction', dragRotate: 'Drag to rotate · Scroll to zoom', dragPinch: 'Drag to rotate · Pinch to zoom',
    resetCamera: 'Reset camera view', showSourcesShort: 'Show sources', sourcesOn: 'Sources on', preparingMiniature: 'Preparing the miniature', landmark: 'Landmark',
    viewUnavailable: '3D view unavailable', viewUnavailableBody: 'Your browser could not start the WebGL scene. Try updating the browser or enabling hardware acceleration.', interactiveMiniature: 'Interactive 3D miniature of', focus: 'Focus',
    period: 'Period', originalFunction: 'Original function', currentFunction: 'Current function', dimensions: 'Dimensions', architecturalForm: 'Architectural form', materials: 'Materials', form: 'Form', structure: 'Structure', material: 'Material', function: 'Function', symbolism: 'Symbolism',
    inspection3d: '3D Inspection', inspectionMenu: '3D inspection menu', normalView: 'Explore', xray: 'X-Ray', sectionCut: 'Section Cut', blueprint: 'Blueprint',
    available: 'Available', limited: 'Limited', unavailable: 'Unavailable', sectionAxis: 'Section axis', position: 'Position', exteriorStudy: 'Exterior study',
    blueprintStudy: '3D Model Study', documentedBlueprint: 'Documented Drawing', modelStudyNotice: 'This visualization is derived from the interpretive 3D model and is not an original architectural drawing.',
    front: 'Front', side: 'Side', top: 'Top', archiveIntro: 'Traceable documentary material linked to this landmark and its evidence.',
    yearDate: 'Year / date', creator: 'Creator', institution: 'Institution', descriptionCaption: 'Description / caption', licenseRights: 'License / rights', verification: 'Verification', relatedClaims: 'Related claims',
    openOriginalSource: 'Open original source', externalReferenceOnly: 'External reference only', share: 'Share', copyLink: 'Copy link', linkCopied: 'Link copied', shareUnavailable: 'Unable to share this link',
  },
  id: {
    explore: 'Jelajahi', about: 'Tentang', sources: 'Sumber', support: 'Dukung', exploreIndonesia: 'Jelajahi Indonesia', interactiveHeritage: 'Warisan 3D\nInteraktif',
    landingSummary: 'Tiga landmark. Tiga cerita daerah. Satu pameran digital berbasis sumber.', language: 'Bahasa', primary: 'Navigasi utama',
    overview: 'Ikhtisar', history: 'Sejarah', architecture: 'Arsitektur', timeline: 'Linimasa', culturalContext: 'Konteks Budaya', connectedHeritage: 'Keterkaitan Warisan', archive: 'Arsip',
    exploreMode: 'Jelajahi', architectureMode: 'Arsitektur', historyMode: 'Sejarah', explorationMode: 'Mode penjelajahan 3D',
    view: 'Sudut Pandang', inspectionControls: 'Kontrol pemeriksaan 3D', labels: 'Label', resetView: 'Atur ulang', viewerToolbar: 'Bilah alat penampil 3D',
    help: 'Bantuan', zoomIn: 'Perbesar', zoomOut: 'Perkecil', fitView: 'Sesuaikan tampilan', fullscreen: 'Layar penuh', exitFullscreen: 'Keluar layar penuh',
    viewerHelp: 'Bantuan penampil', controlsShortcuts: 'Kontrol & pintasan', navigation: 'Navigasi', drag: 'Seret', orbitLandmark: 'Putar mengelilingi landmark',
    scrollPinch: 'Gulir / cubit', zoom: 'Perbesar atau perkecil', clickMarker: 'Klik penanda', selectFocus: 'Pilih dan fokuskan komponen', camera: 'Kamera', cameraView: 'tampilan',
    resetFit: 'Atur ulang / sesuaikan', exploration: 'Penjelajahan', componentLabels: 'Label komponen', openHelp: 'Buka bantuan ini', closePanelHotspot: 'Tutup panel atau hotspot',
    landmarkInformation: 'Informasi landmark', landmarkCollection: 'Koleksi landmark', exploreAtlas: 'Jelajahi atlas Indonesia', digitalHeritageAtlas: 'Atlas Warisan Digital', mapSearch: 'Peta & pencarian',
    compareLandmarks: 'Bandingkan landmark', atlasView: 'Tampilan atlas', searchCollection: 'Cari koleksi', searchPlaceholder: 'Landmark, provinsi, kota, periode…',
    province: 'Provinsi', allActiveProvinces: 'Semua provinsi aktif', indonesiaMap: 'Peta Indonesia dengan lokasi landmark aktif', naturalEarthBoundary: 'Batas Indonesia dari Natural Earth',
    openLandmark: 'Buka', mapUnavailable: 'Batas geografis tidak tersedia. Daftar koleksi terverifikasi tetap dapat diakses di bawah.',
    mapCredit: 'Batas wilayah: Natural Earth 1:110m, domain publik. Penanda memakai koordinat resmi cagar budaya.', verifiedLandmark: 'landmark terverifikasi', verifiedLandmarks: 'landmark terverifikasi',
    open3d: 'Buka 3D', noSearchResults: 'Tidak ada landmark terverifikasi dalam koleksi saat ini yang cocok dengan pencarian.', comparisonIntro: 'Perbandingan berbasis sumber. Nilai yang belum tersedia dibiarkan kosong dan bidang yang tidak tersedia untuk semua landmark disembunyikan.',
    field: 'Bidang', notEstablished: 'Belum ditetapkan', aboutCollection: 'Tentang koleksi ini', aboutProject: 'Tentang proyek', atlasTitle: 'Atlas budaya berbasis sumber',
    aboutIntro: 'Indonesia Digital Heritage Atlas menghubungkan studi 3D waktu nyata dengan bukti pada tingkat klaim, konteks daerah, dan warisan terkait.', independentProject: 'Proyek independen',
    independentBody: 'Ini adalah proyek edukasi independen. Proyek ini tidak menyatakan afiliasi dengan lembaga pemerintah Indonesia maupun penerbit yang dikutip dalam koleksi.',
    methodology3d: 'Metodologi 3D', methodology3dBody: 'Setiap adegan merupakan studi interpretatif prosedural. Dimensi terverifikasi digunakan ketika tersedia; proporsi dan detail lanskap dinyatakan sebagai perkiraan visual, bukan hasil survei.',
    researchMethodology: 'Metodologi riset', researchBody: 'Terverifikasi menggunakan bukti resmi yang berwenang. Didukung Sumber menggunakan bukti akademik atau kelembagaan yang kredibel. Diperdebatkan mempertahankan perbedaan antarsumber. Belum Terverifikasi menandai bukti yang belum memadai. Bacaan Lanjutan tetap dipisahkan hingga diperiksa.',
    contribute: 'Berkontribusi', contributeBody: 'Koreksi, sumber berwenang, usulan landmark, dan petunjuk riset ditinjau sebelum diterbitkan.', suggestCorrection: 'Usulkan koreksi atau sumber',
    credits: 'Kredit', creditsBody: 'Pengembangan, desain antarmuka, 3D prosedural, dan riset: Muzaki Abdullah Irsyad. Batas geografis: Natural Earth, domain publik. Fakta sejarah tetap dikreditkan kepada lembaga sumber yang tercantum.',
    collection: 'Koleksi', sourcesReading: 'Sumber & bacaan', collectionSources: 'Sumber koleksi', landmarkSections: 'Bagian informasi landmark', hideSources: 'Sembunyikan sumber', showSources: 'Tampilkan sumber',
    location: 'Lokasi', type: 'Jenis', heritageStatus: 'Status cagar budaya', exploreComponents: 'Jelajahi komponen', interpretation3d: 'Interpretasi 3D', view3d: 'Lihat dalam 3D',
    regionalContext: 'Konteks daerah', connectedIntro: 'Telusuri landmark ini melalui tempat, peristiwa, tokoh, dan konteks budaya yang terverifikasi.', place: 'Tempat', event: 'Peristiwa', person: 'Tokoh', culturalContextGroup: 'Konteks budaya',
    nextLandmark: 'Landmark berikutnya', closePanel: 'Tutup panel', closeHotspot: 'Tutup detail hotspot', evidence: 'Bukti', published: 'Diterbitkan', accessed: 'diakses', openExternalSource: 'Buka sumber eksternal',
    verifiedSources: 'Sumber Terverifikasi', supportedSources: 'Didukung Sumber', disputedNotes: 'Diperdebatkan / catatan', unverifiedSources: 'Sumber Belum Terverifikasi', openSource: 'Buka sumber',
    furtherReading: 'Bacaan Lanjutan', notYetChecked: 'Belum Diverifikasi', openPublication: 'Buka publikasi', furtherReadingMethod: 'Entri bacaan lanjutan tetap menjadi bahan penelusuran dan tidak digunakan sebagai bukti sebelum diperiksa.',
    exploreStory: 'Jelajahi cerita', viewIntroduction: 'Lihat pengantar', dragRotate: 'Seret untuk memutar · Gulir untuk memperbesar', dragPinch: 'Seret untuk memutar · Cubit untuk memperbesar',
    resetCamera: 'Atur ulang kamera', showSourcesShort: 'Tampilkan sumber', sourcesOn: 'Sumber aktif', preparingMiniature: 'Menyiapkan miniatur', landmark: 'Landmark',
    viewUnavailable: 'Tampilan 3D tidak tersedia', viewUnavailableBody: 'Peramban tidak dapat menjalankan adegan WebGL. Coba perbarui peramban atau aktifkan akselerasi perangkat keras.', interactiveMiniature: 'Miniatur 3D interaktif', focus: 'Fokuskan',
    period: 'Periode', originalFunction: 'Fungsi awal', currentFunction: 'Fungsi saat ini', dimensions: 'Dimensi', architecturalForm: 'Bentuk arsitektural', materials: 'Material', form: 'Bentuk', structure: 'Struktur', material: 'Material', function: 'Fungsi', symbolism: 'Simbolisme',
    inspection3d: 'Inspeksi 3D', inspectionMenu: 'Menu inspeksi 3D', normalView: 'Jelajahi', xray: 'X-Ray', sectionCut: 'Potongan', blueprint: 'Blueprint',
    available: 'Tersedia', limited: 'Terbatas', unavailable: 'Belum tersedia', sectionAxis: 'Sumbu potongan', position: 'Posisi', exteriorStudy: 'Studi bagian luar',
    blueprintStudy: 'Studi Model 3D', documentedBlueprint: 'Gambar Terdokumentasi', modelStudyNotice: 'Visualisasi ini berasal dari model 3D interpretatif dan bukan gambar arsitektur asli.',
    front: 'Depan', side: 'Samping', top: 'Atas', archiveIntro: 'Material dokumenter yang dapat ditelusuri dan terhubung dengan landmark serta buktinya.',
    yearDate: 'Tahun / tanggal', creator: 'Pembuat', institution: 'Institusi', descriptionCaption: 'Deskripsi / keterangan', licenseRights: 'Lisensi / hak', verification: 'Verifikasi', relatedClaims: 'Klaim terkait',
    openOriginalSource: 'Buka sumber asli', externalReferenceOnly: 'Referensi eksternal saja', share: 'Bagikan', copyLink: 'Salin tautan', linkCopied: 'Tautan disalin', shareUnavailable: 'Tautan tidak dapat dibagikan',
  },
} as const

export type MessageKey = keyof typeof messages.en

interface I18nValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function resolveLocale(search: string, stored: string | null, pathname = ''): Locale {
  const routeLocale = pathname.split('/').filter(Boolean)[0]
  if (routeLocale === 'en' || routeLocale === 'id') return routeLocale
  const query = new URLSearchParams(search).get('lang')
  return query === 'en' || query === 'id' ? query : stored === 'en' ? 'en' : 'id'
}

function initialLocale() {
  try { return resolveLocale(window.location.search, window.localStorage.getItem('heritage-locale'), window.location.pathname) }
  catch { return 'id' as const }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
    try { window.localStorage.setItem('heritage-locale', locale) } catch { /* preference remains session-only */ }
    const url = new URL(window.location.href)
    if (!/^\/(id|en)(\/|$)/.test(url.pathname)) {
      if (locale === 'en') url.searchParams.set('lang', 'en')
      else url.searchParams.delete('lang')
      window.history.replaceState(null, '', url)
    }
  }, [locale])

  return <I18nContext.Provider value={{ locale, setLocale, t: (key) => messages[locale][key] }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
