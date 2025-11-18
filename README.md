Library Management System API 📚API RESTful lengkap untuk sistem manajemen perpustakaan yang dibangun dengan Express.js dan PostgreSQL. Sistem ini menangani inventaris buku, manajemen anggota, dan operasi peminjaman dengan validasi dan business logic yang tepat.🚀 FiturManajemen Buku: Operasi CRUD lengkap untuk buku perpustakaan.Manajemen Anggota: Pendaftaran dan manajemen anggota dengan validasi email.Sistem Peminjaman: Pelacakan peminjaman dan pengembalian buku dengan aturan bisnis.Manajemen Stok: Pelacakan ketersediaan buku real-time.Desain RESTful: Endpoint API yang konsisten dan bersih.Validasi Data: Validasi input yang komprehensif.Penanganan Error: Response error yang detail dengan status code.Pagination & Filtering: Pengambilan data efisien dengan pagination dan filter pencarian.🛠️ Tech StackBackend: Node.js, Express.jsDatabase: PostgreSQL (Primary Key UUID)Keamanan: CORS, Input ValidationDevelopment: Nodemon, dotenv📋 PrasyaratSebelum memulai, pastikan kamu telah menginstal:Node.js (v14 atau lebih tinggi)PostgreSQL (v12 atau lebih tinggi)npm atau yarn🚀 Mulai Cepat1. InstalasiClone repository ini ke komputer lokal kamu:# Clone repository
git clone <repository-url>
cd library-management-api

# Install dependencies
npm install
2. Konfigurasi EnvironmentSalin file .env.example menjadi .env:cp .env.example .env
# atau pada Windows:
# copy .env.example .env
Buka file .env yang baru dibuat dan sesuaikan dengan kredensial database lokal kamu:PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_management
DB_USER=postgres
DB_PASSWORD=password_anda_di_sini
3. Setup DatabaseJalankan perintah berikut untuk inisialisasi database:# Inisialisasi database (membuat database, tabel, dan indexes)
npm run init-db

# Insert data sample (opsional - untuk testing)
npm run sample-data
4. Jalankan Server# Mode development dengan auto-reload
npm run dev

# Mode production
npm start
API akan tersedia di http://localhost:3000.📚 Endpoint APIHealth & DokumentasiGET /health - Health check dan status serverGET /api - Dokumentasi API dengan semua endpointGET / - Redirect ke dokumentasi APIManajemen BukuMethodEndpointDeskripsiParameter QueryGET/api/booksDapatkan semua buku dengan paginationpage, limit, title, authorGET/api/books/availableDapatkan buku yang tersedia (stock > 0)-GET/api/books/:idDapatkan buku berdasarkan ID-POST/api/booksBuat buku baru-PUT/api/books/:idUpdate buku-DELETE/api/books/:idHapus buku-Manajemen AnggotaMethodEndpointDeskripsiParameter QueryGET/api/membersDapatkan semua anggota-GET/api/members/:idDapatkan anggota berdasarkan ID-POST/api/membersBuat anggota baru-PUT/api/members/:idUpdate anggota-DELETE/api/members/:idHapus anggota-GET/api/members/:id/borrowingsDapatkan riwayat peminjaman anggotapage, limit, statusOperasi PeminjamanMethodEndpointDeskripsiGET/api/borrowingsDapatkan semua record peminjamanPOST/api/borrowingsBuat peminjaman baruGET/api/borrowings/:idDapatkan peminjaman berdasarkan IDPUT/api/borrowings/:id/returnKembalikan bukuGET/api/borrowings/overdueDapatkan peminjaman yang terlambatGET/api/borrowings/statsDapatkan statistik peminjaman📋 Contoh Penggunaan API1. Manajemen BukuDapatkan Semua Buku dengan Pagination dan Filtercurl "http://localhost:3000/api/books?page=1&limit=5&title=great"
Buat Buku Barucurl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "published_year": 1925,
    "stock": 5,
    "isbn": "9780743273565"
  }'
Response Sukses:{
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
2. Manajemen AnggotaBuat Anggota Barucurl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1234567890",
    "address": "123 Main Street, New York, NY"
  }'
Dapatkan Riwayat Peminjaman Anggotacurl "http://localhost:3000/api/members/:memberId/borrowings?status=BORROWED&page=1&limit=5"
3. PeminjamanPinjam Bukucurl -X POST http://localhost:3000/api/borrowings \
  -H "Content-Type: application/json" \
  -d '{
    "book_id": "book-uuid-here",
    "member_id": "member-uuid-here"
  }'
Kembalikan Bukucurl -X PUT http://localhost:3000/api/borrowings/borrowing-uuid-here/return
🗃️ Skema DatabaseTabel booksid UUID PRIMARY KEY
title VARCHAR(255) NOT NULL
author VARCHAR(255) NOT NULL
published_year INTEGER NOT NULL
stock INTEGER NOT NULL DEFAULT 0
isbn VARCHAR(13) UNIQUE NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
Tabel membersid UUID PRIMARY KEY
name VARCHAR(255) NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
phone VARCHAR(15) NOT NULL
address TEXT NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
Tabel borrowingsid UUID PRIMARY KEY
book_id UUID REFERENCES books(id) ON DELETE CASCADE
member_id UUID REFERENCES members(id) ON DELETE CASCADE
borrow_date DATE NOT NULL
return_date DATE
status VARCHAR(20) DEFAULT 'BORROWED' CHECK (status IN ('BORROWED', 'RETURNED'))
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
🔧 Struktur Projectlibrary-management-api/
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
⚠️ Penanganan ErrorAPI menggunakan response error yang konsisten.Response Sukses:{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully"
}
Response Error:{
  "success": false,
  "message": "Error description"
}
Kode Status HTTP Umum:200 - Sukses201 - Berhasil dibuat400 - Bad request (validasi error)404 - Resource tidak ditemukan409 - Konflik (data duplikat)500 - Internal server error🔒 Aturan Validasi & BisnisValidasi Buku:Judul & Penulis: Wajib, max 255 karakter.ISBN: Wajib, unik, 10 atau 13 karakter.Stok: Wajib, integer >= 0.Validasi Anggota:Email: Wajib, unik, format email valid.Telepon: Wajib, max 15 karakter.Aturan Bisnis Peminjaman:Buku harus ada dan memiliki stok tersedia (> 0).Anggota tidak dapat meminjam lebih dari 3 buku secara bersamaan.Anggota tidak dapat meminjam buku yang sama dua kali (jika status masih BORROWED).Tanggal peminjaman di-set otomatis ke tanggal saat ini.🧪 Testing dengan PostmanImport Collection: Import file JSON collection Postman yang disediakan.Set Environment: Atur baseUrl ke http://localhost:3000.Workflow Testing:Cek Health (/health)Buat Anggota & BukuLakukan PeminjamanCek Stok (harus berkurang)Kembalikan BukuCek Stok (harus bertambah)🚀 DeploymentUntuk deployment ke production:Set environment variables di server:NODE_ENV=production
PORT=3000
# ... db credentials ...
Install dependencies production saja:npm install --production
Start aplikasi:npm start
🐛 TroubleshootingError Koneksi Database: Cek apakah service PostgreSQL berjalan dan credentials di .env sudah benar.Port In Use: Gunakan lsof -i :3000 untuk mencari PID dan kill -9 <PID> untuk menghentikannya.UUID Error: Pastikan ekstensi UUID aktif di Postgres: CREATE EXTENSION IF NOT EXISTS "uuid-ossp";.🤝 KontribusiKontribusi selalu diterima! Silakan buat Pull Request baru.Fork repositoryBuat feature branch (git checkout -b feature/AmazingFeature)Commit perubahan (git commit -m 'Add some AmazingFeature')Push ke branch (git push origin feature/AmazingFeature)Buka Pull Request📝 LisensiDidistribusikan di bawah Lisensi MIT. Lihat LICENSE untuk informasi lebih lanjut.Dibuat dengan ❤️ untuk manajemen perpustakaan yang lebih baik.
