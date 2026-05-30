import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-700">🚛 Ritasi</h1>
          <p className="text-gray-500 mt-1">Pencatatan perjalanan truk digital</p>
        </div>
        <Link href="/trip/start"
          className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-semibold py-4 rounded-2xl text-lg shadow">
          ➕ Mulai Perjalanan Baru
        </Link>
        <Link href="/admin"
          className="block w-full bg-gray-800 hover:bg-gray-900 text-white text-center font-semibold py-4 rounded-2xl text-lg shadow">
          📊 Dashboard Admin
        </Link>
      </div>
    </main>
  )
}