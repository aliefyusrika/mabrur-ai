-- Mabrur AI Database Import
-- Database: mabrur_ai
-- Generated for MySQL/MariaDB

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `password` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'JAMAAH',
  `token` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `Jamaah`
--

CREATE TABLE `Jamaah` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `passportNo` varchar(191) DEFAULT NULL,
  `packageType` varchar(191) DEFAULT NULL,
  `departureDate` datetime(3) DEFAULT NULL,
  `status` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `JamaahStatus`
--

CREATE TABLE `JamaahStatus` (
  `id` varchar(191) NOT NULL,
  `jamaahId` varchar(191) NOT NULL,
  `payment` varchar(191) NOT NULL DEFAULT 'NOT_STARTED',
  `visa` varchar(191) NOT NULL DEFAULT 'NOT_STARTED',
  `ticket` varchar(191) NOT NULL DEFAULT 'NOT_STARTED',
  `hotel` varchar(191) NOT NULL DEFAULT 'NOT_STARTED',
  `transport` varchar(191) NOT NULL DEFAULT 'NOT_STARTED',
  `equipment` varchar(191) NOT NULL DEFAULT 'NOT_STARTED',
  `manasik` varchar(191) NOT NULL DEFAULT 'NOT_STARTED',
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `ChatbotContent`
--

CREATE TABLE `ChatbotContent` (
  `id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `question` varchar(191) NOT NULL,
  `answer` varchar(191) NOT NULL,
  `keywords` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `ManasikContent`
--

CREATE TABLE `ManasikContent` (
  `id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `videoUrl` varchar(191) DEFAULT NULL,
  `orderIndex` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `Departure`
--

CREATE TABLE `Departure` (
  `id` varchar(191) NOT NULL,
  `flightNumber` varchar(191) NOT NULL,
  `airline` varchar(191) NOT NULL,
  `departureDate` datetime(3) NOT NULL,
  `departureTime` varchar(191) NOT NULL,
  `arrivalTime` varchar(191) DEFAULT NULL,
  `origin` varchar(191) NOT NULL,
  `destination` varchar(191) NOT NULL,
  `terminal` varchar(191) DEFAULT NULL,
  `gate` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ON_TIME',
  `delayMinutes` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `Notification`
--

CREATE TABLE `Notification` (
  `id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `priority` varchar(191) NOT NULL DEFAULT 'NORMAL',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `expiresAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `IbadahContent`
--

CREATE TABLE `IbadahContent` (
  `id` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `location` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `arabicText` text DEFAULT NULL,
  `latinText` text DEFAULT NULL,
  `translation` text DEFAULT NULL,
  `audioPath` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `orderIndex` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `ZiarahLocation`
--

CREATE TABLE `ZiarahLocation` (
  `id` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `arabicName` varchar(191) DEFAULT NULL,
  `description` text NOT NULL,
  `history` text DEFAULT NULL,
  `virtues` text DEFAULT NULL,
  `practices` text DEFAULT NULL,
  `imagePath` varchar(191) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `placeId` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `orderIndex` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `ReturnFlight`
--

CREATE TABLE `ReturnFlight` (
  `id` varchar(191) NOT NULL,
  `flightNumber` varchar(191) NOT NULL,
  `airline` varchar(191) NOT NULL,
  `returnDate` datetime(3) NOT NULL,
  `departureTime` varchar(191) NOT NULL,
  `arrivalTime` varchar(191) DEFAULT NULL,
  `origin` varchar(191) NOT NULL DEFAULT 'JED - Jeddah',
  `destination` varchar(191) NOT NULL DEFAULT 'CGK - Jakarta',
  `terminal` varchar(191) DEFAULT NULL,
  `gate` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ON_TIME',
  `delayMinutes` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `JourneyMemory`
--

CREATE TABLE `JourneyMemory` (
  `id` varchar(191) NOT NULL,
  `jamaahId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `imageUrl` varchar(191) DEFAULT NULL,
  `location` varchar(191) DEFAULT NULL,
  `memoryDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `Testimonial`
--

CREATE TABLE `Testimonial` (
  `id` varchar(191) NOT NULL,
  `jamaahId` varchar(191) NOT NULL,
  `jamaahName` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `content` text NOT NULL,
  `packageType` varchar(191) DEFAULT NULL,
  `travelDate` varchar(191) DEFAULT NULL,
  `isApproved` tinyint(1) NOT NULL DEFAULT 0,
  `isPublic` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `LoyaltyPoints`
--

CREATE TABLE `LoyaltyPoints` (
  `id` varchar(191) NOT NULL,
  `jamaahId` varchar(191) NOT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `tier` varchar(191) NOT NULL DEFAULT 'BRONZE',
  `referralCode` varchar(191) NOT NULL,
  `totalReferrals` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD UNIQUE KEY `User_token_key` (`token`);

--
-- Indexes for table `Jamaah`
--
ALTER TABLE `Jamaah`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Jamaah_userId_key` (`userId`);

--
-- Indexes for table `JamaahStatus`
--
ALTER TABLE `JamaahStatus`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `JamaahStatus_jamaahId_key` (`jamaahId`);

--
-- Indexes for table `ChatbotContent`
--
ALTER TABLE `ChatbotContent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ManasikContent`
--
ALTER TABLE `ManasikContent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Departure`
--
ALTER TABLE `Departure`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Notification`
--
ALTER TABLE `Notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `IbadahContent`
--
ALTER TABLE `IbadahContent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ZiarahLocation`
--
ALTER TABLE `ZiarahLocation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ReturnFlight`
--
ALTER TABLE `ReturnFlight`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `JourneyMemory`
--
ALTER TABLE `JourneyMemory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Testimonial`
--
ALTER TABLE `Testimonial`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `LoyaltyPoints`
--
ALTER TABLE `LoyaltyPoints`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `LoyaltyPoints_jamaahId_key` (`jamaahId`),
  ADD UNIQUE KEY `LoyaltyPoints_referralCode_key` (`referralCode`);

--
-- Constraints for table `Jamaah`
--
ALTER TABLE `Jamaah`
  ADD CONSTRAINT `Jamaah_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `JamaahStatus`
--
ALTER TABLE `JamaahStatus`
  ADD CONSTRAINT `JamaahStatus_jamaahId_fkey` FOREIGN KEY (`jamaahId`) REFERENCES `Jamaah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Insert default data
--

-- Admin user (password: admin123)
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `token`, `createdAt`, `updatedAt`) VALUES
('admin001', 'admin@mabrur.ai', '$2a$10$tIZG83myW1m/HWJV.0iu5.muut8XylfdWG7SfA10l2XADiemlqlfq', 'Administrator', 'ADMIN', NULL, NOW(), NOW());

-- Demo Jamaah user (token: DEMO1234)
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `token`, `createdAt`, `updatedAt`) VALUES
('user001', NULL, NULL, 'Ahmad Fauzi', 'JAMAAH', 'DEMO1234', NOW(), NOW());

INSERT INTO `Jamaah` (`id`, `userId`, `phone`, `passportNo`, `packageType`, `departureDate`, `createdAt`, `updatedAt`) VALUES
('jamaah001', 'user001', '081234567890', 'A1234567', 'REGULER', '2024-03-15 00:00:00', NOW(), NOW());

INSERT INTO `JamaahStatus` (`id`, `jamaahId`, `payment`, `visa`, `ticket`, `hotel`, `transport`, `equipment`, `manasik`, `updatedAt`) VALUES
('status001', 'jamaah001', 'COMPLETED', 'IN_PROGRESS', 'NOT_STARTED', 'NOT_STARTED', 'NOT_STARTED', 'NOT_STARTED', 'IN_PROGRESS', NOW());

-- Chatbot content
INSERT INTO `ChatbotContent` (`id`, `type`, `question`, `answer`, `keywords`, `isActive`, `createdAt`, `updatedAt`) VALUES
('chat001', 'FAQ', 'Apa itu umroh?', 'Umroh adalah ibadah yang dilakukan di Makkah dengan melakukan thawaf, sa\'i, dan tahallul. Berbeda dengan haji, umroh dapat dilakukan kapan saja sepanjang tahun.', 'umroh,pengertian,definisi', 1, NOW(), NOW()),
('chat002', 'FAQ', 'Berapa biaya umroh?', 'Biaya umroh bervariasi tergantung paket yang dipilih, mulai dari 20 juta hingga 50 juta rupiah. Silakan hubungi admin untuk informasi paket terbaru.', 'biaya,harga,paket', 1, NOW(), NOW()),
('chat003', 'FAQ', 'Dokumen apa saja yang diperlukan?', 'Dokumen yang diperlukan: 1) Paspor (minimal 7 bulan), 2) KTP, 3) Kartu Keluarga, 4) Buku Nikah (untuk pasangan), 5) Foto 4x6 latar putih, 6) Sertifikat vaksin meningitis.', 'dokumen,persyaratan,syarat', 1, NOW(), NOW()),
('chat004', 'FAQ', 'Berapa lama umroh?', 'Paket umroh kami tersedia dalam durasi 9 hari, 12 hari, dan 16 hari. Durasi ini sudah termasuk perjalanan dan ibadah di Makkah dan Madinah.', 'durasi,lama,hari', 1, NOW(), NOW());

COMMIT;
