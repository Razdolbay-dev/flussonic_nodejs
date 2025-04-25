/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: flussonic_db
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0+deb12u1-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `city` varchar(100) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `house_number` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES
(2,'Питкяранта','Рудакова','6'),
(3,'Питкяранта','Титова','5'),
(4,'Питкяранта','Рудакова','1'),
(5,'Питкяранта','Победы','5');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients_tmp`
--

DROP TABLE IF EXISTS `clients_tmp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients_tmp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fio` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients_tmp`
--

LOCK TABLES `clients_tmp` WRITE;
/*!40000 ALTER TABLE `clients_tmp` DISABLE KEYS */;
INSERT INTO `clients_tmp` VALUES
(3,'Чулков Павел Анатольевич','+79215278490','30495213','KuLd9lRC0ovD0w0I7mk9','2025-04-23 11:01:08');
/*!40000 ALTER TABLE `clients_tmp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients_tmp_addresses`
--

DROP TABLE IF EXISTS `clients_tmp_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients_tmp_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `access_until` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `clients_tmp_addresses_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients_tmp` (`id`) ON DELETE CASCADE,
  CONSTRAINT `clients_tmp_addresses_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients_tmp_addresses`
--

LOCK TABLES `clients_tmp_addresses` WRITE;
/*!40000 ALTER TABLE `clients_tmp_addresses` DISABLE KEYS */;
INSERT INTO `clients_tmp_addresses` VALUES
(20,3,2,'2025-04-30 08:01:08'),
(21,3,3,'2025-04-30 08:01:08'),
(22,3,5,'2025-04-30 08:01:08'),
(23,3,4,'2025-04-30 08:01:08');
/*!40000 ALTER TABLE `clients_tmp_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dvr`
--

DROP TABLE IF EXISTS `dvr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `dvr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `path` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dvr`
--

LOCK TABLES `dvr` WRITE;
/*!40000 ALTER TABLE `dvr` DISABLE KEYS */;
INSERT INTO `dvr` VALUES
(4,'Root','/media/paul/Games/dvr');
/*!40000 ALTER TABLE `dvr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `cdn_url` text DEFAULT 'http://localhost:8888',
  `pubt` varchar(255) DEFAULT NULL,
  `privt` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `address_id` int(11) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `token` (`token`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(5,'razdolbay','kjifHm11.06!','192.168.0.210','2025-04-22 19:19:58',2,'9ddwsc58jbsm9spnn17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webcam`
--

DROP TABLE IF EXISTS `webcam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `webcam` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `url` text NOT NULL,
  `dvr_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `role` enum('public','private') DEFAULT 'public',
  `day_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uid` (`uid`),
  KEY `dvr_id` (`dvr_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `webcam_ibfk_1` FOREIGN KEY (`dvr_id`) REFERENCES `dvr` (`id`),
  CONSTRAINT `webcam_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webcam`
--

LOCK TABLES `webcam` WRITE;
/*!40000 ALTER TABLE `webcam` DISABLE KEYS */;
INSERT INTO `webcam` VALUES
(6,'0b2b7lvx','Ленина 15','rtsp://stream033:stream03@10.200.1.42:554/',4,2,'public',86400),
(9,'ybke5hii','Гоголя 13','rtsp://stream033:stream033@10.200.1.10:554/cam/realmonitor?channel=1&subtype=0',4,4,'public',259200);
/*!40000 ALTER TABLE `webcam` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-25 10:34:13
