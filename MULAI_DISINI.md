# 🚀 PANDUAN DEPLOYMENT KE CPANEL - MULAI DISINI!

## ✅ Yang Sudah Selesai

Project Next.js kamu sudah dikonversi menjadi:
- ✅ **Frontend:** Static HTML/CSS/JS (tidak perlu Node.js!)
- ✅ **Backend:** PHP REST API
- ✅ **Database:** MySQL sudah di-import di cPanel

---

## 📋 LANGKAH DEPLOYMENT (5 Langkah Mudah)

### LANGKAH 1: Build Project

Di komputer kamu, buka terminal/command prompt:

```bash
cd D:\belajar\Mabrur\Mabrur
npm install
npm run build
```

Tunggu sampai selesai. Folder `out/` akan dibuat.

---

### LANGKAH 2: Siapkan File untuk Upload

Kamu perlu upload 3 hal ke cPanel:

1. **Isi folder `out/`** (hasil build)
2. **Folder `api-php/`** (backend PHP)
3. **File `.htaccess`** (konfigurasi Apache)

**Cara termudah:** ZIP folder `out/` jadi `out.zip`

---

### LANGKAH 3: Upload ke cPanel

1. **Buka cPanel → File Manager**
2. **Navigate ke `public_html`**
3. **Upload `out.zip`**
4. **Extract `out.zip`**
5. **Pindahkan semua isi folder `out/` ke `public_html/`**
   - Jangan folder `out/` nya, tapi isinya!
6. **Upload folder `api-php/`** ke `public_html/`
7. **Upload file `.htaccess`** ke `public_html/`

**Hasil akhir di cPanel:**
```
public_html/
├── index.html          ← dari out/
├── _next/              ← dari out/
├── admin/              ← dari out/
├── jamaah/             ← dari out/
├── api-php/            ← upload folder ini
└── .htaccess           ← upload file ini
```

---

### LANGKAH 4: Konfigurasi Database

1. **Buka file:** `public_html/api-php/config/database.php`
2. **Edit baris ini:**

```php
define('DB_NAME', 'mabx3556_mabrur_ai');
define('DB_USER', 'mabx3556_mabrur_user');
define('DB_PASS', 'GANTI_DENGAN_PASSWORD_KAMU');
```

3. **Save**

---

### LANGKAH 5: Test Website

1. **Buka domain kamu:** `https://mabrur-ai.id`
2. **Test login admin:**
   - Buka: `/admin/login`
   - Email: `admin@mabrur.ai`
   - Password: `admin123`
3. **Test login jamaah:**
   - Buka: `/jamaah`
   - Token: `DEMO1234`

**Kalau berhasil login, SELESAI! 🎉**

---

## 🆘 Kalau Ada Masalah

### Masalah 1: Halaman 404 saat refresh

**Solusi:** Pastikan file `.htaccess` sudah di-upload ke root `public_html/`

### Masalah 2: API Error / Failed to fetch

**Solusi:**
1. Test API langsung: `https://mabrur-ai.id/api-php/content/manasik.php`
2. Kalau error, cek `api-php/config/database.php`
3. Pastikan password database benar

### Masalah 3: Database connection failed

**Solusi:**
1. Cek database name, username, password di `database.php`
2. Test koneksi via phpMyAdmin
3. Pastikan database sudah di-import

---

## 📚 Dokumentasi Lengkap

- **Build Guide:** `build-for-cpanel.md`
- **Deployment Detail:** `DEPLOYMENT_CPANEL_STATIC.md`
- **PHP API Docs:** `api-php/README.md`

---

## 🎯 Checklist Cepat

- [ ] `npm run build` berhasil
- [ ] Folder `out/` ada
- [ ] Upload isi `out/` ke `public_html/`
- [ ] Upload `api-php/` ke `public_html/`
- [ ] Upload `.htaccess` ke `public_html/`
- [ ] Edit `database.php` dengan password
- [ ] Test buka domain
- [ ] Test login admin
- [ ] Test login jamaah

---

## 💡 Tips

1. **Gunakan FileZilla** untuk upload (lebih cepat dari File Manager)
2. **Enable SSL** di cPanel untuk HTTPS
3. **Backup database** secara rutin
4. **Jangan upload folder `node_modules/`** (tidak perlu!)

---

## 🎉 Selamat!

Setelah semua langkah selesai, website kamu akan live di cPanel tanpa perlu Node.js server!

**Ada pertanyaan? Cek dokumentasi lengkap di file-file lainnya.**

Good luck! 🚀
