import type { Landmark } from './heritage'

type ItemCopy = { text?: string; title?: string; label?: string; value?: string; summary?: string }

export interface IndonesianLandmarkCopy {
  location: string
  type: string
  shortDescription: string
  modelNote: string
  heritageStatus?: string
  items: Record<string, ItemCopy>
  comparison: Record<string, string>
}

export const indonesianLandmarkCopy: Record<Landmark['slug'], IndonesianLandmarkCopy> = {
  monas: {
    location: 'Jakarta Pusat, Indonesia',
    type: 'Monumen Nasional',
    shortDescription: 'Sebuah obelisk dan monumen publik di pusat Lapangan Merdeka, dimahkotai Lidah Api Kemerdekaan.',
    modelNote: 'Model interpretatif prosedural. Dimensi keseluruhan yang terverifikasi dipertahankan; detail lanskap di sekitarnya merupakan perkiraan visual.',
    heritageStatus: 'Cagar Budaya Provinsi',
    items: {
      'monas-construction': { text: 'Monumen Nasional dibangun pada masa kepresidenan Soekarno. Pembangunannya dimulai pada 17 Agustus 1961.' },
      'monas-opening': { text: 'Monumen ini dibuka untuk umum pada 12 Juli 1975. Monas dirancang oleh arsitek R.M. Soedarsono berdasarkan gagasan Presiden Soekarno.' },
      'monas-structure': { text: 'Monumen ini berupa obelisk yang dimahkotai lidah api dan mencapai tinggi keseluruhan 132 meter. Dasar berbentuk persegi memuat Museum Sejarah Nasional, dengan Ruang Kemerdekaan pada pelataran di atasnya.' },
      'monas-context': { text: 'Monumen ini berdiri di pusat Lapangan Merdeka dan dikelola Pemerintah Provinsi DKI Jakarta melalui Unit Pengelola Kawasan Monas.' },
      'monas-timeline-1961': { title: 'Pembangunan dimulai', text: 'Pekerjaan dimulai pada 17 Agustus pada masa kepresidenan Soekarno.' },
      'monas-timeline-1975': { title: 'Dibuka untuk umum', text: 'Monumen Nasional resmi dibuka pada 12 Juli.' },
      'monas-height': { label: 'Tinggi', value: '132 m' },
      'monas-flame-height': { label: 'Tinggi lidah api', value: '14 m' },
      'monas-flame-diameter': { label: 'Diameter lidah api', value: '6 m' },
      'monas-architect': { label: 'Arsitek', value: 'R.M. Soedarsono' },
      'monas-base': { title: 'Dasar museum', summary: 'Dasar berbentuk persegi memuat Museum Sejarah Nasional.' },
      'monas-shaft': { title: 'Batang obelisk', summary: 'Obelisk vertikal membentuk massa utama monumen.' },
      'monas-flame': { text: 'Lidah Api Kemerdekaan tercatat setinggi 14 meter dan berdiameter 6 meter. Sumber resmi Jakarta menyebutnya terbuat dari perunggu yang dilapisi 32 kilogram emas murni.', title: 'Lidah Api Kemerdekaan', summary: 'Lidah api perunggu, tercatat setinggi 14 meter dan dilapisi emas.' },
      'monas-place-merdeka': { title: 'Lapangan Merdeka', summary: 'Monumen berdiri di pusat ruang sipil ini.' },
      'monas-person-soekarno': { title: 'Soekarno', summary: 'Proyek dimulai pada masa kepresidenannya dan mengikuti gagasannya.' },
      'monas-person-soedarsono': { title: 'R.M. Soedarsono', summary: 'Arsitek yang disebut dalam catatan resmi Jakarta.' },
    },
    comparison: { period: '1961–1975', originalFunction: 'Monumen nasional dan museum sejarah', currentFunction: 'Monumen, museum, dan destinasi sipil', dimensions: 'Tinggi 132 m', architecturalForm: 'Obelisk dengan lidah api' },
  },
  'tugu-pal-putih': {
    location: 'Yogyakarta, Indonesia',
    type: 'Bangunan Cagar Budaya Provinsi',
    shortDescription: 'Monumen putih pada sumbu historis utara Yogyakarta, dibangun dalam bentuknya sekarang setelah Tugu Golong-Gilig terdahulu rusak akibat gempa bumi.',
    modelNote: 'Studi visual prosedural berdasarkan foto dan uraian resmi cagar budaya. Dimensi survei bentuk saat ini tidak tersedia dalam registri yang diperiksa sehingga proporsinya bersifat interpretatif.',
    heritageStatus: 'Cagar Budaya Provinsi',
    items: {
      'tugu-origin': { text: 'Tugu Golong-Gilig terdahulu dibangun oleh Sultan Hamengku Buwana I pada 1756. Catatan resmi cagar budaya menggambarkannya sebagai silinder bata berplester setinggi 25 meter yang meruncing ke atas menuju bentuk bola.' },
      'tugu-rebuild': { text: 'Monumen terdahulu rusak akibat gempa bumi 10 Juni 1867. Penggantinya dibangun kembali pada masa Hamengku Buwana VII dan diresmikan pada 3 Oktober 1889.' },
      'tugu-form': { text: 'Bentuk Pal Putih saat ini berbeda dari Golong-Gilig dalam bentuk, ornamen, dan skala. Komposisi bawahnya menggunakan empat tingkat berundak, dengan inskripsi pada keempat sisinya.' },
      'tugu-conservation': { text: 'Rehabilitasi tahun 2012 memperbaiki plester retak, memperbarui cat luar dan lapisan prada, serta mengganti mustaka kayu jati dengan material yang sama.' },
      'tugu-axis': { text: 'Tugu merupakan komponen utama sumbu kosmologis Yogyakarta sepanjang enam kilometer yang menghubungkan Gunung Merapi dan Samudra Hindia dengan Kraton sebagai pusatnya.' },
      'tugu-timeline-1756': { title: 'Golong-Gilig didirikan', text: 'Sultan Hamengku Buwana I mendirikan monumen terdahulu setelah Perjanjian Giyanti tahun 1755.' },
      'tugu-timeline-1867': { title: 'Kerusakan akibat gempa', text: 'Tugu Golong-Gilig rusak dalam gempa bumi 10 Juni.' },
      'tugu-timeline-1889': { title: 'Pal Putih diresmikan', text: 'Monumen pengganti diresmikan pada 3 Oktober.' },
      'tugu-timeline-2012': { title: 'Pekerjaan konservasi', text: 'Dinas kebudayaan provinsi merehabilitasi plester, lapisan akhir, mustaka, dan taman pelindung.' },
      'tugu-current-form': { label: 'Bentuk saat ini', value: '1889' },
      'tugu-earlier-form': { label: 'Bentuk terdahulu', value: 'Golong-Gilig' },
      'tugu-heritage-status': { label: 'Status cagar budaya', value: 'Provinsi' },
      'tugu-axis-role': { label: 'Peran pada sumbu', value: 'Penanda utara' },
      'tugu-base': { title: 'Dasar berinskripsi', summary: 'Empat tingkat berundak menopang inskripsi pada keempat sisi.' },
      'tugu-shaft': { title: 'Batang Pal Putih', summary: 'Bentuk saat ini berbeda dari Golong-Gilig terdahulu yang berbentuk silinder.' },
      'tugu-finial': { title: 'Mustaka atas', summary: 'Mustaka kayu jati diganti dengan material yang sama saat rehabilitasi tahun 2012.' },
      'tugu-place-kraton': { title: 'Kraton Yogyakarta', summary: 'Kraton merupakan unsur pusat dalam sumbu kosmologis.' },
      'tugu-event-earthquake': { title: 'Gempa bumi Yogyakarta 1867', summary: 'Bencana ini merusak Golong-Gilig dan mendahului bentuk yang ada sekarang.' },
      'tugu-person-hb1': { title: 'Sultan Hamengku Buwana I', summary: 'Pendiri yang dikaitkan dengan Tugu Golong-Gilig terdahulu.' },
      'tugu-context-axis': { title: 'Sumbu Kosmologis Yogyakarta', summary: 'Lanskap budaya terdaftar UNESCO yang mengekspresikan konsep kosmologi Jawa.' },
    },
    comparison: { period: 'Didirikan 1756; bentuk saat ini 1889', originalFunction: 'Garis pandang kerajaan dan penanda sumbu', currentFunction: 'Penanda sumbu historis dan landmark kota', dimensions: 'Golong-Gilig terdahulu tercatat setinggi 25 m', architecturalForm: 'Dasar empat tingkat, batang berinskripsi, dan mustaka', heritageStatus: 'Cagar budaya provinsi' },
  },
  'jam-gadang': {
    location: 'Bukittinggi, Indonesia',
    type: 'Menara Jam Kota',
    shortDescription: 'Menara jam kota setinggi 26 meter di pusat Bukittinggi, dikenali melalui atap Minangkabau berbentuk tanduk pada bagian puncaknya.',
    modelNote: 'Model interpretatif prosedural menggunakan tinggi terverifikasi 26 meter dan referensi visual resmi. Proporsi fasad dan pelataran bukan hasil survei arsitektur.',
    heritageStatus: 'Cagar Budaya Nasional',
    items: {
      'jam-construction': { text: 'Dinas pariwisata Bukittinggi mencatat bahwa Jam Gadang dibangun pada 1926 dengan biaya sekitar 3.000 gulden serta menyebut Yazid Sutan Maruhun dan Rasid Sutan Gigi Ameh sebagai arsiteknya.' },
      'jam-colonial-context': { text: 'Pemerintah kota menggambarkan menara ini sebagai hadiah pada masa kolonial kepada Rook Maker, yang saat itu menjabat sekretaris atau controleur Fort de Kock.' },
      'jam-form': { text: 'Profil pemerintah kota mencatat tinggi 26 meter. Puncak menara saat ini menggunakan bentuk atap tanduk kerbau yang diasosiasikan dengan rumah gadang.' },
      'jam-material': { text: 'Pemerintah kota menyebut menara ini dibangun menggunakan kapur. Ruang jam berada di atas batang utama dan di bawah atap berbentuk tanduk.' },
      'jam-city-context': { text: 'Pemerintah Bukittinggi menetapkan Jam Gadang sebagai ikon kota sekaligus Sumatera Barat dan memelihara pelataran terbuka di sekitarnya sebagai destinasi publik.' },
      'jam-timeline-1926': { title: 'Menara diselesaikan', text: 'Dinas pariwisata kota mencatat pembangunan selesai pada 1926.' },
      'jam-timeline-2024': { title: 'Konservasi ditegaskan kembali', text: 'Pemerintah kota menegaskan kembali pemeliharaan rutin tanpa mengubah bentuk menara.' },
      'jam-height': { label: 'Tinggi', value: '26 m' },
      'jam-completed': { label: 'Selesai dibangun', value: '1926' },
      'jam-architects': { label: 'Arsitek', value: 'Yazid & Rasid' },
      'jam-setting': { label: 'Lokasi', value: 'Pusat kota' },
      'jam-body': { title: 'Badan menara', summary: 'Pemerintah kota menyebut menara ini dibangun menggunakan kapur.' },
      'jam-clock': { title: 'Ruang jam', summary: 'Muka jam menandai ruang di atas batang utama.' },
      'jam-roof': { title: 'Atap berbentuk tanduk', summary: 'Puncak saat ini menggunakan bentuk yang diasosiasikan dengan rumah gadang.' },
      'jam-place-bukittinggi': { title: 'Pusat Kota Bukittinggi', summary: 'Menara dan pelataran di sekitarnya membentuk destinasi sipil publik.' },
      'jam-person-builders': { title: 'Yazid Sutan Maruhun & Rasid Sutan Gigi Ameh', summary: 'Dinas pariwisata kota menyebut kedua arsitek Minangkabau ini.' },
      'jam-context-rumah-gadang': { title: 'Bentuk atap Minangkabau', summary: 'Puncak saat ini mengadopsi bentuk tanduk yang diasosiasikan dengan rumah gadang.' },
    },
    comparison: { period: 'Selesai 1926', originalFunction: 'Menara jam kota', currentFunction: 'Landmark kota dan destinasi publik', dimensions: 'Tinggi sekitar 26 m', architecturalForm: 'Menara jam dengan atap tanduk Minangkabau', materials: 'Material kapur' },
  },
}

export const indonesianProvinceCopy: Record<string, { island: string; introduction: string }> = {
  'province-jakarta': { island: 'Jawa', introduction: 'Lanskap monumental yang berpusat pada monumen nasional Indonesia.' },
  'province-yogyakarta': { island: 'Jawa', introduction: 'Penanda warisan perkotaan pada sumbu kosmologis Yogyakarta.' },
  'province-sumatera-barat': { island: 'Sumatra', introduction: 'Menara jam kota di pusat Bukittinggi.' },
}

export const indonesianReadingScopes: Record<string, string> = {
  'prijotomo-2006-arsitektur-jawa': 'Bibliografi koleksi; relevansinya terhadap landmark individual belum ditetapkan. Belum diverifikasi.',
  'kurniawan-2019-tugu-nasional': 'Monumen Nasional — perbandingan arsitektur dan konteks pembangunan bangsa.',
  'sadana-2021-tugu-pal-putih': 'Tugu Pal Putih — lingkungan perkotaan, identitas visual, dan persepsi pengunjung.',
  'khadavi-yulcherlina-2018-jam-gadang': 'Jam Gadang — konstruksi dan keandalan struktur terhadap beban gempa.',
}
