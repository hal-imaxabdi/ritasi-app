# 🚛 Ritasi App

A Progressive Web App (PWA) for digitizing truck trip records (ritasi), replacing manual paper slips with an integrated real-time system.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database & Storage**: Supabase (PostgreSQL + Storage Bucket)
- **PWA**: next-pwa (service worker + manifest)

## Features

- 📋 Start trip form (replaces pink slip)
- 📦 Finish trip form with photo capture & GPS tagging (replaces green slip)
- 📊 Real-time admin dashboard
- 📡 Offline support with automatic queue sync when back online

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/hal-imaxabdi/ritasi-app.git
cd ritasi-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up Supabase

Run the following SQL in your Supabase SQL Editor:

```sql
create table trips (
  id uuid default gen_random_uuid() primary key,
  vehicle_number text not null,
  excavation_date date not null,
  excavation_location text not null,
  project_name text,
  destination_location text,
  unload_time timestamptz,
  photo_url text,
  gps_lat float,
  gps_lng float,
  status text default 'in_transit',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Create a storage bucket named `trip-photos` with **public** access.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Folder Structure
ritasi-app/
├── app/
│   ├── page.tsx                  # Home
│   ├── trip/start/page.tsx       # Start trip form
│   ├── trip/[id]/finish/         # Finish trip form
│   └── admin/page.tsx            # Admin dashboard
├── components/
│   └── SyncOnline.tsx            # Auto-sync when back online
├── lib/
│   ├── supabase.ts               # Supabase client
│   └── offlineQueue.ts           # Offline queue (localStorage)
└── public/
└── manifest.json             # PWA manifest

## Usage Flow

1. Open the app → click **Start New Trip**
2. Fill in vehicle number, date, excavation location → submit
3. On the finish page: fill in project name, destination, capture GPS, take proof photo
4. Click **Confirm Complete** → data saved to Supabase
5. Admin monitors all trips at `/admin`