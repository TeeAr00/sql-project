-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sqlharjoitus
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `expected_query` text NOT NULL,
  `hint` text,
  `class` smallint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
INSERT INTO `exercises` VALUES (1,'Hae 5 ensimmäistä riviä taulusta \"person\".','SELECT * FROM person LIMIT 5;','valitse mistä, mitä, montako',1),(2,'Hae kaikki rivit taulusta \"person\".','SELECT * FROM person;','valitse mitä, mistä',1),(5,'Hae etu- ja sukunimi taulusta \"person\".','SELECT firstname, lastname FROM person;','valitse mitä, mistä',1),(6,'Hae ihmiset joiden tuntipalkka on yli 40','SELECT * FROM person WHERE salary > 40;','valitse mitä, mistä, rajaus',2),(7,'Hae projektit jotka ovat paikassa Turku tai Kuopio','SELECT * FROM project WHERE place IN (\"TURKU\", \"KUOPIO\");','valitse mistä, mitä, rajaus',2),(8,'Hae henkilöt joiden etunimi alkaa kirjaimella \"L\"','SELECT * FROM person WHERE firstname LIKE \"L%\";','valitse mistä, mitä, rajaus',2),(9,'Tulosta henkilöt palkan mukaan alenevassa järjestyksessä.','SELECT * FROM person ORDER BY salary DESC;','valitse mistä, miten',3),(10,'Hae 3 nuorinta henkilöä palkan mukaan alenevassa järjestyksessä','SELECT * FROM person ORDER BY birth_year ASC LIMIT 3;','valitse mistä, miten',3),(11,'Hae henkilön etu- ja sukunimi taulusta \"person\" sekä hänen työtunnit taulusta \"hour\"','SELECT person.firstname, person.lastname, hour.work_hour FROM person JOIN hour ON person.id_person = hour.id_person;','valitse mistä, mitä, miten yhdistetään',4),(12,'Laske rivien määrä taulusta \"person\"','SELECT COUNT(*) FROM person;','valitse miten ,mistä',5),(13,'Laske monessako projektissa työntekijä on ollut mukana.','SELECT id_person, COUNT(*) FROM hour GROUP BY id_person;',NULL,5),(14,'Hae projektit joissa on yli 2 työntekijää','Select id_project, COUNT(*) AS headcount FROM hour GROUP BY id_project HAVING COUNT(*) > 2;',NULL,5),(15,'Hae henkilöt, joiden palkka on suurempi kuin kaikkien keskipalkka.','SELECT * FROM person WHERE salary > (SELECT AVG(salary) FROM person);',NULL,6),(16,'testi','testi kysely','testataan',1),(17,'testi2','testi2','testi2',1),(18,'testi3','testi3','testi3',2),(19,'testi3','testi3','testi3',6),(20,'testi3','testi3','testi3',2),(21,'testi3','testi3','testi3',2),(22,'testi3','testi3','testi3',2),(23,'testi3','testi3','testi3',1),(24,'testi3','testi3','testi3',1),(25,'testi4','testi4','testi4',2),(26,'2','2','2',2),(27,'testi22','testi22','testi22',3),(28,'testi44','testi44','testi44',4),(29,'testi444','testi444','testi444',6),(30,'ds','ds','ds',2),(31,'de','de','de',2),(32,'1','1','1',1),(33,'2','2','2',2),(34,'3','3','3',3),(35,'4','4','4',4),(36,'SELECT * FROM person LIMIT 5;','select * FROM person LIMIT 5;','valitse, mistä, mitä, montako',1),(37,'SELECT * FROM person LIMIT 5;','SELECT * FROM person LIMIT 5;','SELECT * FROM person LIMIT 5;',2),(38,'SELECT * FROM person LIMIT 5;','SELECT * FROM person LIMIT 5;','SELECT * FROM person LIMIT 5;',3),(39,'SELECT * FROM person LIMIT 5;','SELECT * FROM person LIMIT 5;','SELECT * FROM person LIMIT 5;',5),(40,'testataan','testiin','tämä on vihje',2);
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hour`
--

DROP TABLE IF EXISTS `hour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hour` (
  `id_project` smallint NOT NULL,
  `id_person` smallint NOT NULL,
  `work_hour` int DEFAULT NULL,
  PRIMARY KEY (`id_project`,`id_person`),
  KEY `id_person` (`id_person`),
  CONSTRAINT `hour_ibfk_1` FOREIGN KEY (`id_project`) REFERENCES `project` (`id_project`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `hour_ibfk_2` FOREIGN KEY (`id_person`) REFERENCES `person` (`id_person`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hour`
--

LOCK TABLES `hour` WRITE;
/*!40000 ALTER TABLE `hour` DISABLE KEYS */;
INSERT INTO `hour` VALUES (101,201,300),(101,202,200),(101,203,200),(101,204,100),(101,205,100),(101,206,400),(102,201,300),(102,203,400),(103,203,200),(104,202,300),(104,203,200),(104,205,400);
/*!40000 ALTER TABLE `hour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `id_person` smallint NOT NULL,
  `firstname` char(15) NOT NULL,
  `lastname` char(15) NOT NULL,
  `city` varchar(20) DEFAULT NULL,
  `birth_year` smallint DEFAULT NULL,
  `salary` double DEFAULT NULL,
  PRIMARY KEY (`id_person`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (201,'Jim','Morrison','TURKU',1985,44),(202,'Jim','Smith','TURKU',1988,39),(203,'Liisa','River','HELSINKI',1991,39),(204,'Ann','Jones','TURKU',1979,44),(205,'Lisa','Simpson','HELSINKI',1985,36),(206,'Matt','Daniels','TAMPERE',1991,34);
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id_project` smallint NOT NULL,
  `pname` varchar(20) NOT NULL,
  `place` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_project`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (101,'Bookkeeping','TURKU'),(102,'Billing','HELSINKI'),(103,'Store','HELSINKI'),(104,'Selling','TURKU'),(105,'Customers','KUOPIO'),(106,'Statistics',NULL);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_set_exercises`
--

DROP TABLE IF EXISTS `test_set_exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_set_exercises` (
  `test_set_id` int NOT NULL,
  `exercise_id` int NOT NULL,
  PRIMARY KEY (`test_set_id`,`exercise_id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `test_set_exercises_ibfk_1` FOREIGN KEY (`test_set_id`) REFERENCES `test_sets` (`id`),
  CONSTRAINT `test_set_exercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_set_exercises`
--

LOCK TABLES `test_set_exercises` WRITE;
/*!40000 ALTER TABLE `test_set_exercises` DISABLE KEYS */;
INSERT INTO `test_set_exercises` VALUES (1,1),(1,2),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(2,17),(6,36),(6,37),(6,38),(6,39);
/*!40000 ALTER TABLE `test_set_exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_sets`
--

DROP TABLE IF EXISTS `test_sets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_sets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_sets`
--

LOCK TABLES `test_sets` WRITE;
/*!40000 ALTER TABLE `test_sets` DISABLE KEYS */;
INSERT INTO `test_sets` VALUES (1,'harjoitus_1'),(2,'turha'),(6,'debug');
/*!40000 ALTER TABLE `test_sets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-14  8:31:52
