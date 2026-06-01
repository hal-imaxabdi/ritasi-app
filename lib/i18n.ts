export type Lang = 'en' | 'id';

export const translations = {
  en: {
    // App
    appName: 'Ritasi',
    appTagline: 'Digital Trip Recording System',
    appDesc: 'Replacing paper slips with real-time integrated tracking',

    // Home
    startTrip: 'Start New Trip',
    adminDashboard: 'Admin Dashboard',
    totalTrips: 'Total Trips',
    inTransit: 'In Transit',
    completed: 'Completed',
    today: 'Today',

    // Start Trip
    startTripTitle: 'Start Trip',
    startTripSubtitle: 'Excavation Phase — Pink Slip',
    vehicleNumber: 'Vehicle Plate Number',
    vehiclePlaceholder: 'e.g. B 1234 XYZ',
    date: 'Date',
    excavationLocation: 'Excavation Location',
    excavationPlaceholder: 'e.g. Jl. Example No. 1, Jakarta',
    startTripBtn: 'Start Trip →',
    saving: 'Saving...',
    offlineNotice: '⚠️ Offline mode active — data will sync when connected',

    // Finish Trip
    finishTripTitle: 'Confirm Delivery',
    finishTripSubtitle: 'Unloading Phase — Green Slip',
    projectName: 'Project Name',
    projectPlaceholder: 'e.g. ABC Building Project',
    destinationLocation: 'Destination (Dump Site)',
    destinationPlaceholder: 'e.g. Jl. Destination No. 2',
    captureGPS: 'Capture GPS Location',
    capturingGPS: '📡 Getting GPS...',
    gpsOk: '✅ GPS',
    takePhoto: 'Take Proof Photo',
    changePhoto: 'Change Photo',
    confirmComplete: '✅ Confirm Complete',

    // Admin
    adminTitle: 'Admin Dashboard',
    adminSubtitle: 'Real-time trip monitoring',
    refresh: 'Refresh',
    searchPlaceholder: 'Search vehicle, project...',
    filterAll: 'All',
    filterTransit: 'In Transit',
    filterCompleted: 'Completed',
    noData: 'No trip data yet.',
    colVehicle: 'Vehicle',
    colDate: 'Date',
    colExcavation: 'Excavation Site',
    colProject: 'Project',
    colDump: 'Dump Site',
    colUnload: 'Unload Time',
    colStatus: 'Status',
    colPhoto: 'Photo',
    colGPS: 'GPS',
    statusTransit: '🚛 In Transit',
    statusDone: '✅ Completed',
    viewPhoto: 'View',
    loading: 'Loading...',
  },
  id: {
    // App
    appName: 'Ritasi',
    appTagline: 'Sistem Pencatatan Perjalanan Digital',
    appDesc: 'Menggantikan slip kertas dengan pelacakan terintegrasi real-time',

    // Home
    startTrip: 'Mulai Perjalanan Baru',
    adminDashboard: 'Dashboard Admin',
    totalTrips: 'Total Perjalanan',
    inTransit: 'Dalam Perjalanan',
    completed: 'Selesai',
    today: 'Hari Ini',

    // Start Trip
    startTripTitle: 'Mulai Perjalanan',
    startTripSubtitle: 'Fase Pengambilan — Slip Pink',
    vehicleNumber: 'No. Polisi Kendaraan',
    vehiclePlaceholder: 'cth. B 1234 XYZ',
    date: 'Tanggal',
    excavationLocation: 'Lokasi Galian',
    excavationPlaceholder: 'cth. Jl. Contoh No. 1, Jakarta',
    startTripBtn: 'Mulai Perjalanan →',
    saving: 'Menyimpan...',
    offlineNotice: '⚠️ Mode offline aktif — data akan disinkronkan saat terhubung',

    // Finish Trip
    finishTripTitle: 'Konfirmasi Pengiriman',
    finishTripSubtitle: 'Fase Pembongkaran — Slip Hijau',
    projectName: 'Nama Proyek',
    projectPlaceholder: 'cth. Proyek Gedung ABC',
    destinationLocation: 'Lokasi Tujuan (Urugan)',
    destinationPlaceholder: 'cth. Jl. Tujuan No. 2',
    captureGPS: 'Ambil Lokasi GPS',
    capturingGPS: '📡 Mengambil GPS...',
    gpsOk: '✅ GPS',
    takePhoto: 'Ambil Foto Bukti',
    changePhoto: 'Ganti Foto',
    confirmComplete: '✅ Konfirmasi Selesai',

    // Admin
    adminTitle: 'Dashboard Admin',
    adminSubtitle: 'Monitoring perjalanan real-time',
    refresh: 'Refresh',
    searchPlaceholder: 'Cari kendaraan, proyek...',
    filterAll: 'Semua',
    filterTransit: 'Dalam Perjalanan',
    filterCompleted: 'Selesai',
    noData: 'Belum ada data perjalanan.',
    colVehicle: 'Kendaraan',
    colDate: 'Tanggal',
    colExcavation: 'Lokasi Galian',
    colProject: 'Proyek',
    colDump: 'Lokasi Urugan',
    colUnload: 'Jam Bongkar',
    colStatus: 'Status',
    colPhoto: 'Foto',
    colGPS: 'GPS',
    statusTransit: '🚛 Dalam Perjalanan',
    statusDone: '✅ Selesai',
    viewPhoto: 'Lihat',
    loading: 'Memuat...',
  },
};

export type TranslationKey = keyof typeof translations.en;
