import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mabrur.ai' },
    update: {},
    create: {
      email: 'admin@mabrur.ai',
      password: hashedPassword,
      name: 'Admin Travel',
      role: 'ADMIN',
    },
  })

  console.log('Created admin:', admin.email)

  // Create sample jamaah
  const jamaah1 = await prisma.user.create({
    data: {
      name: 'Ahmad Fauzi',
      role: 'JAMAAH',
      token: 'DEMO1234',
      jamaah: {
        create: {
          phone: '081234567890',
          passportNo: 'A1234567',
          status: {
            create: {
              payment: 'COMPLETED',
              visa: 'IN_PROGRESS',
              ticket: 'COMPLETED',
              hotel: 'IN_PROGRESS',
              transport: 'NOT_STARTED',
              equipment: 'NOT_STARTED',
              manasik: 'IN_PROGRESS',
            }
          }
        }
      }
    }
  })

  console.log('Created sample jamaah:', jamaah1.name, '- Token:', jamaah1.token)

  // Create sample chatbot content
  const contents = [
    {
      type: 'DOA' as const,
      question: 'Bagaimana niat ihram untuk umrah?',
      answer: 'Niat ihram untuk umrah:\n\nلَبَّيْكَ اللَّهُمَّ عُمْرَةً\n\nLabbaikallahumma umratan\n\nArtinya: "Aku penuhi panggilan-Mu ya Allah untuk umrah"',
      keywords: 'niat,ihram,umrah,labbaik',
    },
    {
      type: 'DOA' as const,
      question: 'Apa doa masuk Masjidil Haram?',
      answer: 'Doa masuk Masjidil Haram:\n\nبِسْمِ اللهِ وَالصَّلاَةُ وَالسَّلاَمُ عَلَى رَسُوْلِ اللهِ، اللَّهُمَّ افْتَحْ لِيْ أَبْوَابَ رَحْمَتِكَ\n\nArtinya: "Dengan nama Allah, shalawat dan salam kepada Rasulullah. Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu"',
      keywords: 'doa,masuk,masjidil haram,masjid',
    },
    {
      type: 'LOCATION' as const,
      question: 'Dimana lokasi Jabal Rahmah?',
      answer: 'Jabal Rahmah (Bukit Kasih Sayang) terletak di Padang Arafah, sekitar 20 km dari Makkah.\n\nIni adalah tempat bertemunya Nabi Adam dan Hawa setelah diturunkan ke bumi. Lokasi ini menjadi salah satu tempat mustajab untuk berdoa, terutama saat wukuf di Arafah.',
      keywords: 'jabal rahmah,arafah,lokasi,bukit',
    },
    {
      type: 'FAQ' as const,
      question: 'Apa saja yang membatalkan ihram?',
      answer: 'Yang membatalkan ihram:\n\n1. Mencukur atau mencabut rambut\n2. Memotong kuku\n3. Memakai wangi-wangian\n4. Berburu binatang darat\n5. Menikah atau menikahkan\n6. Berhubungan suami istri\n7. Bagi pria: memakai pakaian berjahit, menutup kepala\n8. Bagi wanita: memakai cadar dan sarung tangan',
      keywords: 'batal,ihram,larangan,haram',
    },
    {
      type: 'INFO' as const,
      question: 'Bagaimana jadwal manasik?',
      answer: 'Jadwal manasik akan diinformasikan oleh travel agent Anda. Biasanya manasik dilakukan 2-4 kali sebelum keberangkatan.\n\nSilakan hubungi travel agent untuk jadwal lengkap.',
      keywords: 'jadwal,manasik,latihan',
    },
  ]

  for (const content of contents) {
    await prisma.chatbotContent.create({ data: content })
  }

  console.log('Created', contents.length, 'chatbot contents')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
