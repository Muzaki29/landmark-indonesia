export type SourceStatus = 'verified' | 'further-reading'
export type VerificationStatus = 'VERIFIED' | 'SUPPORTED' | 'DISPUTED' | 'UNVERIFIED' | 'FURTHER_READING'
export type InspectionStatus = 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE'
export type ArchiveRightsStatus = 'PUBLIC_DOMAIN' | 'OPEN_LICENSE' | 'PERMISSION_GRANTED' | 'EXTERNAL_REFERENCE_ONLY' | 'RIGHTS_UNCLEAR'
export type ArchiveType = 'HISTORICAL_PHOTO' | 'CONSTRUCTION_PHOTO' | 'ARCHITECTURAL_DRAWING' | 'MAP' | 'DOCUMENT' | 'RESTORATION_DOCUMENTATION' | 'CURRENT_PHOTO' | 'OFFICIAL_ARCHIVE'
export type LocalizedText = { en: string; id: string }

export interface InspectionCapability {
  status: InspectionStatus
  description: LocalizedText
  evidenceIds: string[]
}

export interface InspectionCapabilities {
  xray: InspectionCapability
  sectionCut: InspectionCapability
  blueprint: InspectionCapability & { classification: 'DOCUMENTED' | 'MODEL_STUDY' | 'UNAVAILABLE' }
}

export interface ArchiveItem {
  id: string
  landmarkId: string
  type: ArchiveType
  title: LocalizedText
  year?: string
  date?: string
  creator?: string
  institution?: string
  sourceTitle: string
  sourceUrl: string
  license?: string
  rightsStatus: ArchiveRightsStatus
  caption: LocalizedText
  thumbnail?: string
  asset?: string
  claimIds?: string[]
  verificationStatus: Exclude<VerificationStatus, 'FURTHER_READING'>
  thenAndNowPairId?: string
}

export interface SourceRecord {
  id: string
  status: SourceStatus
  institution: string
  title: string
  published?: string
  category: string
  url: string
  sourceType?: string
  accessedAt?: string
  verificationStatus?: Exclude<VerificationStatus, 'FURTHER_READING'>
}

export interface SourcedText {
  id: string
  text: string
  sourceIds: string[]
  verificationStatus: Exclude<VerificationStatus, 'FURTHER_READING'>
}

export interface TimelineEntry extends SourcedText {
  year: string
  title: string
  sceneAction?: { hotspotId: string }
}

export interface Fact {
  id: string
  label: string
  value: string
  sourceIds: string[]
  verificationStatus: Exclude<VerificationStatus, 'FURTHER_READING'>
}

export interface Claim {
  id: string
  statement: string
  sourceIds: string[]
  verificationStatus: Exclude<VerificationStatus, 'FURTHER_READING'>
  notes?: string
  verifiedAt?: string
}

export interface Hotspot {
  id: string
  position: [number, number, number]
  targetCamera: { position: [number, number, number]; target: [number, number, number] }
  title: string
  category: 'FORM' | 'STRUCTURE' | 'MATERIAL' | 'FUNCTION' | 'SYMBOLISM'
  summary: string
  claimIds: string[]
}

export interface CameraView {
  id: '3d' | 'front' | 'side' | 'top' | 'eye-level'
  label: string
  position: [number, number, number]
  target: [number, number, number]
}

export interface HeritageRelation {
  id: string
  type: 'PLACE' | 'EVENT' | 'PERSON' | 'CULTURAL_CONTEXT'
  title: string
  summary: string
  claimIds: string[]
}

export interface ComparisonValue {
  value: string
  claimIds: string[]
}

export interface Landmark {
  id: string
  slug: 'monas' | 'tugu-pal-putih' | 'jam-gadang'
  provinceId: string
  name: string
  shortName: string
  alternativeNames: string[]
  location: string
  type: string
  shortDescription: string
  overviewClaimId: string
  overviewSourceIds: string[]
  history: SourcedText[]
  architecture: SourcedText[]
  culturalContext: SourcedText[]
  timeline: TimelineEntry[]
  facts: Fact[]
  sources: SourceRecord[]
  coordinates?: { latitude: number; longitude: number; claimId: string }
  cityRegency: string
  heritageStatus?: ComparisonValue
  hotspots: Hotspot[]
  cameraViews: CameraView[]
  relations: HeritageRelation[]
  comparison: Record<string, ComparisonValue | undefined>
  modelNote: string
  inspectionCapabilities: InspectionCapabilities
  archive: ArchiveItem[]
  historicalStates?: Array<{ period: string; title: string; description: string; media?: string; modelVariant?: string; evidence: string[] }>
  audioGuide?: { language: string; audioUrl: string; transcript: string; duration: number; credits: string; license: string }
  pronunciation?: { term: string; audioUrl: string; credits: string; license: string }
}

export interface Province {
  id: string
  code: string
  slug: string
  name: string
  shortName: string
  island: string
  introduction: string
  landmark: Landmark
}

export interface FurtherReading {
  id: string
  landmarkId?: Landmark['id']
  status: 'further-reading'
  citation: string
  scope: string
  url?: string
}

const jakartaCultureSource: SourceRecord = {
  id: 'jakarta-culture-museums-2026',
  status: 'verified',
  institution: 'Dinas Kebudayaan Provinsi DKI Jakarta',
  title: 'Data Museum di Provinsi DKI Jakarta — Monumen Nasional',
  published: '9 March 2026',
  category: 'Provincial government publication',
  url: 'https://www.jakarta.go.id/storage/files/shares/Landing%20Page/Jakarta%20Global%20City/CCI/21.%20Museum%202025%20-%20Disbud.pdf',
}

const jakartaTourismSource: SourceRecord = {
  id: 'jakarta-historic-tourism',
  status: 'verified',
  institution: 'Pemerintah Provinsi DKI Jakarta',
  title: 'Wisata Bersejarah — Monumen Nasional',
  category: 'Provincial government website',
  url: 'https://www.jakarta.go.id/wisata-bersejarah',
}

const nationalHeritageMonasSource: SourceRecord = {
  id: 'national-heritage-monas',
  status: 'verified',
  institution: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
  title: 'Cagar Budaya — Lapangan Merdeka dan Monumen Nasional',
  published: '29 March 1993',
  category: 'National cultural heritage registry',
  sourceType: 'Official heritage registry',
  accessedAt: '24 October 2026',
  verificationStatus: 'VERIFIED',
  url: 'https://budaya.data.kemdikbud.go.id/cagarbudaya/objek/KB000172',
}

const jogjaCagarSource: SourceRecord = {
  id: 'jogjacagar-tugu-pal-putih',
  status: 'verified',
  institution: 'Dinas Kebudayaan Daerah Istimewa Yogyakarta',
  title: 'JOGJACAGAR — Tugu Pal Putih',
  category: 'Provincial cultural heritage registry',
  url: 'https://jogjacagar.jogjaprov.go.id/detail/645/displayrecords-i-nama-warisan',
}

const jogjaRehabilitationSource: SourceRecord = {
  id: 'disbud-diy-rehabilitasi-tugu-2012',
  status: 'verified',
  institution: 'Dinas Kebudayaan Daerah Istimewa Yogyakarta',
  title: 'Rehabilitasi Tugu Pal Putih di Tahun 2012',
  published: '14 October 2020',
  category: 'Provincial cultural authority',
  url: 'https://budaya.jogjaprov.go.id/artikel/detail/Rehabilitasi-Tugu-Pal-Putih-di-Tahun-2012',
}

const unescoYogyakartaSource: SourceRecord = {
  id: 'unesco-yogyakarta-axis',
  status: 'verified',
  institution: 'UNESCO World Heritage Centre',
  title: 'The Cosmological Axis of Yogyakarta and its Historic Landmarks',
  published: '2023',
  category: 'World Heritage record',
  url: 'https://whc.unesco.org/en/list/1671',
}

const bukittinggiTourismSource: SourceRecord = {
  id: 'bukittinggi-tourism-jam-gadang',
  status: 'verified',
  institution: 'Dinas Pariwisata Kota Bukittinggi',
  title: 'Detail Wisata — Jam Gadang',
  category: 'Municipal tourism authority',
  url: 'https://visit.bukittinggikota.go.id/wisata/7/JAM%20GADANG',
}

const bukittinggiGovernmentSource: SourceRecord = {
  id: 'bukittinggi-government-jam-gadang',
  status: 'verified',
  institution: 'Pemerintah Kota Bukittinggi',
  title: 'Kagum dengan Jam Gadang, Pjs Wako Bukittinggi Minta Magnet Wisata Harus Dirawat dan Dijaga Keasriannya',
  published: '2 November 2024',
  category: 'Municipal government publication',
  url: 'https://bukittinggikota.go.id/news_detail/2113/Kagum',
}

const bukittinggiProfileSource: SourceRecord = {
  id: 'bukittinggi-profile-jam-gadang',
  status: 'verified',
  institution: 'Pemerintah Kota Bukittinggi',
  title: 'Profil Kota Bukittinggi — Jam Gadang',
  category: 'Municipal government website',
  url: 'https://www.bukittinggikota.go.id/index.php?class=text&file_id=97',
}

const nationalHeritageJamSource: SourceRecord = {
  id: 'national-heritage-jam-gadang',
  status: 'verified',
  institution: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
  title: 'Cagar Budaya — Jam Gadang',
  published: '8 January 2010',
  category: 'National cultural heritage registry',
  sourceType: 'Official heritage registry',
  accessedAt: '24 October 2026',
  verificationStatus: 'VERIFIED',
  url: 'https://budaya.data.kemdikbud.go.id/cagarbudaya/objek/KB000809',
}

const limitedInspection = (evidenceIds: string[]): InspectionCapabilities => ({
  xray: {
    status: 'LIMITED',
    description: {
      en: 'Exterior opacity can be reduced, but the interpretive model contains no verified internal construction to reveal.',
      id: 'Opasitas bagian luar dapat dikurangi, tetapi model interpretatif ini tidak memuat konstruksi internal terverifikasi untuk ditampilkan.',
    },
    evidenceIds,
  },
  sectionCut: {
    status: 'LIMITED',
    description: {
      en: 'The clipping plane studies modeled geometry only. It is not evidence of authentic internal construction.',
      id: 'Bidang potong hanya mempelajari geometri model. Tampilan ini bukan bukti konstruksi internal yang autentik.',
    },
    evidenceIds,
  },
  blueprint: {
    status: 'AVAILABLE',
    classification: 'MODEL_STUDY',
    description: {
      en: 'Orthographic views are derived from the interpretive 3D model, not an original architectural drawing.',
      id: 'Tampilan ortografis berasal dari model 3D interpretatif, bukan gambar arsitektur asli.',
    },
    evidenceIds,
  },
})

export const furtherReadings: FurtherReading[] = [
  {
    id: 'kurniawan-2019-tugu-nasional',
    landmarkId: 'landmark-monas',
    status: 'further-reading',
    citation: 'Kurniawan, H. (2019). The Architecture in Comparison with Tugu Nasional: Indonesian Pavilion in 1964 New York World’s Fair Part 2. AIJ Journal of Technology and Design, 25(60), 977–982.',
    scope: 'Monumen Nasional — architectural comparison and nation-building context.',
    url: 'https://www.jstage.jst.go.jp/article/aijt/25/60/25_977/_article/-char/en',
  },
  {
    id: 'sadana-2021-tugu-pal-putih',
    landmarkId: 'landmark-tugu',
    status: 'further-reading',
    citation: 'Sadana, A. S. (2021). The Urban Elements’ Visual Attractiveness of Tugu Pal Putih as Yogyakarta City Tourist Spot. International Journal of Glocal Tourism, 2(4), 223–232.',
    scope: 'Tugu Pal Putih — urban setting, visual identity, and visitor perception.',
    url: 'https://doi.org/10.58982/injogt.v2i4.123',
  },
  {
    id: 'khadavi-yulcherlina-2018-jam-gadang',
    landmarkId: 'landmark-jam-gadang',
    status: 'further-reading',
    citation: 'Khadavi, & Yulcherlina. (2018). The Construction and Structure Reliability of Jam Gadang: The Heritage of West Sumatera. Jurnal Rekayasa Konstruksi Mekanika Sipil, 1(1), 9–18.',
    scope: 'Jam Gadang — construction and structural reliability under earthquake loading.',
    url: 'https://media.neliti.com/media/publications/282720-the-construction-and-structure-reliabili-743df5d5.pdf',
  },
]

const monas: Landmark = {
  id: 'landmark-monas',
  slug: 'monas',
  provinceId: 'province-jakarta',
  name: 'Monumen Nasional',
  shortName: 'MONAS',
  alternativeNames: ['Monas', 'National Monument'],
  location: 'Central Jakarta, Indonesia',
  type: 'National Monument',
  shortDescription: 'An obelisk and public monument at the centre of Merdeka Square, crowned by the Flame of Independence.',
  overviewClaimId: 'monas-overview',
  overviewSourceIds: [jakartaCultureSource.id, jakartaTourismSource.id],
  history: [
    { id: 'monas-construction', text: 'Monumen Nasional was built during the presidency of Soekarno. Construction began on 17 August 1961.', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED' },
    { id: 'monas-opening', text: 'The monument opened to the public on 12 July 1975. It was designed by architect R.M. Soedarsono based on President Soekarno’s vision.', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED' },
  ],
  architecture: [
    { id: 'monas-structure', text: 'The monument is an obelisk topped by a flame and reaches a total height of 132 metres. A square base contains the National History Museum, with the Independence Hall on the platform above.', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED' },
    { id: 'monas-flame', text: 'The Flame of Independence is recorded as 14 metres high and 6 metres in diameter. The official Jakarta source describes it as bronze covered with 32 kilograms of pure gold.', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED' },
  ],
  culturalContext: [
    { id: 'monas-context', text: 'The monument stands at the centre of Merdeka Square and is managed by the Jakarta provincial government through the Monas Area Management Unit.', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED' },
  ],
  timeline: [
    { id: 'monas-timeline-1961', year: '1961', title: 'Construction begins', text: 'Work began on 17 August during the presidency of Soekarno.', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED', sceneAction: { hotspotId: 'monas-base' } },
    { id: 'monas-timeline-1975', year: '1975', title: 'Opened to the public', text: 'Monumen Nasional officially opened on 12 July.', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED', sceneAction: { hotspotId: 'monas-flame' } },
  ],
  facts: [
    { id: 'monas-height', label: 'Height', value: '132 m', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED' },
    { id: 'monas-flame-height', label: 'Flame height', value: '14 m', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED' },
    { id: 'monas-flame-diameter', label: 'Flame diameter', value: '6 m', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED' },
    { id: 'monas-architect', label: 'Architect', value: 'R.M. Soedarsono', sourceIds: [jakartaCultureSource.id], verificationStatus: 'VERIFIED' },
  ],
  sources: [jakartaCultureSource, jakartaTourismSource, nationalHeritageMonasSource],
  coordinates: { latitude: -6.175382, longitude: 106.827153, claimId: 'monas-location' },
  cityRegency: 'Jakarta Pusat',
  heritageStatus: { value: 'Cagar Budaya Provinsi', claimIds: ['monas-location'] },
  hotspots: [
    { id: 'monas-base', position: [0, 1.15, 2.8], targetCamera: { position: [8, 5.5, 10], target: [0, 1.2, 0] }, title: 'Museum base', category: 'FUNCTION', summary: 'The square base contains the National History Museum.', claimIds: ['monas-structure'] },
    { id: 'monas-shaft', position: [0, 6.8, 0.3], targetCamera: { position: [9, 9, 12], target: [0, 6.3, 0] }, title: 'Obelisk shaft', category: 'FORM', summary: 'The vertical obelisk forms the monument’s principal mass.', claimIds: ['monas-structure'] },
    { id: 'monas-flame', position: [0, 12.65, 0], targetCamera: { position: [7, 13.5, 9], target: [0, 12.1, 0] }, title: 'Flame of Independence', category: 'SYMBOLISM', summary: 'A bronze flame, recorded as 14 metres high and gold-covered.', claimIds: ['monas-flame'] },
  ],
  cameraViews: [
    { id: '3d', label: '3D', position: [18.5, 13.5, 22], target: [-1.5, 5.1, 0] },
    { id: 'front', label: 'Front', position: [0, 8.6, 24], target: [0, 5.2, 0] },
    { id: 'side', label: 'Side', position: [24, 8.6, 0], target: [0, 5.2, 0] },
    { id: 'eye-level', label: 'Eye level', position: [15, 4.2, 18], target: [0, 3.4, 0] },
  ],
  relations: [
    { id: 'monas-place-merdeka', type: 'PLACE', title: 'Lapangan Merdeka', summary: 'The monument stands at the centre of this civic square.', claimIds: ['monas-context'] },
    { id: 'monas-person-soekarno', type: 'PERSON', title: 'Soekarno', summary: 'The project began during his presidency and followed his vision.', claimIds: ['monas-construction', 'monas-opening'] },
    { id: 'monas-person-soedarsono', type: 'PERSON', title: 'R.M. Soedarsono', summary: 'Architect named in the official Jakarta record.', claimIds: ['monas-opening'] },
  ],
  comparison: {
    period: { value: '1961–1975', claimIds: ['monas-construction', 'monas-opening'] },
    originalFunction: { value: 'National monument and history museum', claimIds: ['monas-structure'] },
    currentFunction: { value: 'Monument, museum, and civic destination', claimIds: ['monas-context'] },
    dimensions: { value: '132 m high', claimIds: ['monas-height'] },
    architecturalForm: { value: 'Obelisk with flame', claimIds: ['monas-structure'] },
  },
  modelNote: 'Procedural interpretive model. Verified overall dimensions are retained; surrounding landscape details are visual approximations.',
  inspectionCapabilities: limitedInspection(['monas-structure', 'monas-height']),
  archive: [{
    id: 'monas-official-documentation', landmarkId: 'landmark-monas', type: 'OFFICIAL_ARCHIVE',
    title: { en: 'Official Monumen Nasional documentation', id: 'Dokumentasi resmi Monumen Nasional' },
    institution: jakartaCultureSource.institution, sourceTitle: jakartaCultureSource.title, sourceUrl: jakartaCultureSource.url,
    rightsStatus: 'EXTERNAL_REFERENCE_ONLY', verificationStatus: 'VERIFIED', claimIds: ['monas-structure', 'monas-height'],
    caption: { en: 'Official museum documentation retained as an external reference because reuse rights were not established.', id: 'Dokumentasi museum resmi disimpan sebagai referensi eksternal karena hak penggunaan ulang belum ditetapkan.' },
  }],
}

const tuguPalPutih: Landmark = {
  id: 'landmark-tugu',
  slug: 'tugu-pal-putih',
  provinceId: 'province-yogyakarta',
  name: 'Tugu Pal Putih',
  shortName: 'TUGU JOGJA',
  alternativeNames: ['Tugu Yogyakarta', 'De Witte Paal', 'Tugu Golong Gilig'],
  location: 'Yogyakarta, Indonesia',
  type: 'Provincial Cultural Heritage Structure',
  shortDescription: 'A white monument at Yogyakarta’s northern historic axis, built in its present form after the earlier Golong-Gilig monument was damaged by an earthquake.',
  overviewClaimId: 'tugu-overview',
  overviewSourceIds: [jogjaCagarSource.id, unescoYogyakartaSource.id],
  history: [
    { id: 'tugu-origin', text: 'The earlier Golong-Gilig monument was built by Sultan Hamengku Buwana I in 1756. The official heritage record describes a 25-metre, plastered-brick cylinder tapering upward to a sphere.', sourceIds: [jogjaCagarSource.id], verificationStatus: 'VERIFIED' },
    { id: 'tugu-rebuild', text: 'That earlier monument was damaged by the earthquake of 10 June 1867. The replacement was rebuilt during the reign of Hamengku Buwana VII and inaugurated on 3 October 1889.', sourceIds: [jogjaCagarSource.id], verificationStatus: 'VERIFIED' },
  ],
  architecture: [
    { id: 'tugu-form', text: 'The current Pal Putih form differs from Golong-Gilig in shape, ornament, and scale. Its lower composition uses four stepped levels, with inscriptions placed on the four sides.', sourceIds: [jogjaCagarSource.id], verificationStatus: 'VERIFIED' },
    { id: 'tugu-conservation', text: 'A 2012 rehabilitation repaired cracked plaster, renewed exterior paint and gold-leaf finishes, and replaced the teak finial with the same material.', sourceIds: [jogjaRehabilitationSource.id], verificationStatus: 'VERIFIED' },
  ],
  culturalContext: [
    { id: 'tugu-axis', text: 'Tugu is a key component of Yogyakarta’s six-kilometre cosmological axis, which links Mount Merapi and the Indian Ocean with the Kraton at its centre.', sourceIds: [unescoYogyakartaSource.id], verificationStatus: 'VERIFIED' },
  ],
  timeline: [
    { id: 'tugu-timeline-1756', year: '1756', title: 'Golong-Gilig erected', text: 'Sultan Hamengku Buwana I established the earlier monument after the 1755 Giyanti agreement.', sourceIds: [jogjaCagarSource.id], verificationStatus: 'VERIFIED' },
    { id: 'tugu-timeline-1867', year: '1867', title: 'Earthquake damage', text: 'The Golong-Gilig monument was damaged in the earthquake of 10 June.', sourceIds: [jogjaCagarSource.id], verificationStatus: 'VERIFIED' },
    { id: 'tugu-timeline-1889', year: '1889', title: 'Pal Putih inaugurated', text: 'The replacement monument was inaugurated on 3 October.', sourceIds: [jogjaCagarSource.id], verificationStatus: 'VERIFIED', sceneAction: { hotspotId: 'tugu-shaft' } },
    { id: 'tugu-timeline-2012', year: '2012', title: 'Conservation work', text: 'The provincial culture office rehabilitated plaster, finishes, the finial, and the protective garden.', sourceIds: [jogjaRehabilitationSource.id], verificationStatus: 'VERIFIED', sceneAction: { hotspotId: 'tugu-finial' } },
  ],
  facts: [
    { id: 'tugu-current-form', label: 'Current form', value: '1889', sourceIds: [jogjaCagarSource.id], verificationStatus: 'VERIFIED' },
    { id: 'tugu-earlier-form', label: 'Earlier form', value: 'Golong-Gilig', sourceIds: [jogjaCagarSource.id], verificationStatus: 'VERIFIED' },
    { id: 'tugu-heritage-status', label: 'Heritage status', value: 'Provincial', sourceIds: [jogjaCagarSource.id], verificationStatus: 'VERIFIED' },
    { id: 'tugu-axis-role', label: 'Axis role', value: 'Northern marker', sourceIds: [unescoYogyakartaSource.id], verificationStatus: 'VERIFIED' },
  ],
  sources: [jogjaCagarSource, jogjaRehabilitationSource, unescoYogyakartaSource],
  coordinates: { latitude: -7.78267, longitude: 110.36708, claimId: 'tugu-location' },
  cityRegency: 'Kota Yogyakarta',
  heritageStatus: { value: 'Cagar Budaya Provinsi', claimIds: ['tugu-heritage-status'] },
  hotspots: [
    { id: 'tugu-base', position: [0, 1.55, 1.15], targetCamera: { position: [7, 4.2, 9], target: [0, 1.6, 0] }, title: 'Inscribed base', category: 'FORM', summary: 'Four stepped levels support inscriptions on all four sides.', claimIds: ['tugu-form'] },
    { id: 'tugu-shaft', position: [0, 5.8, 0.5], targetCamera: { position: [7, 7.2, 10], target: [0, 5.5, 0] }, title: 'Pal Putih shaft', category: 'STRUCTURE', summary: 'The present form differs from the earlier cylindrical Golong-Gilig.', claimIds: ['tugu-form', 'tugu-rebuild'] },
    { id: 'tugu-finial', position: [0, 9.8, 0], targetCamera: { position: [6, 10.5, 8], target: [0, 9.4, 0] }, title: 'Upper finial', category: 'MATERIAL', summary: 'The teak finial was replaced in matching material during the 2012 rehabilitation.', claimIds: ['tugu-conservation'] },
  ],
  cameraViews: [
    { id: '3d', label: '3D', position: [17.5, 12.5, 21], target: [-1.35, 4.8, 0] },
    { id: 'front', label: 'Front', position: [0, 6.4, 22], target: [0, 4.8, 0] },
    { id: 'side', label: 'Side', position: [22, 6.4, 0], target: [0, 4.8, 0] },
    { id: 'eye-level', label: 'Eye level', position: [15, 3.7, 18], target: [0, 3.2, 0] },
  ],
  relations: [
    { id: 'tugu-place-kraton', type: 'PLACE', title: 'Kraton Yogyakarta', summary: 'The Kraton is the central element in the cosmological axis.', claimIds: ['tugu-axis'] },
    { id: 'tugu-event-earthquake', type: 'EVENT', title: 'Yogyakarta earthquake of 1867', summary: 'The disaster damaged Golong-Gilig and preceded the present form.', claimIds: ['tugu-rebuild'] },
    { id: 'tugu-person-hb1', type: 'PERSON', title: 'Sultan Hamengku Buwana I', summary: 'Founder associated with the earlier Golong-Gilig monument.', claimIds: ['tugu-origin'] },
    { id: 'tugu-context-axis', type: 'CULTURAL_CONTEXT', title: 'Cosmological Axis of Yogyakarta', summary: 'A UNESCO-listed cultural landscape expressing Javanese cosmological concepts.', claimIds: ['tugu-axis'] },
  ],
  comparison: {
    period: { value: '1756 origin; present form 1889', claimIds: ['tugu-origin', 'tugu-rebuild'] },
    originalFunction: { value: 'Royal sightline and axis marker', claimIds: ['tugu-origin', 'tugu-axis'] },
    currentFunction: { value: 'Historic axis marker and city landmark', claimIds: ['tugu-overview', 'tugu-axis'] },
    dimensions: { value: 'Earlier Golong-Gilig recorded at 25 m', claimIds: ['tugu-origin'] },
    architecturalForm: { value: 'Four-stepped base, inscribed shaft, finial', claimIds: ['tugu-form'] },
    heritageStatus: { value: 'Provincial cultural heritage', claimIds: ['tugu-heritage-status'] },
  },
  modelNote: 'Procedural visual study based on official heritage photography and descriptions. Current survey dimensions were not available in the checked registry, so proportions are interpretive.',
  inspectionCapabilities: limitedInspection(['tugu-form', 'tugu-conservation']),
  archive: [{
    id: 'tugu-restoration-documentation', landmarkId: 'landmark-tugu', type: 'RESTORATION_DOCUMENTATION', year: '2012',
    title: { en: '2012 rehabilitation documentation', id: 'Dokumentasi rehabilitasi 2012' },
    institution: jogjaRehabilitationSource.institution, sourceTitle: jogjaRehabilitationSource.title, sourceUrl: jogjaRehabilitationSource.url,
    rightsStatus: 'EXTERNAL_REFERENCE_ONLY', verificationStatus: 'VERIFIED', claimIds: ['tugu-conservation'],
    caption: { en: 'The provincial culture office documents repair of plaster, finishes, the teak finial, and the protective garden.', id: 'Dinas kebudayaan provinsi mendokumentasikan perbaikan plester, lapisan akhir, mustaka kayu jati, dan taman pelindung.' },
  }],
}

const jamGadang: Landmark = {
  id: 'landmark-jam-gadang',
  slug: 'jam-gadang',
  provinceId: 'province-sumatera-barat',
  name: 'Jam Gadang',
  shortName: 'JAM GADANG',
  alternativeNames: [],
  location: 'Bukittinggi, Indonesia',
  type: 'Civic Clock Tower',
  shortDescription: 'A 26-metre civic clock tower in central Bukittinggi, recognized by its present horn-shaped Minangkabau roof.',
  overviewClaimId: 'jam-overview',
  overviewSourceIds: [bukittinggiGovernmentSource.id, bukittinggiProfileSource.id],
  history: [
    { id: 'jam-construction', text: 'The Bukittinggi tourism authority records that Jam Gadang was built in 1926 at a cost of about 3,000 guilders and names Yazid Sutan Maruhun and Rasid Sutan Gigi Ameh as its architects.', sourceIds: [bukittinggiTourismSource.id], verificationStatus: 'VERIFIED' },
    { id: 'jam-colonial-context', text: 'The city government describes the tower as a colonial-period gift to Rook Maker, then secretary or controleur of Fort de Kock.', sourceIds: [bukittinggiGovernmentSource.id], verificationStatus: 'VERIFIED' },
  ],
  architecture: [
    { id: 'jam-form', text: 'The municipal profile records a height of 26 metres. The tower’s current crown takes the form of the buffalo-horn roof associated with rumah gadang.', sourceIds: [bukittinggiProfileSource.id], verificationStatus: 'VERIFIED' },
    { id: 'jam-material', text: 'The city government describes the tower as lime-built. The clock chamber is articulated above the main shaft and below the horn-shaped roof.', sourceIds: [bukittinggiGovernmentSource.id, bukittinggiProfileSource.id], verificationStatus: 'VERIFIED' },
  ],
  culturalContext: [
    { id: 'jam-city-context', text: 'Bukittinggi’s government identifies Jam Gadang as an icon of both the city and West Sumatra and maintains the open plaza around it as a public destination.', sourceIds: [bukittinggiGovernmentSource.id], verificationStatus: 'VERIFIED' },
  ],
  timeline: [
    { id: 'jam-timeline-1926', year: '1926', title: 'Tower completed', text: 'The municipal tourism authority dates construction to 1926.', sourceIds: [bukittinggiTourismSource.id], verificationStatus: 'VERIFIED', sceneAction: { hotspotId: 'jam-body' } },
    { id: 'jam-timeline-2024', year: '2024', title: 'Conservation reaffirmed', text: 'The city government publicly reaffirmed routine maintenance without changing the tower’s form.', sourceIds: [bukittinggiGovernmentSource.id], verificationStatus: 'VERIFIED' },
  ],
  facts: [
    { id: 'jam-height', label: 'Height', value: '26 m', sourceIds: [bukittinggiGovernmentSource.id, bukittinggiProfileSource.id], verificationStatus: 'VERIFIED' },
    { id: 'jam-completed', label: 'Completed', value: '1926', sourceIds: [bukittinggiTourismSource.id, bukittinggiGovernmentSource.id], verificationStatus: 'VERIFIED' },
    { id: 'jam-architects', label: 'Architects', value: 'Yazid & Rasid', sourceIds: [bukittinggiTourismSource.id], verificationStatus: 'VERIFIED' },
    { id: 'jam-setting', label: 'Setting', value: 'City centre', sourceIds: [bukittinggiTourismSource.id], verificationStatus: 'VERIFIED' },
  ],
  sources: [bukittinggiTourismSource, bukittinggiGovernmentSource, bukittinggiProfileSource, nationalHeritageJamSource],
  coordinates: { latitude: -0.305095, longitude: 100.369518, claimId: 'jam-location' },
  cityRegency: 'Kota Bukittinggi',
  heritageStatus: { value: 'Cagar Budaya Nasional', claimIds: ['jam-location'] },
  hotspots: [
    { id: 'jam-body', position: [0, 3.4, 1.9], targetCamera: { position: [8, 5.5, 10], target: [0, 3.5, 0] }, title: 'Tower body', category: 'MATERIAL', summary: 'The city government describes the tower as lime-built.', claimIds: ['jam-material'] },
    { id: 'jam-clock', position: [0, 7.25, 1.95], targetCamera: { position: [7, 8.5, 9], target: [0, 7.2, 0] }, title: 'Clock chamber', category: 'FUNCTION', summary: 'Clock faces articulate the chamber above the principal shaft.', claimIds: ['jam-overview'] },
    { id: 'jam-roof', position: [0, 9.45, 0.8], targetCamera: { position: [7, 10.2, 8], target: [0, 9.1, 0] }, title: 'Horn-shaped roof', category: 'FORM', summary: 'The present crown takes the form associated with rumah gadang.', claimIds: ['jam-form'] },
  ],
  cameraViews: [
    { id: '3d', label: '3D', position: [18.5, 13.2, 22], target: [-1.45, 4.7, 0] },
    { id: 'front', label: 'Front', position: [0, 6.6, 23], target: [0, 4.8, 0] },
    { id: 'side', label: 'Side', position: [23, 6.6, 0], target: [0, 4.8, 0] },
    { id: 'eye-level', label: 'Eye level', position: [15, 4, 18], target: [0, 3.5, 0] },
  ],
  relations: [
    { id: 'jam-place-bukittinggi', type: 'PLACE', title: 'Bukittinggi city centre', summary: 'The tower and surrounding plaza form a public civic destination.', claimIds: ['jam-city-context'] },
    { id: 'jam-person-builders', type: 'PERSON', title: 'Yazid Sutan Maruhun & Rasid Sutan Gigi Ameh', summary: 'The municipal tourism authority names these Minangkabau architects.', claimIds: ['jam-construction'] },
    { id: 'jam-context-rumah-gadang', type: 'CULTURAL_CONTEXT', title: 'Minangkabau roof form', summary: 'The present crown adopts the horn-shaped form associated with rumah gadang.', claimIds: ['jam-form'] },
  ],
  comparison: {
    period: { value: 'Completed 1926', claimIds: ['jam-construction'] },
    originalFunction: { value: 'Civic clock tower', claimIds: ['jam-construction', 'jam-colonial-context'] },
    currentFunction: { value: 'City landmark and public destination', claimIds: ['jam-city-context'] },
    dimensions: { value: 'Approximately 26 m high', claimIds: ['jam-height'] },
    architecturalForm: { value: 'Clock tower with Minangkabau horn-shaped roof', claimIds: ['jam-form'] },
    materials: { value: 'Lime material', claimIds: ['jam-material'] },
  },
  modelNote: 'Procedural interpretive model using the verified 26-metre height and official visual references. Facade and plaza proportions are not an architectural survey.',
  inspectionCapabilities: limitedInspection(['jam-form', 'jam-material', 'jam-height']),
  archive: [{
    id: 'jam-official-heritage-record', landmarkId: 'landmark-jam-gadang', type: 'OFFICIAL_ARCHIVE',
    title: { en: 'Official Jam Gadang heritage record', id: 'Catatan resmi cagar budaya Jam Gadang' },
    institution: nationalHeritageJamSource.institution, sourceTitle: nationalHeritageJamSource.title, sourceUrl: nationalHeritageJamSource.url,
    rightsStatus: 'EXTERNAL_REFERENCE_ONLY', verificationStatus: 'VERIFIED', claimIds: ['jam-location', 'jam-form'],
    caption: { en: 'The national heritage registry record is linked as external documentation; media reuse rights were not established.', id: 'Catatan registri cagar budaya nasional ditautkan sebagai dokumentasi eksternal; hak penggunaan ulang media belum ditetapkan.' },
  }],
}

export const provinces: Province[] = [
  {
    id: 'province-jakarta', code: '01', slug: 'dki-jakarta', name: 'DKI Jakarta', shortName: 'Jakarta', island: 'Java',
    introduction: 'A monumental landscape centred on Indonesia’s national monument.', landmark: monas,
  },
  {
    id: 'province-yogyakarta', code: '02', slug: 'di-yogyakarta', name: 'Daerah Istimewa Yogyakarta', shortName: 'Yogyakarta', island: 'Java',
    introduction: 'An urban heritage marker on Yogyakarta’s cosmological axis.', landmark: tuguPalPutih,
  },
  {
    id: 'province-sumatera-barat', code: '03', slug: 'sumatera-barat', name: 'Sumatera Barat', shortName: 'Sumatera Barat', island: 'Sumatra',
    introduction: 'A civic clock tower at the centre of Bukittinggi.', landmark: jamGadang,
  },
]

export function getProvince(id: string) {
  return provinces.find((province) => province.id === id) ?? provinces[0]
}

let indonesianProvinces: Province[] | undefined

export function getProvinces(locale: Locale) {
  if (locale === 'en') return provinces
  if (indonesianProvinces) return indonesianProvinces
  indonesianProvinces = provinces.map((province) => {
    const copy = indonesianLandmarkCopy[province.landmark.slug]
    const item = (id: string) => copy.items[id] ?? {}
    const landmark: Landmark = {
      ...province.landmark,
      location: copy.location,
      type: copy.type,
      shortDescription: copy.shortDescription,
      modelNote: copy.modelNote,
      history: province.landmark.history.map((entry) => ({ ...entry, text: item(entry.id).text ?? entry.text })),
      architecture: province.landmark.architecture.map((entry) => ({ ...entry, text: item(entry.id).text ?? entry.text })),
      culturalContext: province.landmark.culturalContext.map((entry) => ({ ...entry, text: item(entry.id).text ?? entry.text })),
      timeline: province.landmark.timeline.map((entry) => ({ ...entry, title: item(entry.id).title ?? entry.title, text: item(entry.id).text ?? entry.text })),
      facts: province.landmark.facts.map((entry) => ({ ...entry, label: item(entry.id).label ?? entry.label, value: item(entry.id).value ?? entry.value })),
      heritageStatus: province.landmark.heritageStatus && { ...province.landmark.heritageStatus, value: copy.heritageStatus ?? province.landmark.heritageStatus.value },
      hotspots: province.landmark.hotspots.map((entry) => ({ ...entry, title: item(entry.id).title ?? entry.title, summary: item(entry.id).summary ?? entry.summary })),
      relations: province.landmark.relations.map((entry) => ({ ...entry, title: item(entry.id).title ?? entry.title, summary: item(entry.id).summary ?? entry.summary })),
      comparison: Object.fromEntries(Object.entries(province.landmark.comparison).map(([key, value]) => [key, value && { ...value, value: copy.comparison[key] ?? value.value }])),
      cameraViews: province.landmark.cameraViews.map((view) => ({ ...view, label: view.id === 'front' ? 'Depan' : view.id === 'side' ? 'Samping' : view.id === 'eye-level' ? 'Setinggi mata' : view.label })),
    }
    const provinceCopy = indonesianProvinceCopy[province.id]
    return { ...province, ...provinceCopy, landmark }
  })
  return indonesianProvinces
}

export function getLocalizedProvince(id: string, locale: Locale) {
  const collection = getProvinces(locale)
  return collection.find((province) => province.id === id) ?? collection[0]
}

export function getClaims(landmark: Landmark): Claim[] {
  const locationSourceId = landmark.slug === 'monas'
    ? nationalHeritageMonasSource.id
    : landmark.slug === 'tugu-pal-putih'
      ? jogjaCagarSource.id
      : nationalHeritageJamSource.id
  return [
    { id: landmark.overviewClaimId, statement: landmark.shortDescription, sourceIds: landmark.overviewSourceIds, verificationStatus: 'VERIFIED', verifiedAt: '2026-10-24' },
    ...(landmark.coordinates ? [{ id: landmark.coordinates.claimId, statement: `${landmark.name} is located at ${landmark.coordinates.latitude}, ${landmark.coordinates.longitude}.`, sourceIds: [locationSourceId], verificationStatus: 'VERIFIED' as const, verifiedAt: '2026-10-24' }] : []),
    ...landmark.history.map(({ id, text: statement, sourceIds, verificationStatus }) => ({ id, statement, sourceIds, verificationStatus, verifiedAt: '2026-10-24' })),
    ...landmark.architecture.map(({ id, text: statement, sourceIds, verificationStatus }) => ({ id, statement, sourceIds, verificationStatus, verifiedAt: '2026-10-24' })),
    ...landmark.culturalContext.map(({ id, text: statement, sourceIds, verificationStatus }) => ({ id, statement, sourceIds, verificationStatus, verifiedAt: '2026-10-24' })),
    ...landmark.timeline.map(({ id, text: statement, sourceIds, verificationStatus }) => ({ id, statement, sourceIds, verificationStatus, verifiedAt: '2026-10-24' })),
    ...landmark.facts.map(({ id, label, value, sourceIds, verificationStatus }) => ({ id, statement: `${label}: ${value}`, sourceIds, verificationStatus, verifiedAt: '2026-10-24' })),
  ]
}

export function getSourcesForClaims(landmark: Landmark, claimIds: string[]) {
  const wantedClaims = new Set(claimIds)
  const sourceIds = new Set(getClaims(landmark).filter(({ id }) => wantedClaims.has(id)).flatMap(({ sourceIds }) => sourceIds))
  return landmark.sources.filter(({ id }) => sourceIds.has(id))
}

export function canDisplayArchiveAsset(item: ArchiveItem) {
  return Boolean(item.asset && ['PUBLIC_DOMAIN', 'OPEN_LICENSE', 'PERMISSION_GRANTED'].includes(item.rightsStatus))
}

export function searchLandmarks(query: string, collection = provinces) {
  const normalized = query.trim().toLocaleLowerCase('id-ID')
  if (!normalized) return collection
  return collection.filter(({ name, island, landmark }) => [
    name,
    island,
    landmark.name,
    landmark.shortName,
    landmark.cityRegency,
    landmark.type,
    ...landmark.alternativeNames,
    ...Object.values(landmark.comparison).flatMap((item) => item?.value ?? []),
    ...landmark.relations.map(({ title }) => title),
  ].some((value) => value.toLocaleLowerCase('id-ID').includes(normalized)))
}

export const comparisonLabels: Record<string, string> = {
  period: 'Period',
  originalFunction: 'Original function',
  currentFunction: 'Current function',
  dimensions: 'Dimensions',
  architecturalForm: 'Architectural form',
  materials: 'Materials',
  heritageStatus: 'Heritage status',
}
import { indonesianLandmarkCopy, indonesianProvinceCopy, indonesianReadingScopes } from './heritage.id'
import type { Locale } from '../i18n'


export function getComparisonLabels(locale: Locale) {
  if (locale === 'en') return comparisonLabels
  return {
    period: 'Periode',
    originalFunction: 'Fungsi awal',
    currentFunction: 'Fungsi saat ini',
    dimensions: 'Dimensi',
    architecturalForm: 'Bentuk arsitektural',
    materials: 'Material',
    heritageStatus: 'Status cagar budaya',
  }
}

export function getFurtherReadings(locale: Locale) {
  if (locale === 'en') return furtherReadings
  return furtherReadings.map((reading) => ({ ...reading, scope: indonesianReadingScopes[reading.id] ?? reading.scope }))
}
