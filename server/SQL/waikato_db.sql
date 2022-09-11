-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 192.168.5.5
-- Generation Time: Sep 08, 2022 at 09:45 PM
-- Server version: 5.7.39
-- PHP Version: 8.0.22
USE waikato_db;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+12:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `waikato_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Block`
--

CREATE TABLE `Block` (
  `id` varchar(255) NOT NULL,
  `code` varchar(6) DEFAULT NULL,
  `campus` varchar(255) DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `Campus`
--

CREATE TABLE `Campus` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `Floor`
--

CREATE TABLE `Floor` (
  `id` varchar(255) NOT NULL,
  `code` varchar(4) NOT NULL,
  `scale` float DEFAULT '1',
  `local_directory` varchar(255) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `block` varchar(255) DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `Point`
--

CREATE TABLE `Point` (
  `id` varchar(255) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `local_directory` varchar(255) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `gyro_data` varchar(255) DEFAULT NULL,
  `type` varchar(20) DEFAULT 'Point',
  `floor` varchar(255) NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `Room`
--

CREATE TABLE `Room` (
  `id` varchar(255) NOT NULL,
  `code` varchar(15) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `point` varchar(255) NOT NULL
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Block`
--
ALTER TABLE `Block`
  ADD PRIMARY KEY (`id`),
  ADD KEY `campus` (`campus`);

--
-- Indexes for table `Campus`
--
ALTER TABLE `Campus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `Floor`
--
ALTER TABLE `Floor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `block` (`block`);

--
-- Indexes for table `Point`
--
ALTER TABLE `Point`
  ADD PRIMARY KEY (`id`),
  ADD KEY `floor` (`floor`);

--
-- Indexes for table `Room`
--
ALTER TABLE `Room`
  ADD PRIMARY KEY (`id`),
  ADD KEY `point` (`point`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Block`
--
ALTER TABLE `Block`
  ADD CONSTRAINT `Block_ibfk_1` FOREIGN KEY (`campus`) REFERENCES `Campus` (`id`);

--
-- Constraints for table `Floor`
--
ALTER TABLE `Floor`
  ADD CONSTRAINT `Floor_ibfk_1` FOREIGN KEY (`block`) REFERENCES `Block` (`id`);

--
-- Constraints for table `Point`
--
ALTER TABLE `Point`
  ADD CONSTRAINT `Point_ibfk_1` FOREIGN KEY (`floor`) REFERENCES `Floor` (`id`);

--
-- Constraints for table `Room`
--
ALTER TABLE `Room`
  ADD CONSTRAINT `Room_ibfk_1` FOREIGN KEY (`point`) REFERENCES `Point` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

GRANT ALL PRIVILEGES ON waikato_db.* TO 'remote'@'%';
