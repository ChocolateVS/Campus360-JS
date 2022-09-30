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
  `id` int(11) NOT NULL,
  `code` varchar(6) DEFAULT NULL,
  `campus` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- --------------------------------------------------------

--
-- Table structure for table `Campus`
--

CREATE TABLE `Campus` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Campus`
--

INSERT INTO `Campus` (`id`, `name`) VALUES
(1, 'Waikato');

-- --------------------------------------------------------

--
-- Table structure for table `Floor`
--

CREATE TABLE `Floor` (
  `id` int(11) NOT NULL,
  `code` varchar(4) NOT NULL,
  `scale` float DEFAULT '1',
  `block` int(11) DEFAULT NULL,
  `local_directory` varchar(255) DEFAULT NULL,
  `filename` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Point`
--

CREATE TABLE `Point` (
  `id` int(11) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `gyro_data` varchar(255) DEFAULT NULL,
  `type` varchar(20) DEFAULT 'Point',
  `floor` int(11) NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `local_directory` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Room`
--

CREATE TABLE `Room` (
  `id` int(11) NOT NULL,
  `code` varchar(15) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `point` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Block`
--
ALTER TABLE `Block`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Campus`
--
ALTER TABLE `Campus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Floor`
--
ALTER TABLE `Floor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Point`
--
ALTER TABLE `Point`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Room`
--
ALTER TABLE `Room`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
