/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: flussonic_db
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0+deb12u1

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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES
(1,'Питкяранта','Гоголя','5а'),
(2,'Питкяранта','Гоголя','7'),
(3,'Питкяранта','Горького','36'),
(4,'Питкяранта','Горького','9'),
(5,'Питкяранта','Ленина','15'),
(6,'Питкяранта','Ленина','18'),
(7,'Питкяранта','Ленина','27'),
(8,'Питкяранта','Победы','1'),
(9,'Питкяранта','Победы','4'),
(10,'Питкяранта','Победы','5'),
(11,'Питкяранта','Победы','8'),
(12,'Питкяранта','Победы','9'),
(13,'Питкяранта','Победы','11'),
(14,'Питкяранта','Привокзальная','15'),
(15,'Питкяранта','Привокзальная','17'),
(16,'Питкяранта','Пушкина','6'),
(17,'Питкяранта','Рудакова','1'),
(18,'Питкяранта','Рудакова','12'),
(19,'Питкяранта','Рудакова','2'),
(20,'Питкяранта','Рудакова','6'),
(21,'Питкяранта','Титова','4'),
(22,'Питкяранта','Титова','5'),
(23,'Питкяранта','Привокзальная','21'),
(24,'Питкяранта','Гоголя','14'),
(25,'Питкяранта','Гоголя','13'),
(26,'Питкяранта','Гоголя','4'),
(27,'Питкяранта','Ленина','44'),
(28,'Питкяранта','Парковая','4'),
(29,'Питкяранта','Парковая','3'),
(30,'Питкяранта','Парковая','6'),
(31,'Питкяранта','Ленина','13'),
(32,'Питкяранта','Гоголя','6'),
(33,'Питкяранта','Титова','2'),
(34,'Питкяранта','Рудакова','4');
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
  `access_until` datetime DEFAULT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `role` enum('user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients_tmp`
--

LOCK TABLES `clients_tmp` WRITE;
/*!40000 ALTER TABLE `clients_tmp` DISABLE KEYS */;
INSERT INTO `clients_tmp` VALUES
(1,'1 2 3','+79992558595','$2b$10$Ib460/V/mL1tgh0NGh6c5O2veWzKWoWoZ9PdYRjGZl1mcrw63MgQ6','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiIrNzk5OTI1NTg1OTUiLCJyb2xlIjoidXNlciIsIm9yaWdpbiI6InRlbXAiLCJpYXQiOjE3NDcyOTg4ODgsImV4cCI6MTc0NzMwMjQ4OH0.FI5cNVTnd8v3AwNxTJ8mk5GlTExE4p1kVOKwSBQQTSM','2025-05-22 08:47:21','2025-05-15 11:47:21','user');
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
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `clients_tmp_addresses_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients_tmp` (`id`) ON DELETE CASCADE,
  CONSTRAINT `clients_tmp_addresses_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients_tmp_addresses`
--

LOCK TABLES `clients_tmp_addresses` WRITE;
/*!40000 ALTER TABLE `clients_tmp_addresses` DISABLE KEYS */;
INSERT INTO `clients_tmp_addresses` VALUES
(1,1,10),
(2,1,11),
(3,1,13);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dvr`
--

LOCK TABLES `dvr` WRITE;
/*!40000 ALTER TABLE `dvr` DISABLE KEYS */;
INSERT INTO `dvr` VALUES
(1,'DVR 1','/data/dvr'),
(2,'DVR 2','/data/dvr2'),
(3,'DVR 3','/data/dvr');
/*!40000 ALTER TABLE `dvr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `title` varchar(100) DEFAULT NULL,
  `cdn_url` text DEFAULT 'http://localhost:8888',
  `pubt` varchar(255) DEFAULT NULL,
  `privt` varchar(255) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES
('NetOnline | Камеры в вашем городе','http://video.local','_pubcam','_privcam','root','kjifHm11.06!');
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
  `role` enum('user','moderator','admin') DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `token` (`token`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'admin','$2b$10$KKdSqzv4YARD6AfifoYTuOahBz8W.kPXGZZioxy7Fyh.LgyJkzEA.','127.0.0.1','2025-05-15 10:51:43',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwib3JpZ2luIjoicGVybSIsImlhdCI6MTc0NzM4OTg3MSwiZXhwIjoxNzQ3MzkzNDcxfQ.qJx37QL2Q4ZMObohbJShNFlT7n5Xuka9ZihS9CBXxec','admin');
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
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webcam`
--

LOCK TABLES `webcam` WRITE;
/*!40000 ALTER TABLE `webcam` DISABLE KEYS */;
INSERT INTO `webcam` VALUES
(2,'0g13s0af',' Вход Стоянка Клуб','rtsp://stream033:stream03@10.200.1.71:554/',1,1,'private',86400),
(4,'lf6ln91w','Выход','rtsp://stream033:stream03@10.200.1.18:554/',1,1,'private',86400),
(5,'d6mr9ro9','Гоголя 13','rtsp://stream033:stream033@10.200.1.10:554/cam/realmonitor?channel=1&subtype=0',1,25,'public',86400),
(6,'7n6nvzzy','Гоголя 14 (Перекресток)','rtsp://stream033:stream03@10.200.1.47:554/',1,24,'public',86400),
(7,'9pc4hufh','Гоголя 4','rtsp://strim:FF12345FF@10.200.1.1:554/',1,26,'public',86400),
(8,'xpge11u4','Бочка','rtsp://stream033:stream03@10.200.1.54:554/stream1',1,1,'private',86400),
(9,'sfr43goc','Лестница','rtsp://stream033:stream033@10.200.1.5/stream1',1,1,'private',86400),
(10,'1h8cl3ib','Гоголя 7, 2 подъезд','rtsp://stream033:stream033@10.200.1.21/stream1',1,2,'private',86400),
(11,'pghwbquk','Горького 36','rtsp://stream:stream@10.200.1.6:554/cam/realmonitor?channel=1&subtype=0',1,3,'private',86400),
(12,'l9yzylxe','Горького 9, 1 подъезд (1)','rtsp://stream033:stream033@10.200.1.33/stream1',1,4,'private',86400),
(13,'0z9mit9m','Горького 9, 1 подъезд (2)','rtsp://stream033:stream033@10.200.1.34/stream1',1,4,'private',86400),
(14,'oplsjv0t','Горького 9, 5 подъезд (1)','rtsp://stream033:stream033@10.200.1.35/stream1',1,4,'private',86400),
(15,'lqzhtwu2','Горького 9, 5 подъезд (2)','rtsp://stream033:stream033@10.200.1.36/stream1',1,4,'private',86400),
(16,'jb015i1s','Ленина 15','rtsp://stream033:stream03@10.200.1.42:554/',1,5,'public',86400),
(17,'y5257rcc','Ленина 18','rtsp://stream033:stream03@10.200.1.4:554/',1,6,'public',86400),
(18,'cs8yblso','Ленина 27, Парк','rtsp://stream033:stream03@10.200.1.43:554/stream1',1,7,'public',86400),
(21,'evrg6x9t','Ленина 27, 1 подъезд','rtsp://stream033:stream03@10.200.1.28:554/stream1',1,7,'private',86400),
(23,'lv7aqa7b','Ленина 27, 4 подъезд','rtsp://stream033:stream03@10.200.1.64:554/stream1',1,7,'private',86400),
(24,'fmvh09vv','Ленина 44','rtsp://stream033:stream03@10.200.1.41/stream1',1,27,'public',86400),
(25,'2jwu8tif','Парковая 3','rtsp://stream1810:stream1124@10.2.3.212:554/cam/realmonitor?channel=1&subtype=0',1,29,'private',86400),
(26,'x4mmmkv9','Парковая 4','rtsp://stream033:stream03@10.200.1.48:554',1,28,'private',86400),
(27,'vbwbsf7n','Парковая 6','rtsp://stream033:stream033@10.200.1.37/stream1',1,30,'private',86400),
(28,'flbtz1vk','Перекресток Горького - Калинина','rtsp://stream033:stream03@10.200.1.3:554/',1,3,'public',86400),
(29,'l4omeaf8','Победа 4, 1 подъезд','rtsp://stream033:stream03@10.200.1.75:554/',1,9,'private',86400),
(30,'w5qybuvf','Площадь Ленина','rtsp://stream033:stream033@10.200.1.30/stream1',1,31,'public',86400),
(31,'15cxxy06','Победы 1, 1 подъезд','rtsp://stream033:stream03@10.200.1.31/stream1',1,8,'private',86400),
(32,'s74umxo3','Победы 1, 6 подъезд','rtsp://stream033:stream03@10.200.1.40/stream1',1,8,'private',86400),
(33,'knb593bp','Победы 11, Парковка','rtsp://stream033:stream03@10.200.1.63:554/stream1',1,13,'private',86400),
(34,'6peyik1s','Победы 11, 1 подъезд','rtsp://stream033:stream03@10.200.1.61:554/stream1',1,13,'private',86400),
(35,'2dhg8hrw','Победы 11, 4 подъезд','rtsp://stream033:stream03@10.200.1.62:554/stream1',1,13,'private',86400),
(36,'y4132jmi','Победы 4, 2 подъезд','rtsp://stream033:stream03@10.200.1.73:554/',1,9,'private',86400),
(37,'pbgh6hxc','Победы 4, 3 подъезд','rtsp://stream033:stream03@10.200.1.72:554/',1,9,'private',86400),
(38,'9t9af01x','Победы 4, 4 подъезд','rtsp://stream033:stream03@10.200.1.74:554/',1,9,'private',86400),
(39,'bbgo7h70','Победы 5, Парковка','rtsp://stream033:stream033@10.200.1.53/cam/realmonitor?channel=1&subtype=0',1,10,'private',86400),
(40,'ltpcqw6u','Победы 5, 2 подъезд','rtsp://stream033:stream033@10.200.1.20:554/cam/realmonitor?channel=1&subtype=0',1,10,'private',86400),
(41,'jtw3ijjm','Победы 5, 4 подъезд','rtsp://stream033:stream033@10.200.1.19/stream1',1,10,'private',86400),
(42,'0gbjmzkh','Победы 8, 4 подъезд','rtsp://stream033:stream03@10.200.1.16/stream1',1,11,'private',86400),
(43,'1soh8w0a','Победы 8, 7 подъезд','rtsp://stream033:stream033@10.200.1.17/stream1',1,11,'private',86400),
(44,'o7f20dj6','Победы 9, 1 подъезд','rtsp://10.200.1.15:554/user=stream&password=stream282&channel=1&stream=0.sdp?',1,12,'private',86400),
(45,'yb93x4ij','Привокзальная 15, 1 подъезд','rtsp://stream:stream282@10.200.1.14:554/cam/realmonitor?channel=1&subtype=0',1,14,'private',86400),
(46,'hr81v15t','Привокзальная 15, 2 подъезд','rtsp://stream:stream282@10.200.1.13:554/cam/realmonitor?channel=1&subtype=0',1,14,'private',86400),
(47,'tgztx9j1','Привокзальная 15, улица 1','rtsp://stream033:stream033@10.200.1.8/stream1',1,14,'private',86400),
(48,'gdfub42o','Привокзальная 15, улица 2','rtsp://stream:stream282@10.200.1.12/stream1',1,14,'private',0),
(49,'1kiry26k','Привокзальная 15, улица 3','rtsp://stream033:stream033@10.200.1.32/stream1',1,14,'private',86400),
(50,'0e4vt5sy','Привокзальная 17','rtsp://stream033:stream033@10.200.1.26/stream1',1,15,'private',86400),
(51,'c1gtj3bq','Привокзальная 21','rtsp://stream033:stream03@10.200.1.49:554/',1,23,'public',86400),
(52,'hye3d16i','Пушкина 4','rtsp://stream033:stream033@10.200.1.39/stream1',1,16,'private',86400),
(53,'5e0mxnzh','Пушкина 6, 1 подъезд, 3 этаж','rtsp://stream033:stream03@10.1.0.252:554/',1,1,'private',86400),
(54,'cyafwufa','Пушкина 6, 4 подъезд, 5 этаж','rtsp://stream033:stream03@10.200.1.60:554/',1,16,'private',86400),
(55,'pmrc8d7k','Пушкина 6, 1 подъезд','rtsp://stream033:stream03@10.200.1.44/stream1',1,16,'private',86400),
(56,'hn90ejcq','Пушкина 6, 4 подъезд','rtsp://stream033:stream03@10.200.1.45/stream1',1,16,'private',86400),
(57,'wycn4wl3','Рудакова 1, 1 подъезд','rtsp://stream033:stream03@10.200.1.66:554/',1,17,'private',86400),
(58,'5ojw9ti6','Рудакова 1, 8 подъезд','rtsp://stream033:stream03@10.200.1.65:554/',1,17,'private',86400),
(59,'p3e6a4y2','Рудакова 1, 4 подъезд','rtsp://stream033:stream03@10.200.1.68:554/',1,17,'private',86400),
(60,'3m6ktilh','Рудакова 1, Мусорные баки','rtsp://stream033:stream03@10.200.1.67:554/',1,17,'private',86400),
(61,'3w7ghk77','Рудакова 1, подъезды 5-6','rtsp://stream033:stream03@10.200.1.70:554/',1,17,'private',86400),
(62,'f670q87f','Рудакова 1, 4 подъезд','rtsp://stream033:stream03@10.200.1.69:554/',1,17,'private',86400),
(63,'4lswm42e','Рудакова 12Б','rtsp://stream033:stream03@10.200.1.76:554/',1,18,'private',86400),
(64,'4jk1tueq','Рудакова 2, (Ozon - Wildberries)','rtsp://stream033:Stream033@10.200.1.51/stream1',1,17,'private',86400),
(65,'wzye025n','Рудакова 6, Детская Площадка','rtsp://stream033:stream033@10.200.1.22/stream1',1,20,'private',86400),
(66,'az8yz7a0','Рудакова 6, 1 подъезд','rtsp://stream033:stream033@10.200.1.23/stream1',1,20,'private',86400),
(67,'es3mxjoz','Рудакова 6, 1 подъезд (Парковка)','rtsp://stream033:stream033@10.200.1.25/stream1',1,20,'private',86400),
(68,'pqoj28a8','Рудакова 6, 2 подъезд','rtsp://stream033:stream033@10.200.1.24/stream1',1,20,'private',86400),
(69,'9aktee79','Стадион','rtsp://stream033:stream033@10.200.1.9:554/cam/realmonitor?channel=1&subtype=0',1,32,'public',86400),
(70,'fmnckwnh','Титова 2, Вокзал','rtsp://stream033:stream03@10.200.1.46:554/',1,33,'public',86400),
(71,'3c5l3e8y','Титова 4, 4 подъезд','rtsp://stream033:stream033@10.200.1.27/stream1',1,21,'private',86400),
(72,'3pedvd1j','Титова 5, 1 подъезд','rtsp://admin:w45683P7N35@10.200.1.81:554/ISAPI/Streaming/Channels/101',1,22,'private',172800),
(73,'bc0nfosq','Титова 5, 1 подъезд (2)','rtsp://stream033:stream03@10.200.1.29:554/',1,22,'private',86400),
(74,'n6krffw0','Титова 5, 2 подъезд','rtsp://admin:w45683P7N35@10.200.1.79:554/ISAPI/Streaming/Channels/101',1,22,'private',86400),
(75,'nxqml02t','Титова 5, 2 подъезд (2)','rtsp://stream033:stream03@10.200.1.77:554/',1,22,'private',86400),
(76,'zhemphxk','Титова 5, 3 подъезд','rtsp://admin:w45683P7N35@10.200.1.78:554/ISAPI/Streaming/Channels/101',1,22,'private',86400),
(77,'ibnq54oh','Хоккейная коробка','rtsp://stream033:stream033@10.200.1.38/stream1',1,34,'public',86400);
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

-- Dump completed on 2025-05-16 13:15:45
