export type SourceStatus = 'verified' | 'further-reading'

export interface SourceRecord {
  id: string
  status: SourceStatus
  institution: string
  title: string
  published?: string
  category: string
  url: string
}

export interface SourcedText {
  text: string
  sourceIds: string[]
}

export interface TimelineEntry extends SourcedText {
  year: string
  title: string
}

export interface Fact {
  label: string
  value: string
  sourceIds: string[]
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
  overviewSourceIds: string[]
  history: SourcedText[]
  architecture: SourcedText[]
  culturalContext: SourcedText[]
  timeline: TimelineEntry[]
  facts: Fact[]
  sources: SourceRecord[]
  modelNote: string
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
  landmarkId: Landmark['id']
  status: 'further-reading'
  citation: string
  scope: string
  url: string
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
    citation: 'Sadana, A. S. (2021). The Urban Elements’ Visual Attractiveness of Tugu Pal Putih as Yogyakarta City Tourist Spot. International Journal of Glocal Tourism, 2(4), 223–240.',
    scope: 'Tugu Pal Putih — urban setting, visual identity, and visitor perception.',
    url: 'https://ejournal.sidyanusa.org/index.php/injogt/id/article/view/123',
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
  overviewSourceIds: [jakartaCultureSource.id, jakartaTourismSource.id],
  history: [
    { text: 'Monumen Nasional was built during the presidency of Soekarno. Construction began on 17 August 1961.', sourceIds: [jakartaCultureSource.id] },
    { text: 'The monument opened to the public on 12 July 1975. It was designed by architect R.M. Soedarsono based on President Soekarno’s vision.', sourceIds: [jakartaCultureSource.id] },
  ],
  architecture: [
    { text: 'The monument is an obelisk topped by a flame and reaches a total height of 132 metres. A square base contains the National History Museum, with the Independence Hall on the platform above.', sourceIds: [jakartaCultureSource.id] },
    { text: 'The Flame of Independence is recorded as 14 metres high and 6 metres in diameter. The official Jakarta source describes it as bronze covered with 32 kilograms of pure gold.', sourceIds: [jakartaCultureSource.id] },
  ],
  culturalContext: [
    { text: 'The monument stands at the centre of Merdeka Square and is managed by the Jakarta provincial government through the Monas Area Management Unit.', sourceIds: [jakartaCultureSource.id] },
  ],
  timeline: [
    { year: '1961', title: 'Construction begins', text: 'Work began on 17 August during the presidency of Soekarno.', sourceIds: [jakartaCultureSource.id] },
    { year: '1975', title: 'Opened to the public', text: 'Monumen Nasional officially opened on 12 July.', sourceIds: [jakartaCultureSource.id] },
  ],
  facts: [
    { label: 'Height', value: '132 m', sourceIds: [jakartaCultureSource.id] },
    { label: 'Flame height', value: '14 m', sourceIds: [jakartaCultureSource.id] },
    { label: 'Flame diameter', value: '6 m', sourceIds: [jakartaCultureSource.id] },
    { label: 'Architect', value: 'R.M. Soedarsono', sourceIds: [jakartaCultureSource.id] },
  ],
  sources: [jakartaCultureSource, jakartaTourismSource],
  modelNote: 'Procedural interpretive model. Verified overall dimensions are retained; surrounding landscape details are visual approximations.',
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
  overviewSourceIds: [jogjaCagarSource.id, unescoYogyakartaSource.id],
  history: [
    { text: 'The earlier Golong-Gilig monument was built by Sultan Hamengku Buwana I in 1756. The official heritage record describes a 25-metre, plastered-brick cylinder tapering upward to a sphere.', sourceIds: [jogjaCagarSource.id] },
    { text: 'That earlier monument was damaged by the earthquake of 10 June 1867. The replacement was rebuilt during the reign of Hamengku Buwana VII and inaugurated on 3 October 1889.', sourceIds: [jogjaCagarSource.id] },
  ],
  architecture: [
    { text: 'The current Pal Putih form differs from Golong-Gilig in shape, ornament, and scale. Its lower composition uses four stepped levels, with inscriptions placed on the four sides.', sourceIds: [jogjaCagarSource.id] },
    { text: 'A 2012 rehabilitation repaired cracked plaster, renewed exterior paint and gold-leaf finishes, and replaced the teak finial with the same material.', sourceIds: [jogjaRehabilitationSource.id] },
  ],
  culturalContext: [
    { text: 'Tugu is a key component of Yogyakarta’s six-kilometre cosmological axis, which links Mount Merapi and the Indian Ocean with the Kraton at its centre.', sourceIds: [unescoYogyakartaSource.id] },
  ],
  timeline: [
    { year: '1756', title: 'Golong-Gilig erected', text: 'Sultan Hamengku Buwana I established the earlier monument after the 1755 Giyanti agreement.', sourceIds: [jogjaCagarSource.id] },
    { year: '1867', title: 'Earthquake damage', text: 'The Golong-Gilig monument was damaged in the earthquake of 10 June.', sourceIds: [jogjaCagarSource.id] },
    { year: '1889', title: 'Pal Putih inaugurated', text: 'The replacement monument was inaugurated on 3 October.', sourceIds: [jogjaCagarSource.id] },
    { year: '2012', title: 'Conservation work', text: 'The provincial culture office rehabilitated plaster, finishes, the finial, and the protective garden.', sourceIds: [jogjaRehabilitationSource.id] },
  ],
  facts: [
    { label: 'Current form', value: '1889', sourceIds: [jogjaCagarSource.id] },
    { label: 'Earlier form', value: 'Golong-Gilig', sourceIds: [jogjaCagarSource.id] },
    { label: 'Heritage status', value: 'Provincial', sourceIds: [jogjaCagarSource.id] },
    { label: 'Axis role', value: 'Northern marker', sourceIds: [unescoYogyakartaSource.id] },
  ],
  sources: [jogjaCagarSource, jogjaRehabilitationSource, unescoYogyakartaSource],
  modelNote: 'Procedural visual study based on official heritage photography and descriptions. Current survey dimensions were not available in the checked registry, so proportions are interpretive.',
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
  overviewSourceIds: [bukittinggiGovernmentSource.id, bukittinggiProfileSource.id],
  history: [
    { text: 'The Bukittinggi tourism authority records that Jam Gadang was built in 1926 at a cost of about 3,000 guilders and names Yazid Sutan Maruhun and Rasid Sutan Gigi Ameh as its architects.', sourceIds: [bukittinggiTourismSource.id] },
    { text: 'The city government describes the tower as a colonial-period gift to Rook Maker, then secretary or controleur of Fort de Kock.', sourceIds: [bukittinggiGovernmentSource.id] },
  ],
  architecture: [
    { text: 'The municipal profile records a height of 26 metres. The tower’s current crown takes the form of the buffalo-horn roof associated with rumah gadang.', sourceIds: [bukittinggiProfileSource.id] },
    { text: 'The city government describes the tower as lime-built. The clock chamber is articulated above the main shaft and below the horn-shaped roof.', sourceIds: [bukittinggiGovernmentSource.id, bukittinggiProfileSource.id] },
  ],
  culturalContext: [
    { text: 'Bukittinggi’s government identifies Jam Gadang as an icon of both the city and West Sumatra and maintains the open plaza around it as a public destination.', sourceIds: [bukittinggiGovernmentSource.id] },
  ],
  timeline: [
    { year: '1926', title: 'Tower completed', text: 'The municipal tourism authority dates construction to 1926.', sourceIds: [bukittinggiTourismSource.id] },
    { year: '2024', title: 'Conservation reaffirmed', text: 'The city government publicly reaffirmed routine maintenance without changing the tower’s form.', sourceIds: [bukittinggiGovernmentSource.id] },
  ],
  facts: [
    { label: 'Height', value: '26 m', sourceIds: [bukittinggiGovernmentSource.id, bukittinggiProfileSource.id] },
    { label: 'Completed', value: '1926', sourceIds: [bukittinggiTourismSource.id, bukittinggiGovernmentSource.id] },
    { label: 'Architects', value: 'Yazid & Rasid', sourceIds: [bukittinggiTourismSource.id] },
    { label: 'Setting', value: 'City centre', sourceIds: [bukittinggiTourismSource.id] },
  ],
  sources: [bukittinggiTourismSource, bukittinggiGovernmentSource, bukittinggiProfileSource],
  modelNote: 'Procedural interpretive model using the verified 26-metre height and official visual references. Facade and plaza proportions are not an architectural survey.',
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
