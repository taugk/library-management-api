# Library Management System API 📚

API RESTful lengkap untuk sistem manajemen perpustakaan yang dibangun dengan Express.js dan PostgreSQL. Sistem ini menangani inventaris buku, manajemen anggota, dan operasi peminjaman dengan validasi dan business logic yang tepat.

## 🚀 Fitur

- **Manajemen Buku**: Operasi CRUD lengkap untuk buku perpustakaan.
- **Manajemen Anggota**: Pendaftaran dan manajemen anggota dengan validasi email.
- **Sistem Peminjaman**: Pelacakan peminjaman dan pengembalian buku dengan aturan bisnis.
- **Manajemen Stok**: Pelacakan ketersediaan buku real-time.
- **Desain RESTful**: Endpoint API yang konsisten dan bersih.
- **Validasi Data**: Validasi input yang komprehensif.
- **Penanganan Error**: Response error yang detail dengan status code.
- **Pagination & Filtering**: Pengambilan data efisien dengan pagination dan filter pencarian.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Primary Key UUID)
- **Keamanan**: CORS, Input Validation
- **Development**: Nodemon, dotenv

## 📋 Prasyarat

Sebelum memulai, pastikan kamu telah menginstal:
- Node.js (v14 atau lebih tinggi)
- PostgreSQL (v12 atau lebih tinggi)
- npm atau yarn

## 🚀 Mulai Cepat

### 1. Instalasi

Clone repository ini ke komputer lokal kamu:

```bash
# Clone repository
git clone <repository-url>
cd library-management-api

# Install dependencies
npm install
```

### 2. Konfigurasi Environment

Salin file `.env_example` menjadi `.env`:

```bash
cp .env.example .env
# atau pada Windows:
# copy .env_example .env
```

Buka file `.env` yang baru dibuat dan sesuaikan dengan kredensial database lokal kamu:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_management
DB_USER=postgres
DB_PASSWORD=password_anda_di_sini
```

### 3. Setup Database

Jalankan perintah berikut untuk inisialisasi database:

```bash
# Inisialisasi database (membuat database, tabel, dan indexes)
npm run init-db
```

### 4. Jalankan Server

```bash
# Mode development dengan auto-reload
npm run dev

# Mode production
npm start
```

API akan tersedia di `http://localhost:3000`.

## 📚 Endpoint API

### Health & Dokumentasi

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/health` | Health check dan status server |
| GET | `/api` | Dokumentasi API dengan semua endpoint |
| GET | `/` | Redirect ke dokumentasi API |

### Manajemen Buku

| Method | Endpoint | Deskripsi | Parameter Query |
|--------|----------|-----------|-----------------|
| GET | `/api/books` | Dapatkan semua buku dengan pagination | `page`, `limit`, `title`, `author` |
| GET | `/api/books/available` | Dapatkan buku yang tersedia (stock > 0) | - |
| GET | `/api/books/:id` | Dapatkan buku berdasarkan ID | - |
| POST | `/api/books` | Buat buku baru | - |
| PUT | `/api/books/:id` | Update buku | - |
| DELETE | `/api/books/:id` | Hapus buku | - |

### Manajemen Anggota

| Method | Endpoint | Deskripsi | Parameter Query |
|--------|----------|-----------|-----------------|
| GET | `/api/members` | Dapatkan semua anggota | - |
| GET | `/api/members/:id` | Dapatkan anggota berdasarkan ID | - |
| POST | `/api/members` | Buat anggota baru | - |
| PUT | `/api/members/:id` | Update anggota | - |
| DELETE | `/api/members/:id` | Hapus anggota | - |
| GET | `/api/members/:id/borrowings` | Dapatkan riwayat peminjaman anggota | `page`, `limit`, `status` |

### Operasi Peminjaman

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/borrowings` | Dapatkan semua record peminjaman |
| POST | `/api/borrowings` | Buat peminjaman baru |
| GET | `/api/borrowings/:id` | Dapatkan peminjaman berdasarkan ID |
| PUT | `/api/borrowings/:id/return` | Kembalikan buku |
| GET | `/api/borrowings/overdue` | Dapatkan peminjaman yang terlambat |
| GET | `/api/borrowings/stats` | Dapatkan statistik peminjaman |

## 📋 Contoh Penggunaan API

### 1. Manajemen Buku

**Dapatkan Semua Buku dengan Pagination dan Filter**

```bash
curl "http://localhost:3000/api/books?page=1&limit=5&title=great"
```

**Buat Buku Baru**

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "published_year": 1925,
    "stock": 5,
    "isbn": "9780743273565"
  }'
```

**Response Sukses:**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "published_year": 1925,
    "stock": 5,
    "isbn": "9780743273565",
    "available": true,
    "created_at": "2023-10-27T10:00:00.000Z",
    "updated_at": "2023-10-27T10:00:00.000Z"
  },
  "message": "Book created successfully"
}
```

### 2. Manajemen Anggota

**Buat Anggota Baru**

```bash
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "address": "123 Main Street, New York, NY"
  }'
```

**Dapatkan Riwayat Peminjaman Anggota**

```bash
curl "http://localhost:3000/api/members/:memberId/borrowings?status=BORROWED&page=1&limit=5"
```

### 3. Peminjaman

**Pinjam Buku**

```bash
curl -X POST http://localhost:3000/api/borrowings \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": "book-uuid-here",
    "member_id": "member-uuid-here"
  }'
```

**Kembalikan Buku**

```bash
curl -X PUT http://localhost:3000/api/borrowings/borrowing-uuid-here/return
```

## 🗃️ Skema Database

### Tabel `books`

```sql
id UUID PRIMARY KEY
title VARCHAR(255) NOT NULL
author VARCHAR(255) NOT NULL
published_year INTEGER NOT NULL
stock INTEGER NOT NULL DEFAULT 0
isbn VARCHAR(13) UNIQUE NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Tabel `members`

```sql
id UUID PRIMARY KEY
name VARCHAR(255) NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
phone VARCHAR(15) NOT NULL
address TEXT NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Tabel `borrowings`

```sql
id UUID PRIMARY KEY
book_id UUID REFERENCES books(id) ON DELETE CASCADE
member_id UUID REFERENCES members(id) ON DELETE CASCADE
borrow_date DATE NOT NULL
return_date DATE
status VARCHAR(20) DEFAULT 'BORROWED' CHECK (status IN ('BORROWED', 'RETURNED'))
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## 🔧 Struktur Project

```
library-management-api/
├── src/
│   ├── config/
│   │   ├── database.js          # Konfigurasi database
│   │   └── initDatabase.js      # Inisialisasi database
│   ├── controllers/
│   │   ├── bookController.js      # Business logic buku
│   │   ├── memberController.js    # Business logic anggota
│   │   └── borrowingController.js # Business logic peminjaman
│   ├── models/
│   │   ├── book.js              # Model data buku
│   │   ├── member.js            # Model data anggota
│   │   └── borrowing.js         # Model data peminjaman
│   ├── services/
│   │   ├── bookService.js       # Service layer buku
│   │   ├── memberService.js     # Service layer anggota
│   │   └── borrowingService.js  # Service layer peminjaman
│   ├── routes/
│   │   ├── bookRoutes.js        # Routes buku
│   │   ├── memberRoutes.js      # Routes anggota
│   │   └── borrowingRoutes.js   # Routes peminjaman
│   └── app.js                   # Entry point aplikasi
├── .env                         # Environment variables
├── .env.example                 # Template environment variables
├── package.json                 # Dependencies dan scripts
└── README.md                    # Dokumentasi project
```

## ⚠️ Penanganan Error

API menggunakan response error yang konsisten.

**Response Sukses:**
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
```

**Response Error:**
```json
{
  "success": false,
  "message": "Error description"
}
```

**Kode Status HTTP Umum:**
- `200` - Sukses
- `201` - Berhasil dibuat
- `400` - Bad request (validasi error)
- `404` - Resource tidak ditemukan
- `409` - Konflik (data duplikat)
- `500` - Internal server error

## 🔒 Aturan Validasi & Bisnis

### Validasi Buku:
- **Judul & Penulis**: Wajib, max 255 karakter.
- **ISBN**: Wajib, unik, 10 atau 13 karakter.
- **Stok**: Wajib, integer >= 0.

### Validasi Anggota:
- **Email**: Wajib, unik, format email valid.
- **Telepon**: Wajib, max 15 karakter.

### Aturan Bisnis Peminjaman:
- Buku harus ada dan memiliki stok tersedia (> 0).
- Anggota tidak dapat meminjam lebih dari 3 buku secara bersamaan.
- Anggota tidak dapat meminjam buku yang sama dua kali (jika status masih BORROWED).
- Tanggal peminjaman di-set otomatis ke tanggal saat ini.

## 🧪 Testing dengan Postman

1. **Import Collection**: Import file JSON collection Postman yang disediakan.
2. **Set Environment**: Atur baseUrl ke `http://localhost:3000`.
3. **Workflow Testing**:
   - Cek Health (`/health`)
   - Buat Anggota & Buku
   - Lakukan Peminjaman
   - Cek Stok (harus berkurang)
   - Kembalikan Buku
   - Cek Stok (harus bertambah)

## 🚀 Deployment

Untuk deployment ke production:

1. Set environment variables di server:
   ```env
   NODE_ENV=production
   PORT=3000
   # ... db credentials ...
   ```

2. Install dependencies production saja:
   ```bash
   npm install --production
   ```

3. Start aplikasi:
   ```bash
   npm start
   ```

## 🐛 Troubleshooting

- **Error Koneksi Database**: Cek apakah service PostgreSQL berjalan dan credentials di `.env` sudah benar.
- **Port In Use**: Gunakan `lsof -i :3000` untuk mencari PID dan `kill -9 <PID>` untuk menghentikannya.
- **UUID Error**: Pastikan ekstensi UUID aktif di Postgres: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat Pull Request baru.

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📝 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---

Dibuat dengan ❤️ untuk manajemen perpustakaan yang lebih baik.
