const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
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
  console.log('Created jamaah:', jamaah1.name, '- Token:', jamaah1.token)

  const contents = [
    {
      type: 'DOA',
      question: 'Bagaimana niat ihram untuk umrah?',
      answer: 'Niat ihram untuk umrah:\n\nلَبَّيْكَ اللَّهُمَّ عُمْرَةً\n\nLabbaikallahumma umratan\n\nArtinya: Aku penuhi panggilan-Mu ya Allah untuk umrah',
      keywords: 'niat,ihram,umrah,labbaik',
    },
    {
      type: 'DOA',
      question: 'Apa doa masuk Masjidil Haram?',
      answer: 'Doa masuk Masjidil Haram:\n\nبِسْمِ اللهِ وَالصَّلاَةُ وَالسَّلاَمُ عَلَى رَسُوْلِ اللهِ\n\nArtinya: Dengan nama Allah, shalawat dan salam kepada Rasulullah',
      keywords: 'doa,masuk,masjidil haram,masjid',
    },
    {
      type: 'LOCATION',
      question: 'Dimana lokasi Jabal Rahmah?',
      answer: 'Jabal Rahmah terletak di Padang Arafah, sekitar 20 km dari Makkah. Tempat mustajab untuk berdoa.',
      keywords: 'jabal rahmah,arafah,lokasi,bukit',
    },
    {
      type: 'FAQ',
      question: 'Apa saja yang membatalkan ihram?',
      answer: '1. Mencukur rambut\n2. Memotong kuku\n3. Memakai wangi-wangian\n4. Berburu\n5. Menikah\n6. Berhubungan suami istri',
      keywords: 'batal,ihram,larangan',
    },
  ]

  for (const content of contents) {
    await prisma.chatbotContent.create({ data: content })
  }
  console.log('Created', contents.length, 'chatbot contents')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
