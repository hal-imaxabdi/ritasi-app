import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const { data: trips } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Dashboard Admin Ritasi</h1>
      <div className="overflow-x-auto rounded-2xl shadow">
        <table className="w-full bg-white text-sm">
          <thead className="bg-green-700 text-white">
            <tr>
              {['No. Kendaraan','Tgl','Lokasi Galian','Proyek','Lokasi Urugan','Jam Bongkar','Status','Foto','GPS'].map(h => (
                <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trips?.map((trip, i) => (
              <tr key={trip.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-mono font-bold">{trip.vehicle_number}</td>
                <td className="px-4 py-3 whitespace-nowrap">{trip.excavation_date}</td>
                <td className="px-4 py-3">{trip.excavation_location}</td>
                <td className="px-4 py-3">{trip.project_name || '—'}</td>
                <td className="px-4 py-3">{trip.destination_location || '—'}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {trip.unload_time
                    ? new Date(trip.unload_time).toLocaleTimeString('id-ID')
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    trip.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {trip.status === 'completed' ? '✅ Selesai' : '🚛 In Transit'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {trip.photo_url
                    ? <a href={trip.photo_url} target="_blank" className="text-blue-600 underline">Lihat</a>
                    : '—'}
                </td>
                <td className="px-4 py-3 text-xs font-mono">
                  {trip.gps_lat
                    ? `${trip.gps_lat.toFixed(4)}, ${trip.gps_lng.toFixed(4)}`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!trips || trips.length === 0) && (
          <p className="text-center py-10 text-gray-400">Belum ada data perjalanan.</p>
        )}
      </div>
    </main>
  )
}