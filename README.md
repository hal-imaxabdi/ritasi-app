# 🚛 Ritasi App

> A Progressive Web App (PWA) for digitizing truck trip records (*ritasi*), replacing manual paper slips with a fully integrated, real-time system.

---

## 📌 Overview

Manual paper-based trip recording causes data loss, delays reconciliation, and lacks real-time visibility. **Ritasi App** replaces the physical pink slip (Bon Tanah) and green slip (Bukti Pengiriman) with a mobile-first digital workflow — from excavation to unloading — all tied to a single Trip ID.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 Start Trip Form | Replaces the pink slip — records vehicle number, date, and excavation location |
| 📦 Finish Trip Form | Replaces the green slip — records project name, destination, and unload time |
| 📸 Photo Capture | Digital proof via device camera, replacing physical signatures |
| 📍 GPS Tagging | Auto-captures coordinates when a trip is confirmed complete |
| 📡 Offline Support | Saves trips locally and auto-syncs when connection is restored |
| 📊 Admin Dashboard | Real-time table showing all trips with status tracking and detail view |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database & Storage**: Supabase (PostgreSQL + Storage Bucket)
- **PWA**: next-pwa (service worker + manifest)

---

## 🚀 Getting Started

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

Then create a storage bucket named **`trip-photos`** with **public** access.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Folder Structure

```
ritasi-app/
├── app/
│   ├── page.tsx                    # Home / landing
│   ├── trip/start/page.tsx         # Start trip form (pink slip)
│   ├── trip/[id]/finish/page.tsx   # Finish trip form (green slip)
│   └── admin/page.tsx              # Admin dashboard
├── components/
│   └── SyncOnline.tsx              # Auto-sync when connection is restored
├── lib/
│   ├── supabase.ts                 # Supabase client
│   └── offlineQueue.ts             # Offline queue (localStorage)
└── public/
    └── manifest.json               # PWA manifest
```

---

## 🔄 Usage Flow

```
1. Open app → tap "Start New Trip"
2. Fill in vehicle number, date, excavation location → submit
      ↓ (trip created with status: in_transit)
3. On the Finish page → fill in project name, destination, unload time
4. Capture GPS coordinates + take proof photo
5. Tap "Confirm Complete" → data saved to Supabase (status: completed)
      ↓
6. Admin monitors all trips in real-time at /admin
```

---