# Deployment Guide - Mabrur AI

## Deploy ke Vercel

### Langkah 1: Install Vercel CLI (Opsional)
```bash
npm install -g vercel
```

### Langkah 2: Deploy via Vercel Dashboard (Recommended)

1. **Buka Vercel Dashboard**
   - Kunjungi: https://vercel.com/new
   - Login dengan GitHub account

2. **Import Repository**
   - Pilih "Import Git Repository"
   - Cari dan pilih: `aliefyusrika/mabrur-ai`
   - Klik "Import"

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Environment Variables**
   Tambahkan environment variables berikut:
   
   ```
   DATABASE_URL=mysql://user:password@host:3306/mabrur_ai
   JWT_SECRET=your-secret-key-here
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

   **PENTING untuk DATABASE_URL:**
   - Gunakan MySQL hosting online (bukan localhost)
   - Rekomendasi: PlanetScale, Railway, atau Aiven
   - Format: `mysql://username:password@host:port/database`

5. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build selesai (2-3 menit)

### Langkah 3: Setup Database Production

#### Opsi A: PlanetScale (Recommended - Free Tier)
1. Buka https://planetscale.com
2. Create new database: `mabrur-ai`
3. Copy connection string
4. Update `DATABASE_URL` di Vercel environment variables
5. Run migration:
   ```bash
   npx prisma db push
   ```

#### Opsi B: Railway
1. Buka https://railway.app
2. New Project → Provision MySQL
3. Copy connection string
4. Update `DATABASE_URL` di Vercel environment variables

#### Opsi C: Aiven
1. Buka https://aiven.io
2. Create MySQL service
3. Copy connection string
4. Update `DATABASE_URL` di Vercel environment variables

### Langkah 4: Run Database Migration di Production

Setelah deploy, jalankan migration:

```bash
# Install Vercel CLI jika belum
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration
vercel env pull .env.production
npx prisma db push
npx prisma db seed
```

### Langkah 5: Verifikasi Deployment

1. Buka URL Vercel: `https://your-app.vercel.app`
2. Test login admin: `admin@mabrur.ai` / `admin123`
3. Test login jamaah dengan token: `DEMO1234`

## Deploy via CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd Mabrur
vercel

# Deploy to production
vercel --prod
```

## Auto-Deploy

Setelah setup awal, setiap push ke branch `main` akan otomatis trigger deployment baru di Vercel.

## Troubleshooting

### Error: Database Connection Failed
- Pastikan DATABASE_URL menggunakan host online (bukan localhost)
- Cek firewall database mengizinkan koneksi dari Vercel
- Vercel IP ranges: https://vercel.com/docs/concepts/edge-network/regions

### Error: Build Failed
- Cek logs di Vercel dashboard
- Pastikan semua dependencies ada di package.json
- Cek TypeScript errors: `npm run build` locally

### Error: Environment Variables Not Found
- Pastikan semua env vars sudah ditambahkan di Vercel dashboard
- Redeploy setelah menambah env vars baru

## Monitoring

- **Logs**: https://vercel.com/dashboard → Project → Logs
- **Analytics**: https://vercel.com/dashboard → Project → Analytics
- **Performance**: https://vercel.com/dashboard → Project → Speed Insights

## Custom Domain (Optional)

1. Buka Project Settings → Domains
2. Add domain: `mabrur-ai.com`
3. Update DNS records sesuai instruksi Vercel
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Backup & Rollback

- Vercel menyimpan semua deployment history
- Rollback: Dashboard → Deployments → Pilih versi → Promote to Production
