# 📈 TradeMind

TradeMind adalah platform **Trading Journal & Analytics** modern berbasis web yang dirancang untuk membantu trader mencatat transaksi harian, menganalisis performa portofolio secara statistik, dan mengidentifikasi pola trading guna meningkatkan konsistensi profitabilitas di pasar keuangan.

Aplikasi ini mengintegrasikan **Next.js (App Router)** dengan **Tailwind CSS v4** untuk antarmuka pengguna (UI) yang responsif dan elegan, **Supabase** untuk autentikasi serta basis data real-time, dan **Recharts** untuk visualisasi grafik performa yang interaktif.

---

## ✨ Fitur Utama

- **🔒 Autentikasi Keamanan Tinggi**: Registrasi dan masuk akun pengguna yang aman menggunakan layanan **Supabase Auth**.
- **📊 Dashboard Utama Terintegrasi**:
  - Ringkasan KPI: **Total Saldo**, **Total Transaksi**, **Win Rate (%)**, **Net Profit/Loss ($)**, dan **P/L Bulan Ini**.
  - Kalkulator Statistik: Total Win/Lose, Total Margin, ROI (Return on Investment), serta perhitungan **Streak Aktif** (kemenangan/kekalahan beruntun).
  - Aktivitas Terkini: Menampilkan 5 transaksi terakhir secara dinamis.
  - Statistik Aset Terpopuler: Meringkas pasangan mata uang/kripto (Pairs) yang paling sering diperdagangkan.
- **📝 Jurnal Trading Lengkap**:
  - Penambahan log trade baru (Tanggal, Pair, Posisi Long/Short, Margin, Strategi, Hasil Win/Lose, Profit/Loss).
  - Pengubahan (Edit) data jurnal trading yang sudah tercatat.
  - Penghapusan (Delete) log trade dengan sinkronisasi data real-time.
- **📉 Analisis Statistik & Grafik Interaktif**:
  - **Expectancy Rate**: Rumus probabilitas statistik yang mengukur perkiraan profitabilitas sistem trading Anda per trade.
  - **Risk-to-Reward Ratio (R:R)**: Membandingkan rata-rata keuntungan vs rata-rata kerugian secara akurat.
  - **Max Drawdown**: Melacak penurunan terdalam dari titik puncak equity.
  - **Equity Curve Chart**: Grafik garis pertumbuhan saldo modal dari waktu ke waktu.
  - **Win/Lose Distribution**: Diagram lingkaran visualisasi persentase kemenangan dan kekalahan.
  - **Monthly Performance**: Grafik batang visualisasi performa profit/loss per bulan.
  - **Breakdown Kategori**: Analisis terperinci berdasarkan Tipe Posisi (Long vs Short), Strategi Trading (SNR, SMC, dll.), serta tabel komprehensif performa per Pair lengkap dengan ROI.
  - **Automatic Insights**: Asisten pintar yang memberikan saran/evaluasi otomatis berdasarkan data trading Anda (misal: mengevaluasi win rate, mendeteksi drawdown tinggi, strategi terpopuler, dsb.).
- **👤 Profil & Pengaturan Modal**:
  - Kustomisasi nama lengkap trader.
  - Pengaturan **Modal Awal (Initial Balance)** yang terintegrasi langsung ke dalam perhitungan saldo dashboard secara real-time.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 16.2.10 (React 19)](https://nextjs.org/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) & `@supabase/ssr`
- **Charts / Visualisasi**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifikasi**: [React Hot Toast](https://react-hot-toast.com/)

---

## 🚀 Panduan Instalasi & Penggunaan

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek TradeMind secara lokal di komputer Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal perangkat lunak berikut:
- [Node.js](https://nodejs.org/) (Rekomendasi versi LTS terbaru / Node 18+)
- [Git](https://git-scm.com/)

### 2. Klon Repositori & Masuk ke Folder
Buka terminal/command prompt Anda, lalu jalankan perintah berikut:
```bash
# Clone repositori ini
git clone https://github.com/MuhamadNurRizkii/TradeMind.git

# Masuk ke direktori proyek
cd landing-page
```

### 3. Instalasi Dependensi
Instal semua modul Node.js yang diperlukan dengan perintah:
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Buat file bernama `.env.local` di direktori utama proyek, lalu isi dengan kredensial Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<id-proyek-anda>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<api-key-anon-anda>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<api-key-anon-anda>
```

> [!TIP]
> Anda dapat menyalin file template `.env` yang disediakan atau langsung menyesuaikan konfigurasi di atas sesuai dengan project Supabase yang Anda buat.

### 5. Setup Database di Supabase
Masuk ke **Supabase SQL Editor** di dasbor proyek Supabase Anda, lalu jalankan query SQL berikut untuk membuat tabel dan kebijakan keamanan (Row Level Security):

```sql
-- ============================================================
-- 1. TABEL PROFILES
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  initial_balance numeric default 0,
  created_at timestamptz default now()
);

-- Aktifkan Row Level Security (RLS) untuk profiles
alter table public.profiles enable row level security;

-- Kebijakan akses profiles
create policy "Users can view their own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update or insert their own profile" 
  on public.profiles for all 
  using (auth.uid() = id);

-- ============================================================
-- 2. TABEL TRADES
-- ============================================================
create table public.trades (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  trade_date date not null,
  pair text not null,
  position text check (position in ('Long', 'Short')),
  margin numeric not null,
  strategy text not null,
  result text check (result in ('Win', 'Lose')),
  profit_loss numeric not null,
  created_at timestamptz default now()
);

-- Aktifkan Row Level Security (RLS) untuk trades
alter table public.trades enable row level security;

-- Kebijakan akses trades
create policy "Users can manage their own trades" 
  on public.trades for all 
  using (auth.uid() = user_id);
```

---

## 🏃 Cara Menjalankan Aplikasi

### Menjalankan Development Server (Lokal)
Untuk memulai server pengembangan lokal, jalankan perintah:
```bash
npm run dev
```
Setelah server berjalan, buka browser dan akses tautan berikut:
👉 **[http://localhost:3000](http://localhost:3000)**

### Membuat Production Build
Untuk menguji performa optimasi dan membuat bundle siap rilis:
```bash
# Build aplikasi
npm run build

# Jalankan hasil build
npm start
```

---

## 📁 Struktur Direktori Utama

```text
TradeMind/
├── src/
│   ├── actions/       # Server Actions (Mutasi Supabase: trades, profiles)
│   ├── app/           # App Router Pages & Layouts
│   │   ├── (auth)/    # Halaman Login & Registrasi
│   │   ├── (dashboard)# Panel Dasbor, Statistik, Jurnal, Profil
│   │   ├── globals.css# Stylesheet Global (Tailwind v4)
│   │   └── layout.tsx # Root Layout
│   ├── components/    # Reusable UI & Layout Components
│   │   ├── dashboard/ # FormJournal, Charts (EquityCurve, PLBar, WinLosePie)
│   │   └── ui/        # Shadcn/Base-UI Core Components (Button, Input, dll.)
│   ├── hooks/         # Custom Hooks React
│   ├── lib/           # Helper Utils (Shadcn styling classes merger)
│   ├── types/         # Definisi Type/Interface TypeScript
│   └── utils/         # Inisialisasi Klien & Middleware Supabase
├── public/            # File Aset Statis (Gambar, SVG, Favicon)
├── package.json       # Manajer Dependensi & Script Project
└── tsconfig.json      # Konfigurasi TypeScript compiler
```

---

## 📝 Lisensi
Proyek ini dibuat untuk tujuan pembelajaran dan pengembangan pribadi. Silakan gunakan dan modifikasi secara bebas untuk kebutuhan jurnal trading Anda! 💸
