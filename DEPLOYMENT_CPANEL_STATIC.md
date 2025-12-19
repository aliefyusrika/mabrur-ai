# Deployment Guide - Next.js Static Export ke cPanel

## 📋 Overview

Project ini sudah dikonversi menjadi:
- **Frontend:** Next.js Static Export (HTML/CSS/JS)
- **Backend:** PHP REST API
- **Database:** MySQL di cPanel

Tidak perlu Node.js server! ✅

---

## 🚀 LANGKAH 1: Build Project Locally

### 1.1 Install Dependencies

```bash
cd Mabrur
npm install
```

### 1.2 Update Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://mabrur-ai.id
NEXT_PUBLIC_API_URL=https://mabrur-ai.id/api-php
```

Ganti `mabrur-ai.id` dengan domain kamu.

### 1.3 Build Static Export

```bash
npm run build
```

Ini akan generate folder `out/` yang berisi static files.

### 1.4 Verifikasi Build

Cek folder `out/`:
- ✅ Ada file `index.html`
- ✅ Ada folder `_next/` dengan assets
- ✅ Ada folder untuk setiap halaman

---

## 📤 LANGKAH 2: Upload ke cPanel

### 2.1 Upload Frontend (Static Files)

1. **Buka cPanel → File Manager**
2. **Navigate ke `public_html`** (atau folder domain kamu)
3. **Upload semua isi folder `out/`:**
   - Cara 1: ZIP folder `out/`, upload, lalu extract
   - Cara 2: Upload langsung via FTP (FileZilla)

**Struktur akhir di cPanel:**
```
public_html/
├── index.html
├── _next/
│   ├── static/
│   └── ...
├── admin/
│   └── login/
│       └── index.html
├── jamaah/
│   └── dashboard/
│       └── index.html
└── ...
```

### 2.2 Upload Backend (PHP API)

1. **Di File Manager, tetap di `public_html`**
2. **Upload folder `api-php/`** dari project kamu
3. **Set permissions:**
   - Folder `api-php/`: 755
   - Semua file `.php`: 644

**Struktur akhir:**
```
public_html/
├── api-php/
│   ├── config/
│   │   └── database.php
│   ├── auth/
│   │   └── login.php
│   ├── jamaah/
│   │   ├── verify.php
│   │   └── status.php
│   └── content/
│       ├── manasik.php
│       └── chatbot.php
├── index.html
└── ...
```

### 2.3 Upload .htaccess

1. **Upload file `.htaccess`** ke root `public_html/`
2. **Pastikan file terlihat** (enable "Show Hidden Files" di File Manager)

---

## 🔧 LANGKAH 3: Konfigurasi PHP Backend

### 3.1 Edit Database Configuration

1. **Buka file:** `public_html/api-php/config/database.php`
2. **Edit kredensial database:**

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'mabx3556_mabrur_ai');
define('DB_USER', 'mabx3556_mabrur_user');
define('DB_PASS', 'YOUR_ACTUAL_PASSWORD'); // Ganti dengan password database kamu
```

3. **Save file**

### 3.2 Test API Endpoint

Buka di browser:
```
https://mabrur-ai.id/api-php/content/manasik.php
```

Seharusnya return JSON:
```json
{
  "success": true,
  "data": [...]
}
```

Kalau error, cek:
- Database credentials benar
- Database sudah di-import
- PHP version minimal 7.4

---

## ✅ LANGKAH 4: Verifikasi Deployment

### 4.1 Test Frontend

Buka domain kamu: `https://mabrur-ai.id`

Cek:
- ✅ Homepage muncul
- ✅ Navigasi berfungsi
- ✅ Gambar muncul
- ✅ Tidak ada error 404

### 4.2 Test Login Admin

1. Buka: `https://mabrur-ai.id/admin/login`
2. Login dengan:
   - Email: `admin@mabrur.ai`
   - Password: `admin123`
3. Seharusnya redirect ke dashboard

### 4.3 Test Login Jamaah

1. Buka: `https://mabrur-ai.id/jamaah`
2. Masukkan token: `DEMO1234`
3. Seharusnya redirect ke dashboard jamaah

---

## 🔒 LANGKAH 5: Keamanan (PENTING!)

### 5.1 Protect Database Config

Tambahkan di `api-php/config/.htaccess`:

```apache
<Files "database.php">
  Order Allow,Deny
  Deny from all
</Files>
```

### 5.2 Enable HTTPS

1. **Di cPanel → SSL/TLS Status**
2. **Install Let's Encrypt SSL** (gratis)
3. **Force HTTPS** - uncomment di `.htaccess`:

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 5.3 Ganti JWT Secret

Edit `api-php/config/database.php`:

```php
$secret = 'GANTI_DENGAN_SECRET_KUAT_RANDOM_STRING';
```

---

## 📁 Struktur File Lengkap di cPanel

```
public_html/
├── .htaccess                    # Apache config untuk SPA routing
├── index.html                   # Homepage
├── _next/                       # Next.js assets
│   ├── static/
│   └── ...
├── admin/                       # Admin pages
│   ├── login/
│   │   └── index.html
│   ├── dashboard/
│   │   └── index.html
│   └── ...
├── jamaah/                      # Jamaah pages
│   ├── dashboard/
│   │   └── index.html
│   └── ...
├── api-php/                     # PHP Backend API
│   ├── .htaccess               # Protect config files
│   ├── config/
│   │   └── database.php        # Database config
│   ├── auth/
│   │   └── login.php
│   ├── jamaah/
│   │   ├── verify.php
│   │   └── status.php
│   └── content/
│       ├── manasik.php
│       └── chatbot.php
└── uploads/                     # Upload folder (create manually)
    ├── images/
    └── audio/
```

---

## 🆘 Troubleshooting

### Error: "Failed to fetch API"

**Penyebab:**
- API URL salah
- CORS issue
- PHP error

**Solusi:**
1. Cek `NEXT_PUBLIC_API_URL` di build
2. Test API endpoint langsung di browser
3. Cek PHP error log di cPanel

### Error: "Database connection failed"

**Penyebab:**
- Database credentials salah
- Database belum di-import

**Solusi:**
1. Cek `api-php/config/database.php`
2. Test koneksi via phpMyAdmin
3. Pastikan user punya akses ke database

### Error: 404 saat refresh halaman

**Penyebab:**
- `.htaccess` tidak ter-upload
- `mod_rewrite` tidak aktif

**Solusi:**
1. Upload `.htaccess` ke root
2. Hubungi hosting support untuk enable `mod_rewrite`

### Error: "Permission denied"

**Penyebab:**
- File permissions salah

**Solusi:**
```
Folders: 755
Files: 644
```

---

## 🔄 Update Aplikasi

Ketika ada perubahan:

### Update Frontend:
1. `npm run build` locally
2. Upload isi folder `out/` ke cPanel (replace existing)

### Update Backend:
1. Edit file PHP di cPanel File Manager
2. Atau upload file baru via FTP

### Update Database:
1. Export perubahan schema dari local
2. Import via phpMyAdmin di cPanel

---

## 📊 Monitoring

### Check Logs:
- **PHP Errors:** cPanel → Error Log
- **Access Log:** cPanel → Raw Access
- **Browser Console:** F12 → Console tab

### Performance:
- Enable caching di `.htaccess` ✅
- Compress images before upload
- Use CDN untuk assets (optional)

---

## 🎯 Checklist Deployment

- [ ] Database sudah di-import
- [ ] Build project: `npm run build`
- [ ] Upload folder `out/` ke `public_html/`
- [ ] Upload folder `api-php/` ke `public_html/`
- [ ] Upload `.htaccess` ke root
- [ ] Edit `api-php/config/database.php` dengan credentials
- [ ] Test API endpoint di browser
- [ ] Test homepage
- [ ] Test login admin
- [ ] Test login jamaah
- [ ] Enable SSL/HTTPS
- [ ] Protect config files
- [ ] Ganti JWT secret

---

## 📞 Support

Jika ada masalah:
1. Cek error log di cPanel
2. Test API endpoint langsung
3. Cek browser console (F12)
4. Verify database connection

**Selamat! Aplikasi kamu sekarang live di cPanel! 🎉**
