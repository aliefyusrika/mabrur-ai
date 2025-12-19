# Setup Environment Variables untuk Production

## 📋 Informasi Database Production Kamu

Berdasarkan database yang sudah dibuat:

```
Database Name: mabx3556_mabrur_ai
Username: mabx3556_mabrur_user
Password: [password yang kamu buat saat create user]
Host: localhost
Port: 3306
```

## 🔧 Environment Variables yang Perlu Di-Set

### **1. DATABASE_URL**
```
mysql://mabx3556_mabrur_user:YOUR_PASSWORD@localhost:3306/mabx3556_mabrur_ai
```
**PENTING:** Ganti `YOUR_PASSWORD` dengan password user database kamu!

### **2. JWT_SECRET**
```
mabrur-ai-production-secret-key-2024
```
Atau generate secret baru yang lebih kuat.

### **3. NEXT_PUBLIC_APP_URL**
```
https://mabrur-ai.id
```
Ganti dengan domain production kamu (contoh: https://app.mabrur-ai.id)

### **4. OPENAI_API_KEY**
```
sk-proj-YOUR_OPENAI_API_KEY_HERE
```
Gunakan API key kamu atau buat baru di https://platform.openai.com/api-keys

### **5. NODE_ENV**
```
production
```

---

## 🚀 Cara Set Environment Variables

### **Opsi A: Deploy ke Vercel (RECOMMENDED)**

1. **Buka Vercel Dashboard:** https://vercel.com/new
2. **Import repository:** aliefyusrika/mabrur-ai
3. **Klik "Environment Variables"**
4. **Tambahkan satu per satu:**

| Name | Value |
|------|-------|
| `DATABASE_URL` | `mysql://mabx3556_mabrur_user:PASSWORD@HOST:3306/mabx3556_mabrur_ai` |
| `JWT_SECRET` | `mabrur-ai-production-secret-key-2024` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `OPENAI_API_KEY` | `sk-proj-YOUR_KEY_HERE` |
| `NODE_ENV` | `production` |

**CATATAN untuk DATABASE_URL di Vercel:**
- Ganti `HOST` dengan IP public server cPanel kamu
- Atau gunakan database online seperti PlanetScale (gratis)
- cPanel localhost tidak bisa diakses dari Vercel

5. **Klik "Deploy"**

---

### **Opsi B: Deploy ke cPanel dengan Node.js**

Jika hosting kamu support Node.js:

1. **Buka cPanel → Setup Node.js App**
2. **Edit aplikasi mabrur-ai**
3. **Scroll ke "Environment variables"**
4. **Tambahkan satu per satu:**

```
DATABASE_URL = mysql://mabx3556_mabrur_user:PASSWORD@localhost:3306/mabx3556_mabrur_ai
JWT_SECRET = mabrur-ai-production-secret-key-2024
NEXT_PUBLIC_APP_URL = https://mabrur-ai.id
OPENAI_API_KEY = sk-proj-YOUR_KEY_HERE
NODE_ENV = production
```

5. **Save dan Restart aplikasi**

---

### **Opsi C: File .env di Server (Tidak Recommended)**

Jika terpaksa menggunakan file .env di server:

1. **Upload semua file ke server**
2. **Buat file `.env` di root folder aplikasi**
3. **Copy isi dari `.env.production.example`**
4. **Edit nilai sesuai dengan kredensial production**
5. **Set permission:** `chmod 600 .env`

**PERINGATAN:** File .env di server kurang aman. Lebih baik pakai environment variables dari hosting panel.

---

## 🔒 Keamanan

### **JANGAN:**
- ❌ Commit file `.env` ke Git
- ❌ Share password database di public
- ❌ Gunakan password lemah
- ❌ Expose API keys

### **LAKUKAN:**
- ✅ Gunakan environment variables dari hosting panel
- ✅ Gunakan password kuat untuk database
- ✅ Rotate API keys secara berkala
- ✅ Backup database secara rutin

---

## 📝 Checklist Setup

- [ ] Database production sudah dibuat: `mabx3556_mabrur_ai`
- [ ] User database sudah dibuat: `mabx3556_mabrur_user`
- [ ] Password database sudah dicatat
- [ ] Tabel sudah di-import (13 tabel)
- [ ] Data awal sudah ada (admin & jamaah demo)
- [ ] Environment variables sudah di-set di hosting
- [ ] Aplikasi sudah di-deploy
- [ ] Test login admin: admin@mabrur.ai / admin123
- [ ] Test login jamaah: token DEMO1234

---

## 🆘 Troubleshooting

### Error: "Can't connect to MySQL server"
- Cek DATABASE_URL sudah benar
- Cek username dan password database
- Cek database user punya akses ke database
- Jika deploy ke Vercel, gunakan database online (bukan localhost)

### Error: "Invalid JWT secret"
- Pastikan JWT_SECRET sudah di-set
- Pastikan tidak ada spasi atau karakter aneh

### Error: "OpenAI API error"
- Cek OPENAI_API_KEY masih valid
- Cek quota API key belum habis

---

## 📞 Support

Jika ada masalah:
1. Cek logs aplikasi
2. Cek environment variables sudah benar
3. Test koneksi database via phpMyAdmin
4. Restart aplikasi setelah update env vars
