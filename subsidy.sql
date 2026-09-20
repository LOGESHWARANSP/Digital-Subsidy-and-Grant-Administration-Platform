-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: subsidy
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `application_date` date DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `requested_amount` double DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `scheme_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  `status_updated_date` datetime(6) DEFAULT NULL,
  `eligibility_score` int DEFAULT NULL,
  `routing_status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbjcv8o71mk7sxgnmpinhpu16v` (`scheme_id`),
  KEY `FKldca8xj6lqb3rsqawrowmkqbg` (`user_id`),
  CONSTRAINT `FKbjcv8o71mk7sxgnmpinhpu16v` FOREIGN KEY (`scheme_id`) REFERENCES `scheme` (`id`),
  CONSTRAINT `FKldca8xj6lqb3rsqawrowmkqbg` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
INSERT INTO `application` VALUES (47,'2026-09-11',NULL,NULL,'DISBURSED',7,13,NULL,'2026-09-11 16:21:13.642466',100,'FAST_TRACK'),(48,'2026-09-13',NULL,NULL,'DISBURSED',1,15,NULL,'2026-09-20 07:31:42.388641',100,'FAST_TRACK'),(50,'2026-09-14',NULL,NULL,'DISBURSED',6,17,NULL,'2026-09-19 10:39:10.448363',100,'FAST_TRACK'),(53,'2026-09-19',NULL,NULL,'DISBURSED',1,13,NULL,'2026-09-19 10:34:43.547448',100,'FAST_TRACK'),(60,'2026-09-19',NULL,NULL,'DISBURSED',7,22,NULL,'2026-09-19 18:47:42.897873',100,'FAST_TRACK');
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_users`
--

DROP TABLE IF EXISTS `auth_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6jqfsuvys3lan090p4mk16a5t` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_users`
--

LOCK TABLES `auth_users` WRITE;
/*!40000 ALTER TABLE `auth_users` DISABLE KEYS */;
INSERT INTO `auth_users` VALUES (14,'2022it0045@svce.ac.in','$2a$10$ApEj0YQCOFFs2vb38HCgt.OrdH98j9LKsX7YZWyb5UeF98IuzCmrm','USER'),(16,'digitalsubsidy@gmail.com','$2a$10$xLVTDs9QzYgDhA3FLsflgOfLGcj140e8JVI.MKMydWRUnWiIb1cKO','USER'),(19,'personallogesh25@gmail.com','$2a$10$RLOkqW.lRgMwFGv80dPxWu2nEmp6txGT07LhH16GRPt9jg1Z5pdtC','USER'),(25,'lw27169@gmail.com','$2a$10$rG3tMoU74Y9O13JWJpKPbeQRkxuzpBv405r1zA5O9INovUYC6bpiu','USER');
/*!40000 ALTER TABLE `auth_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bank_details`
--

DROP TABLE IF EXISTS `bank_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_holder_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `ifsc_code` varchar(255) DEFAULT NULL,
  `verification_status` varchar(255) DEFAULT NULL,
  `application_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt0860pm8qvfg33nb9wbi301ss` (`application_id`),
  CONSTRAINT `FK84xckh850pdjqmf0usk78efam` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank_details`
--

LOCK TABLES `bank_details` WRITE;
/*!40000 ALTER TABLE `bank_details` DISABLE KEYS */;
INSERT INTO `bank_details` VALUES (15,'Logeshwaran','222244448888','Punjab National Bank','Madurai','SBIN0001111','VERIFIED',47),(16,'manoj Kumar','098765432101','Indian Bank','Arani','IBIN0876543','VERIFIED',48),(17,'Varun Shah S','123456789010','Union Bank of India','cheyyar','UBIN0001234','VERIFIED',50),(20,'Vedhavali','222244448888','Bank of Baroda','Arani','SBIN0001111','VERIFIED',53),(26,'Logeshwaran','123456789010','Union Bank of India','Arani','AXIS0123456','VERIFIED',60);
/*!40000 ALTER TABLE `bank_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compliance_milestones`
--

DROP TABLE IF EXISTS `compliance_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compliance_milestones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed_date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `installment_number` int DEFAULT NULL,
  `milestone_name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `utilization_proof` varchar(255) DEFAULT NULL,
  `application_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtffaevlouwotnh5h9efgq6bsj` (`application_id`),
  CONSTRAINT `FKtffaevlouwotnh5h9efgq6bsj` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compliance_milestones`
--

LOCK TABLES `compliance_milestones` WRITE;
/*!40000 ALTER TABLE `compliance_milestones` DISABLE KEYS */;
INSERT INTO `compliance_milestones` VALUES (14,'2026-09-11','Submit utilization proof for Installment 1','2026-10-11',1,'Utilization Proof 1','COMPLETED','uploads\\documents\\1789123928063_testing_certification.pdf',47),(15,'2026-09-11','Submit utilization proof for Installment 2','2026-11-10',2,'Utilization Proof 2','COMPLETED','uploads\\documents\\1789124582186_testing_certification.pdf',47),(16,'2026-09-20','Submit utilization proof for Installment 1','2026-10-13',1,'Utilization Proof 1','COMPLETED','uploads\\documents\\1789869566476_Utilization_proof.pdf',48),(17,'2026-09-20','Submit utilization proof for Installment 2','2026-11-12',2,'Utilization Proof 2','COMPLETED','uploads\\documents\\1789869680081_Utilization_proof.pdf',48),(18,'2026-09-14','Submit utilization proof for Installment 1','2026-10-14',1,'Utilization Proof 1','COMPLETED','uploads\\documents\\1789397472092_Logeshwaran_resume.pdf',50),(19,'2026-09-19','Submit utilization proof for Installment 2','2026-11-13',2,'Utilization Proof 2','COMPLETED','uploads\\documents\\1789794534898_Utilization_proof.pdf',50),(22,'2026-09-19','Submit utilization proof for Installment 1','2026-10-19',1,'Utilization Proof 1','COMPLETED','uploads\\documents\\1789794149371_Utilization_proof.pdf',53),(23,'2026-09-19','Submit utilization proof for Installment 2','2026-11-18',2,'Utilization Proof 2','COMPLETED','uploads\\documents\\1789794269411_Utilization_proof.pdf',53),(36,'2026-09-19','Submit utilization proof for Installment 1','2026-10-19',1,'Utilization Proof 1','COMPLETED','uploads\\documents\\1789823773075_Utilization_proof.pdf',60),(37,'2026-09-19','Submit utilization proof for Installment 2','2026-11-18',2,'Utilization Proof 2','COMPLETED','uploads\\documents\\1789823837888_Utilization_proof.pdf',60);
/*!40000 ALTER TABLE `compliance_milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disbursements`
--

DROP TABLE IF EXISTS `disbursements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disbursements` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `disbursement_date` date DEFAULT NULL,
  `installment_number` int DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `transaction_reference` varchar(255) DEFAULT NULL,
  `application_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3r8dlxpbgaiq0xinctr2ffbwv` (`application_id`),
  CONSTRAINT `FK3r8dlxpbgaiq0xinctr2ffbwv` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disbursements`
--

LOCK TABLES `disbursements` WRITE;
/*!40000 ALTER TABLE `disbursements` DISABLE KEYS */;
INSERT INTO `disbursements` VALUES (27,12000,'2026-09-11',1,'PAID','TXN1789123906884',47),(28,9000,'2026-09-11',2,'PAID','TXN1789123945524',47),(29,9000,'2026-09-11',3,'PAID','TXN1789124600220',47),(30,12000,'2026-09-13',1,'PAID','TXN1789267066555',48),(31,20000,'2026-09-14',1,'PAID','TXN1789397433801',50),(32,15000,'2026-09-14',2,'PAID','TXN1789397495762',50),(33,20000,'2026-09-19',1,'PAID','TXN1789792281311',53),(34,15000,'2026-09-19',2,'PAID','TXN1789794176501',53),(35,15000,'2026-09-19',3,'PAID','TXN1789794283514',53),(36,15000,'2026-09-19',3,'PAID','TXN1789794550426',50),(39,30000,'2026-09-19',1,'PAID','TXN1789823744832',60),(40,22500,'2026-09-19',2,'PAID','TXN1789823799423',60),(41,22500,'2026-09-19',3,'PAID','TXN1789823862880',60),(42,9000,'2026-09-20',2,'PAID','TXN1789869592917',48),(43,9000,'2026-09-20',3,'PAID','TXN1789869702372',48);
/*!40000 ALTER TABLE `disbursements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `document_name` varchar(255) DEFAULT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `document_type` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `verification_status` varchar(255) DEFAULT NULL,
  `application_id` bigint DEFAULT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhj21w3xocd4tcdojnw8abg3v4` (`application_id`),
  CONSTRAINT `FKhj21w3xocd4tcdojnw8abg3v4` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=185 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (127,'testing_certification.pdf','uploads\\documents\\testing_certification.pdf','Aadhaar Card','2026-09-11 16:18:37.998473','PENDING',47,NULL),(128,'testing_certification.pdf','uploads\\documents\\testing_certification.pdf','Farmer ID','2026-09-11 16:18:38.050460','PENDING',47,NULL),(129,'testing_certification.pdf','uploads\\documents\\testing_certification.pdf','Land Ownership Certificate','2026-09-11 16:18:38.096104','PENDING',47,NULL),(130,'testing_certification.pdf','uploads\\documents\\1789123928063_testing_certification.pdf','UTILIZATION_PROOF_1','2026-09-11 16:22:08.072354','VERIFIED',47,NULL),(131,'testing_certification.pdf','uploads\\documents\\1789123967858_testing_certification.pdf','UTILIZATION_PROOF_2','2026-09-11 16:22:47.865376','REJECTED',47,'wrong pdf'),(132,'testing_certification.pdf','uploads\\documents\\1789124023582_testing_certification.pdf','UTILIZATION_PROOF_2','2026-09-11 16:23:43.590101','REJECTED',47,'redo'),(133,'testing_certification.pdf','uploads\\documents\\1789124582186_testing_certification.pdf','UTILIZATION_PROOF_2','2026-09-11 16:33:02.197823','VERIFIED',47,NULL),(134,'testing_certification.pdf','uploads\\documents\\testing_certification.pdf','Aadhaar Card','2026-09-13 07:42:54.860251','PENDING',48,NULL),(135,'testing_certification.pdf','uploads\\documents\\testing_certification.pdf','Income Certificate','2026-09-13 07:42:54.899888','PENDING',48,NULL),(136,'testing_certification.pdf','uploads\\documents\\testing_certification.pdf','Employment Certificate','2026-09-13 07:42:54.945141','PENDING',48,NULL),(140,'Logeshwaran_resume.pdf','uploads\\documents\\Logeshwaran_resume.pdf','Aadhaar Card','2026-09-14 20:14:54.615238','PENDING',50,NULL),(141,'Logeshwaran_resume.pdf','uploads\\documents\\Logeshwaran_resume.pdf','Income Certificate','2026-09-14 20:14:54.667253','PENDING',50,NULL),(142,'Logeshwaran_resume.pdf','uploads\\documents\\Logeshwaran_resume.pdf','Business Registration Certificate','2026-09-14 20:14:54.726652','PENDING',50,NULL),(143,'Logeshwaran_resume.pdf','uploads\\documents\\1789397472092_Logeshwaran_resume.pdf','UTILIZATION_PROOF_1','2026-09-14 20:21:12.102195','VERIFIED',50,NULL),(150,'aadhar.pdf','uploads\\documents\\aadhar.pdf','Aadhaar Card','2026-09-19 09:52:34.787528','PENDING',53,NULL),(151,'income.pdf','uploads\\documents\\income.pdf','Income Certificate','2026-09-19 09:52:34.824942','PENDING',53,NULL),(152,'business.pdf','uploads\\documents\\business.pdf','Bonafide Certificate','2026-09-19 09:52:34.860462','PENDING',53,NULL),(153,'Utilization_proof.pdf','uploads\\documents\\1789793310919_Utilization_proof.pdf','UTILIZATION_PROOF_1','2026-09-19 10:18:30.929744','REJECTED',53,'wrong proof'),(154,'Utilization_proof.pdf','uploads\\documents\\1789794101090_Utilization_proof.pdf','UTILIZATION_PROOF_1','2026-09-19 10:31:41.097045','REJECTED',53,'Invalid'),(155,'Utilization_proof.pdf','uploads\\documents\\1789794149371_Utilization_proof.pdf','UTILIZATION_PROOF_1','2026-09-19 10:32:29.372912','VERIFIED',53,NULL),(156,'Utilization_proof.pdf','uploads\\documents\\1789794217596_Utilization_proof.pdf','UTILIZATION_PROOF_2','2026-09-19 10:33:37.597645','REJECTED',53,'Invalid'),(157,'Utilization_proof.pdf','uploads\\documents\\1789794269411_Utilization_proof.pdf','UTILIZATION_PROOF_2','2026-09-19 10:34:29.416523','VERIFIED',53,NULL),(158,'Utilization_proof.pdf','uploads\\documents\\1789794534898_Utilization_proof.pdf','UTILIZATION_PROOF_2','2026-09-19 10:38:54.900620','VERIFIED',50,NULL),(178,'aadhar.pdf','uploads\\documents\\aadhar.pdf','Aadhaar Card','2026-09-19 18:38:55.764303','PENDING',60,NULL),(179,'farmer id.pdf','uploads\\documents\\farmer id.pdf','Farmer ID','2026-09-19 18:38:55.801747','PENDING',60,NULL),(180,'land owndership.pdf','uploads\\documents\\land owndership.pdf','Land Ownership Certificate','2026-09-19 18:38:55.838356','PENDING',60,NULL),(181,'Utilization_proof.pdf','uploads\\documents\\1789823773075_Utilization_proof.pdf','UTILIZATION_PROOF_1','2026-09-19 18:46:13.086275','VERIFIED',60,NULL),(182,'Utilization_proof.pdf','uploads\\documents\\1789823837888_Utilization_proof.pdf','UTILIZATION_PROOF_2','2026-09-19 18:47:17.892540','VERIFIED',60,NULL),(183,'Utilization_proof.pdf','uploads\\documents\\1789869566476_Utilization_proof.pdf','UTILIZATION_PROOF_1','2026-09-20 07:29:26.482956','VERIFIED',48,NULL),(184,'Utilization_proof.pdf','uploads\\documents\\1789869680081_Utilization_proof.pdf','UTILIZATION_PROOF_2','2026-09-20 07:31:20.089747','VERIFIED',48,NULL);
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grant_slab`
--

DROP TABLE IF EXISTS `grant_slab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grant_slab` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `grant_amount` double DEFAULT NULL,
  `maximum_income` double DEFAULT NULL,
  `minimum_income` double DEFAULT NULL,
  `scheme_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkdqo94qkrce71aki8fjiss1e0` (`scheme_id`),
  CONSTRAINT `FKkdqo94qkrce71aki8fjiss1e0` FOREIGN KEY (`scheme_id`) REFERENCES `scheme` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grant_slab`
--

LOCK TABLES `grant_slab` WRITE;
/*!40000 ALTER TABLE `grant_slab` DISABLE KEYS */;
INSERT INTO `grant_slab` VALUES (44,75000,100000,0,5),(45,50000,200000,100001,5),(46,30000,400000,200001,5),(47,100000,100000,0,6),(48,75000,300000,100001,6),(49,50000,500000,300001,6),(50,30000,600000,500001,6),(57,100000,200000,0,8),(58,75000,300000,200001,8),(59,50000,400000,300001,8),(60,20000,300000,100001,9),(64,100000,200000,0,11),(65,75000,300000,200001,11),(66,50000,400000,300001,11),(67,50000,200000,0,12),(68,30000,400000,200001,12),(82,100000,100000,0,4),(83,75000,200000,100001,4),(84,50000,300000,200001,4),(85,30000,400000,300001,4),(86,75000,100000,0,1),(87,50000,200000,100001,1),(88,30000,300000,200001,1),(89,100000,300000,0,18),(97,100000,100000,0,7),(98,75000,200000,100001,7),(99,50000,300000,200001,7),(100,30000,400000,300001,7),(101,50000,200000,0,27);
/*!40000 ALTER TABLE `grant_slab` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `installment_plans`
--

DROP TABLE IF EXISTS `installment_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `installment_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `installment_number` int DEFAULT NULL,
  `percentage` double DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `application_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdw7pajgvajb0em9wharjr1i4e` (`application_id`),
  CONSTRAINT `FKdw7pajgvajb0em9wharjr1i4e` FOREIGN KEY (`application_id`) REFERENCES `application` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `installment_plans`
--

LOCK TABLES `installment_plans` WRITE;
/*!40000 ALTER TABLE `installment_plans` DISABLE KEYS */;
INSERT INTO `installment_plans` VALUES (16,12000,1,40,'PAID',47),(17,9000,2,30,'PAID',47),(18,9000,3,30,'PAID',47),(19,12000,1,40,'PAID',48),(20,9000,2,30,'PAID',48),(21,9000,3,30,'PAID',48),(22,20000,1,40,'PAID',50),(23,15000,2,30,'PAID',50),(24,15000,3,30,'PAID',50),(28,20000,1,40,'PAID',53),(29,15000,2,30,'PAID',53),(30,15000,3,30,'PAID',53),(49,30000,1,40,'PAID',60),(50,22500,2,30,'PAID',60),(51,22500,3,30,'PAID',60);
/*!40000 ALTER TABLE `installment_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regional_allocations`
--

DROP TABLE IF EXISTS `regional_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regional_allocations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `allocated_budget` double DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `used_budget` double DEFAULT NULL,
  `scheme_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK337klcid1vqsj38k868x60cqv` (`scheme_id`),
  CONSTRAINT `FK337klcid1vqsj38k868x60cqv` FOREIGN KEY (`scheme_id`) REFERENCES `scheme` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=860 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regional_allocations`
--

LOCK TABLES `regional_allocations` WRITE;
/*!40000 ALTER TABLE `regional_allocations` DISABLE KEYS */;
INSERT INTO `regional_allocations` VALUES (1,400000,'Kerala',0,1),(2,400000,'Nagaland',0,1),(3,400000,'Nagaland',292500,6),(12,400000,'Nagaland',0,18),(16,400000,'Nagaland',0,12),(18,400000,'Nagaland',0,9),(19,400000,'Nagaland',0,8),(20,400000,'Nagaland',0,7),(21,400000,'Nagaland',0,5),(22,400000,'Nagaland',0,4),(31,400000,'Tamil Nadu',0,18),(35,400000,'Tamil Nadu',0,12),(37,400000,'Tamil Nadu',0,9),(38,400000,'Tamil Nadu',0,8),(39,400000,'Tamil Nadu',30000,7),(40,400000,'Tamil Nadu',50000,6),(41,400000,'Tamil Nadu',0,5),(42,400000,'Tamil Nadu',0,4),(43,400000,'Tamil Nadu',50000,1),(52,400000,'Andhra Pradesh',0,18),(56,400000,'Andhra Pradesh',0,12),(58,400000,'Andhra Pradesh',0,9),(59,400000,'Andhra Pradesh',0,8),(60,400000,'Andhra Pradesh',0,7),(61,400000,'Andhra Pradesh',0,6),(62,400000,'Andhra Pradesh',0,5),(63,400000,'Andhra Pradesh',0,4),(64,400000,'Andhra Pradesh',0,1),(67,400000,'Tamil Nadu',0,11),(69,400000,'Karnataka',0,1),(72,400000,'Telangana',0,1),(73,400000,'Maharashtra',0,1),(74,400000,'Madhya Pradesh',0,1),(75,400000,'Himachal Pradesh',0,1),(76,400000,'Uttar Pradesh',0,1),(77,400000,'Rajasthan',0,1),(78,400000,'Gujarat',0,1),(79,400000,'West Bengal',0,1),(80,400000,'Odisha',0,1),(81,400000,'Punjab',0,1),(82,400000,'Haryana',0,1),(83,400000,'Haryana',0,4),(84,400000,'Punjab',0,4),(85,400000,'Odisha',0,4),(86,400000,'West Bengal',0,4),(87,400000,'Gujarat',0,4),(88,400000,'Rajasthan',0,4),(89,400000,'Uttar Pradesh',0,4),(90,400000,'Himachal Pradesh',0,4),(91,400000,'Madhya Pradesh',0,4),(92,400000,'Maharashtra',0,4),(93,400000,'Telangana',0,4),(94,400000,'Kerala',0,4),(95,400000,'Karnataka',0,4),(96,400000,'Haryana',0,5),(97,400000,'Punjab',0,5),(98,400000,'Odisha',0,5),(99,400000,'West Bengal',0,5),(100,400000,'Gujarat',0,5),(101,400000,'Rajasthan',0,5),(102,400000,'Uttar Pradesh',0,5),(103,400000,'Himachal Pradesh',0,5),(104,400000,'Madhya Pradesh',0,5),(105,400000,'Maharashtra',0,5),(106,400000,'Telangana',0,5),(107,400000,'Kerala',0,5),(108,400000,'Karnataka',0,5),(109,400000,'Haryana',30000,6),(110,400000,'Punjab',0,6),(111,400000,'Odisha',0,6),(112,400000,'West Bengal',0,6),(113,400000,'Gujarat',0,6),(114,400000,'Rajasthan',0,6),(115,400000,'Uttar Pradesh',0,6),(116,400000,'Himachal Pradesh',0,6),(117,400000,'Madhya Pradesh',0,6),(118,400000,'Maharashtra',0,6),(119,400000,'Telangana',0,6),(120,400000,'Kerala',0,6),(121,400000,'Karnataka',0,6),(122,400000,'Haryana',0,7),(123,400000,'Punjab',0,7),(124,400000,'Odisha',0,7),(125,400000,'West Bengal',0,7),(126,400000,'Gujarat',0,7),(127,400000,'Rajasthan',0,7),(128,400000,'Uttar Pradesh',0,7),(129,400000,'Himachal Pradesh',0,7),(130,400000,'Madhya Pradesh',0,7),(131,400000,'Maharashtra',0,7),(132,400000,'Telangana',0,7),(133,400000,'Kerala',0,7),(134,400000,'Karnataka',0,7),(135,400000,'Haryana',0,8),(136,400000,'Punjab',0,8),(137,400000,'Odisha',0,8),(138,400000,'West Bengal',0,8),(139,400000,'Gujarat',0,8),(140,400000,'Rajasthan',0,8),(141,400000,'Uttar Pradesh',0,8),(142,400000,'Himachal Pradesh',0,8),(143,400000,'Madhya Pradesh',0,8),(144,400000,'Maharashtra',0,8),(145,400000,'Telangana',0,8),(146,400000,'Kerala',0,8),(147,400000,'Karnataka',0,8),(148,400000,'Haryana',0,9),(149,400000,'Punjab',0,9),(150,400000,'Odisha',0,9),(151,400000,'West Bengal',0,9),(152,400000,'Gujarat',0,9),(153,400000,'Rajasthan',0,9),(154,400000,'Uttar Pradesh',0,9),(155,400000,'Himachal Pradesh',0,9),(156,400000,'Madhya Pradesh',0,9),(157,400000,'Maharashtra',0,9),(158,400000,'Telangana',0,9),(159,400000,'Kerala',0,9),(160,400000,'Karnataka',0,9),(174,400000,'Haryana',0,11),(175,400000,'Punjab',0,11),(176,400000,'Odisha',0,11),(177,400000,'West Bengal',0,11),(178,400000,'Gujarat',0,11),(179,400000,'Rajasthan',0,11),(180,400000,'Uttar Pradesh',0,11),(181,400000,'Himachal Pradesh',0,11),(182,400000,'Madhya Pradesh',0,11),(183,400000,'Maharashtra',0,11),(184,400000,'Telangana',0,11),(185,400000,'Andhra Pradesh',0,11),(186,400000,'Kerala',0,11),(187,400000,'Karnataka',0,11),(188,400000,'Haryana',0,12),(189,400000,'Punjab',0,12),(190,400000,'Odisha',0,12),(191,400000,'West Bengal',0,12),(192,400000,'Gujarat',0,12),(193,400000,'Rajasthan',0,12),(194,400000,'Uttar Pradesh',0,12),(195,400000,'Himachal Pradesh',0,12),(196,400000,'Madhya Pradesh',0,12),(197,400000,'Maharashtra',0,12),(198,400000,'Telangana',0,12),(199,400000,'Kerala',0,12),(200,400000,'Karnataka',0,12),(240,400000,'Haryana',0,18),(241,400000,'Punjab',0,18),(242,400000,'Odisha',0,18),(243,400000,'West Bengal',0,18),(244,400000,'Gujarat',0,18),(245,400000,'Rajasthan',0,18),(246,400000,'Uttar Pradesh',0,18),(247,400000,'Himachal Pradesh',0,18),(248,400000,'Madhya Pradesh',0,18),(249,400000,'Maharashtra',0,18),(250,400000,'Telangana',0,18),(251,400000,'Kerala',0,18),(252,400000,'Karnataka',0,18),(602,400000,'Arunachal Pradesh',0,18),(606,400000,'Arunachal Pradesh',0,12),(607,400000,'Arunachal Pradesh',0,11),(609,400000,'Arunachal Pradesh',0,9),(610,400000,'Arunachal Pradesh',0,8),(611,400000,'Arunachal Pradesh',0,7),(612,400000,'Arunachal Pradesh',0,6),(613,400000,'Arunachal Pradesh',0,5),(614,400000,'Arunachal Pradesh',0,4),(615,400000,'Arunachal Pradesh',0,1),(624,400000,'Assam',0,18),(628,400000,'Assam',0,12),(629,400000,'Assam',0,11),(631,400000,'Assam',0,9),(632,400000,'Assam',0,8),(633,400000,'Assam',0,7),(634,400000,'Assam',0,6),(635,400000,'Assam',0,5),(636,400000,'Assam',0,4),(637,400000,'Assam',0,1),(646,400000,'Bihar',0,18),(650,400000,'Bihar',0,12),(651,400000,'Bihar',0,11),(653,400000,'Bihar',0,9),(654,400000,'Bihar',0,8),(655,400000,'Bihar',0,7),(656,400000,'Bihar',0,6),(657,400000,'Bihar',0,5),(658,400000,'Bihar',0,4),(659,400000,'Bihar',0,1),(668,400000,'Chhattisgarh',0,18),(672,400000,'Chhattisgarh',0,12),(673,400000,'Chhattisgarh',0,11),(675,400000,'Chhattisgarh',0,9),(676,400000,'Chhattisgarh',0,8),(677,400000,'Chhattisgarh',0,7),(678,400000,'Chhattisgarh',0,6),(679,400000,'Chhattisgarh',0,5),(680,400000,'Chhattisgarh',0,4),(681,400000,'Chhattisgarh',0,1),(690,400000,'Goa',0,18),(694,400000,'Goa',0,12),(695,400000,'Goa',0,11),(697,400000,'Goa',0,9),(698,400000,'Goa',0,8),(699,400000,'Goa',0,7),(700,400000,'Goa',0,6),(701,400000,'Goa',0,5),(702,400000,'Goa',0,4),(703,400000,'Goa',0,1),(712,400000,'Jharkhand',0,18),(716,400000,'Jharkhand',0,12),(717,400000,'Jharkhand',0,11),(719,400000,'Jharkhand',0,9),(720,400000,'Jharkhand',0,8),(721,400000,'Jharkhand',0,7),(722,400000,'Jharkhand',0,6),(723,400000,'Jharkhand',0,5),(724,400000,'Jharkhand',0,4),(725,400000,'Jharkhand',0,1),(734,400000,'Manipur',0,18),(738,400000,'Manipur',0,12),(739,400000,'Manipur',0,11),(741,400000,'Manipur',0,9),(742,400000,'Manipur',0,8),(743,400000,'Manipur',0,7),(744,400000,'Manipur',0,6),(745,400000,'Manipur',0,5),(746,400000,'Manipur',0,4),(747,400000,'Manipur',0,1),(756,400000,'Meghalaya',0,18),(760,400000,'Meghalaya',0,12),(761,400000,'Meghalaya',0,11),(763,400000,'Meghalaya',0,9),(764,400000,'Meghalaya',0,8),(765,400000,'Meghalaya',0,7),(766,400000,'Meghalaya',50000,6),(767,400000,'Meghalaya',0,5),(768,400000,'Meghalaya',0,4),(769,400000,'Meghalaya',0,1),(778,400000,'Mizoram',0,18),(782,400000,'Mizoram',0,12),(783,400000,'Mizoram',0,11),(785,400000,'Mizoram',0,9),(786,400000,'Mizoram',0,8),(787,400000,'Mizoram',0,7),(788,400000,'Mizoram',0,6),(789,400000,'Mizoram',0,5),(790,400000,'Mizoram',0,4),(791,400000,'Mizoram',0,1),(792,400000,'Nagaland',0,11),(801,400000,'Sikkim',0,18),(805,400000,'Sikkim',0,12),(806,400000,'Sikkim',0,11),(808,400000,'Sikkim',0,9),(809,400000,'Sikkim',0,8),(810,400000,'Sikkim',0,7),(811,400000,'Sikkim',0,6),(812,400000,'Sikkim',0,5),(813,400000,'Sikkim',0,4),(814,400000,'Sikkim',0,1),(823,400000,'Tripura',0,18),(827,400000,'Tripura',0,12),(828,400000,'Tripura',0,11),(830,400000,'Tripura',0,9),(831,400000,'Tripura',0,8),(832,400000,'Tripura',0,7),(833,400000,'Tripura',0,6),(834,400000,'Tripura',0,5),(835,400000,'Tripura',0,4),(836,400000,'Tripura',0,1),(845,400000,'Uttarakhand',0,18),(849,400000,'Uttarakhand',0,12),(850,400000,'Uttarakhand',0,11),(852,400000,'Uttarakhand',0,9),(853,400000,'Uttarakhand',0,8),(854,400000,'Uttarakhand',0,7),(855,400000,'Uttarakhand',0,6),(856,400000,'Uttarakhand',0,5),(857,400000,'Uttarakhand',0,4),(858,400000,'Uttarakhand',0,1),(859,400000,'Andhra Pradesh',0,27);
/*!40000 ALTER TABLE `regional_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scheme`
--

DROP TABLE IF EXISTS `scheme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scheme` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(1000) DEFAULT NULL,
  `eligible_location` varchar(100) DEFAULT NULL,
  `eligible_occupation` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `maximum_age` int DEFAULT NULL,
  `maximum_amount` double DEFAULT NULL,
  `minimum_age` int DEFAULT NULL,
  `scheme_name` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `required_documents` varchar(255) DEFAULT NULL,
  `eligible_gender` varchar(255) DEFAULT NULL,
  `benefits` varchar(1000) DEFAULT NULL,
  `eligible_beneficiary_category` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scheme`
--

LOCK TABLES `scheme` WRITE;
/*!40000 ALTER TABLE `scheme` DISABLE KEYS */;
INSERT INTO `scheme` VALUES (1,'Financial support for eligible students','ALL','Student','2026-12-31',25,50000,18,'Student Education Subsidy','2026-08-01','ACTIVE','Aadhaar Card,Income Certificate,Bonafide Certificate','ALL','Provides financial assistance to eligible students for their education expenses. The subsidy helps reduce the financial burden of tuition fees, books, and other academic costs. It supports students from eligible income backgrounds and encourages them to continue their education without financial difficulties.','ALL'),(4,'Higher Education Financial Assistance','ALL','Student','2026-12-31',30,100000,18,'Higher Education Assistance','2026-08-01','ACTIVE','Aadhaar Card,Income Certificate,Bonafide Certificate','ALL','Provides financial support to students pursuing higher education. The scheme helps eligible students manage university fees, academic expenses, and other educational costs. It reduces financial pressure on families and encourages students to continue their studies and build better career opportunities.','SC,ST'),(5,'Women Skill Development Support','ALL','Student','2026-11-30',35,75000,18,'Women Skill Development Scheme','2026-08-01','ACTIVE','Aadhaar Card,Income Certificate,Skill Development Certificate','FEMALE','Supports eligible women in developing professional and technical skills. Financial assistance can help cover training and certification expenses. The scheme improves employment opportunities, encourages career development, and helps women gain the skills required for better professional and economic independence.','ALL'),(6,'Small Business Startup Support','ALL','Entrepreneur','2026-12-31',45,NULL,21,'Startup Subsidy Scheme','2026-08-01','ACTIVE','Aadhaar Card,Income Certificate,Business Registration Certificate','ALL','Provides financial assistance to eligible entrepreneurs for starting or developing a small business. The subsidy helps reduce initial business expenses and supports the purchase of essential resources. It encourages entrepreneurship, innovation, and the growth of new businesses.','ALL'),(7,'Farmer Equipment Subsidy','ALL','Farmer','2026-12-31',60,150000,20,'Agricultural Equipment Subsidy','2026-08-01','ACTIVE','Aadhaar Card,Farmer ID,Land Ownership Certificate','ALL','Provides financial assistance to eligible farmers for purchasing agricultural equipment. The scheme helps reduce the cost of modern farming tools and machinery. It supports improved agricultural productivity, reduces manual effort, and encourages farmers to adopt better and more efficient farming practices.','ALL'),(8,'Fishermen Welfare Assistance','ALL','Fisherman','2026-12-31',60,100000,25,'Fishermen Welfare Scheme','2026-08-01','ACTIVE','Aadhaar Card,Income Certificate,Fisherman ID','ALL','Provides financial support to eligible fishermen for improving their livelihood and managing fishing-related expenses. The scheme supports the welfare of fishing communities and helps reduce financial difficulties. It aims to provide better economic security and support sustainable livelihood opportunities.','ALL'),(9,'Senior Citizen Financial Support','ALL','Senior Citizen','2026-12-31',100,60000,60,'Senior Citizen Assistance','2026-08-01','ACTIVE','Aadhaar Card,Age Proof,Income Certificate','ALL','Provides financial assistance to eligible senior citizens to support their daily living needs. The scheme helps reduce financial difficulties and provides additional economic security. It supports the welfare and independence of elderly citizens who meet the required eligibility conditions.','ALL'),(11,'Vocational Training Assistance','Tamil Nadu','Worker','2026-12-31',45,80000,18,'Vocational Training Subsidy','2026-08-01','ACTIVE','Aadhaar Card,Income Certificate,Training Certificate','ALL','Provides financial assistance to eligible individuals pursuing vocational and professional training. The scheme helps cover training-related expenses and supports the development of practical job skills. It improves employment opportunities and helps individuals build stronger careers in their chosen fields.','ALL'),(12,'Disabled Employment Assistance','ALL','DISABLED','2026-12-31',50,120000,22,'Disabled Employment Assistance ','2026-08-01','ACTIVE','Aadhaar Card,Income Certificate,Employment Certificate','ALL','Provides financial assistance to eligible individuals for employment-related needs and professional development. The scheme supports career growth and helps reduce financial barriers faced by workers. It encourages employment participation and provides additional support for building stable career opportunities.','ALL'),(18,'Financial support for farmers adopting modern irrigation systems.','ALL','Farmer','2026-12-31',60,120000,18,'Farmer Irrigation Support Scheme','2026-08-24','ACTIVE','Aadhaar Card,Farmer ID,Land Ownership Certificate','ALL','Helps eligible farmers purchase and install modern irrigation systems. Encourages efficient water management and reduces agricultural expenses. Supports improved crop productivity and promotes sustainable farming practices through financial assistance.','SC,ST'),(27,'Financial assistance for small farmers to improve agricultural activities and purchase essential farming equipment.\n                ','ALL','Farmer','2027-12-31',60,NULL,35,'Small Farmer Development Scheme','2026-09-20','ACTIVE','Aadhaar Card, Land Ownership Proof, Bank Passbook\n                ','ALL','This scheme provides financial assistance to small and marginal farmers for purchasing farming equipment, improving irrigation facilities, increasing agricultural productivity, and enhancing their income and livelihood.          ','ALL');
/*!40000 ALTER TABLE `scheme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'admin@gmail.com','Admin','ad123','ADMIN'),(2,'field@gmail.com','Field Officer','field@123','FIELD_OFFICER'),(11,'district@gmail.com','District Officer','districts123','DISTRICT_OFFICER'),(12,'finance@gmail.com','Finance Officer','finace@123','FINANCE_OFFICER');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `annual_income` double DEFAULT NULL,
  `dateofbirth` date DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `beneficiary_category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (13,200000,'2005-08-25','2022it0045@svce.ac.in','LOGESHWARAN','IT','Tamil Nadu','Student','6369765477','MALE','SC'),(15,300000,'2004-02-24','digitalsubsidy@gmail.com','manoj','kumar','Gujarat','Employee','999944478','MALE','SC'),(17,400000,'2004-02-25','personallogesh25@gmail.com','LOGESHWARAN','IT','Meghalaya','Entrepreneur','6369765477','MALE','MBC'),(22,200000,'2005-08-25','lw27169@gmail.com','LOGESHWARAN','IT','Tamil Nadu','Farmer','6369765477','MALE','BC');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-20 11:40:31
