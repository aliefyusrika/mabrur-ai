# Quick Build Guide untuk cPanel

## 🚀 Langkah Cepat Build & Deploy

### 1. Persiapan

```bash
# Pastikan di folder project
cd Mabrur

# Install dependencies (jika belum)
npm install
```

### 2. Set Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://mabrur-ai.id
NEXT_PUBLIC_API_URL=https://mabrur-ai.id/api-php
```

**Ganti `mabrur-ai.id` dengan domain kamu!**

### 3. Build Project

```bash
npm run build
```

Tunggu sampai selesai (2-5 menit).

### 4. Hasil Build

Folder `out/` akan berisi:
- `index.html` - Homepage
- `_next/` - Assets (CSS, JS, images)
- Folder untuk setiap halaman

### 5. Upload ke cPanel

**Via File Manager:**
1. ZIP folder `out/` → `out.zip`
2. Upload `out.zip` ke `public_html/`
3. Extract di cPanel
4. Pindahkan semua isi dari folder `out/` ke `public_html/`
5. Hapus folder `out/` dan `out.zip`

**Via FTP (FileZilla):**
1. Connect ke FTP server
2. Upload semua isi folder `out/` ke `public_html/`

### 6. Upload PHP API

1. Upload folder `api-php/` ke `public_html/`
2. Edit `api-php/config/database.php`:
   - Ganti DB_NAME, DB_USER, DB_PASS

### 7. Upload .htaccess

Upload file `.htaccess` ke root `public_html/`

### 8. Test

Buka domain kamu di browser!

---

## ⚡ Quick Commands

```bash
# Clean build
rm -rf .next out

# Build
npm run build

# Check build size
du -sh out/

# Create ZIP for upload
cd out && zip -r ../out.zip . && cd ..
```

---

## 🔍 Verify Build

Sebelum upload, cek:

```bash
# Check if index.html exists
ls out/index.html

# Check if _next folder exists
ls out/_next/

# Check build size (should be < 50MB)
du -sh out/
```

---

## 📦 What to Upload

**Upload ini ke cPanel:**
1. ✅ Semua isi folder `out/` → ke `public_html/`
2. ✅ Folder `api-php/` → ke `public_html/api-php/`
3. ✅ File `.htaccess` → ke `public_html/.htaccess`

**JANGAN upload:**
- ❌ `node_modules/`
- ❌ `.next/`
- ❌ `.git/`
- ❌ `.env` atau `.env.local`
- ❌ Source code (app/, components/, lib/)

---

## 🎯 Checklist

- [ ] `npm install` done
- [ ] `.env.local` created with correct domain
- [ ] `npm run build` success
- [ ] Folder `out/` exists
- [ ] `out/index.html` exists
- [ ] Upload `out/` contents to `public_html/`
- [ ] Upload `api-php/` to `public_html/`
- [ ] Upload `.htaccess` to `public_html/`
- [ ] Edit `database.php` with credentials
- [ ] Test website in browser

Done! 🎉
