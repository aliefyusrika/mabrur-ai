# Deploy Mabrur AI ke cPanel Hosting

## Prasyarat
- cPanel dengan Node.js support (versi 18+)
- SSH Access (opsional tapi recommended)
- MySQL Database di cPanel

## Langkah 1: Setup Database MySQL di cPanel

1. **Buka cPanel → MySQL Databases**
2. **Create Database:**
   - Database Name: `mabrur_ai`
   - Klik "Create Database"

3. **Create MySQL User:**
   - Username: `mabrur_user`
   - Password: (generate strong password)
   - Klik "Create User"

4. **Add User to Database:**
   - User: `mabrur_user`
   - Database: `mabrur_ai`
   - Privileges: **ALL PRIVILEGES**
   - Klik "Make Changes"

5. **Catat Connection String:**
   ```
   Host: localhost (atau IP server dari cPanel)
   Database: cpanel_username_mabrur_ai
   Username: cpanel_username_mabrur_user
   Password: your_password
   Port: 3306
   ```

## Langkah 2: Setup Node.js Application di cPanel

1. **Buka cPanel → Setup Node.js App**

2. **Create Application:**
   - Node.js version: **18.x** atau lebih tinggi
   - Application mode: **Production**
   - Application root: `mabrur-ai`
   - Application URL: pilih domain/subdomain
   - Application startup file: `server.js`
   - Klik "Create"

## Langkah 3: Upload Files

### Opsi A: Via File Manager (Mudah)

1. **Download project dari GitHub:**
   - Buka: https://github.com/aliefyusrika/mabrur-ai
   - Klik "Code" → "Download ZIP"

2. **Upload ke cPanel:**
   - Buka cPanel → File Manager
   - Navigate ke folder: `mabrur-ai` (yang dibuat di step 2)
   - Upload ZIP file
   - Extract ZIP

3. **Hapus file yang tidak perlu:**
   - Hapus folder: `node_modules`, `.next`, `.git`
   - Biarkan: semua file source code

### Opsi B: Via Git (Recommended)

1. **Buka Terminal/SSH di cPanel**

2. **Clone repository:**
   ```bash
   cd ~/mabrur-ai
   git clone https://github.com/aliefyusrika/mabrur-ai.git .
   ```

## Langkah 4: Create Server File

Buat file `server.js` di root folder `mabrur-ai`:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
```

## Langkah 5: Setup Environment Variables

1. **Buka cPanel → Setup Node.js App**
2. **Klik "Edit" pada aplikasi mabrur-ai**
3. **Scroll ke "Environment variables"**
4. **Tambahkan variables:**

```
DATABASE_URL=mysql://cpanel_username_mabrur_user:password@localhost:3306/cpanel_username_mabrur_ai
JWT_SECRET=mabrur-ai-secret-key-2024
NEXT_PUBLIC_APP_URL=https://mabrur-ai.id
OPENAI_API_KEY=sk-proj-0bQr3ysYUDgCBx7b4J9B...
NODE_ENV=production
```

**PENTING:** Ganti `cpanel_username` dengan username cPanel kamu!

## Langkah 6: Install Dependencies & Build

1. **Buka Terminal/SSH atau gunakan cPanel Terminal**

2. **Navigate ke folder:**
   ```bash
   cd ~/mabrur-ai
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

5. **Push database schema:**
   ```bash
   npx prisma db push
   ```

6. **Seed database:**
   ```bash
   npm run db:seed
   ```

7. **Build aplikasi:**
   ```bash
   npm run build
   ```

## Langkah 7: Start Application

1. **Kembali ke cPanel → Setup Node.js App**
2. **Klik "Edit" pada aplikasi**
3. **Klik tombol "Restart"**
4. **Atau via terminal:**
   ```bash
   cd ~/mabrur-ai
   npm start
   ```

## Langkah 8: Setup Domain/Subdomain

1. **Buka cPanel → Domains atau Subdomains**
2. **Create subdomain (contoh):**
   - Subdomain: `app`
   - Domain: `mabrur-ai.id`
   - Document Root: `/home/username/mabrur-ai`

3. **Update .htaccess** (jika perlu):
   Buat file `.htaccess` di document root:
   ```apache
   RewriteEngine On
   RewriteRule ^$ http://127.0.0.1:PORT/ [P,L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://127.0.0.1:PORT/$1 [P,L]
   ```
   Ganti `PORT` dengan port yang digunakan aplikasi (cek di Node.js App settings)

## Troubleshooting

### Error: Module not found
```bash
cd ~/mabrur-ai
npm install
```

### Error: Database connection failed
- Cek DATABASE_URL di environment variables
- Pastikan format: `mysql://user:pass@localhost:3306/dbname`
- Cek user MySQL punya akses ke database

### Error: Port already in use
- Restart aplikasi dari cPanel Node.js App manager
- Atau kill process: `pkill -f node`

### Error: Permission denied
```bash
chmod -R 755 ~/mabrur-ai
```

### Build error
```bash
cd ~/mabrur-ai
rm -rf .next node_modules
npm install
npm run build
```

## Monitoring & Logs

1. **Lihat logs:**
   - cPanel → Setup Node.js App → klik aplikasi → View Logs

2. **Restart aplikasi:**
   - cPanel → Setup Node.js App → Restart

## Update Aplikasi

Ketika ada update di GitHub:

```bash
cd ~/mabrur-ai
git pull origin main
npm install
npx prisma generate
npm run build
# Restart dari cPanel Node.js App
```

## Optimasi Production

1. **Enable PM2 (Process Manager):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "mabrur-ai" -- start
   pm2 save
   pm2 startup
   ```

2. **Setup SSL Certificate:**
   - cPanel → SSL/TLS Status
   - Install Let's Encrypt SSL (gratis)

3. **Enable Caching:**
   - Sudah built-in di Next.js

## Backup

1. **Database backup:**
   - cPanel → phpMyAdmin → Export

2. **Files backup:**
   - cPanel → Backup → Download Home Directory

## Akun Default

Setelah deploy berhasil:
- **Admin:** admin@mabrur.ai / admin123
- **Jamaah Demo:** Token: DEMO1234

## Support

Jika ada masalah:
1. Cek logs di cPanel Node.js App
2. Cek error_log di cPanel File Manager
3. Test database connection via phpMyAdmin
