CREATE TABLE `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `inGameLocation` varchar(255) NOT NULL,
  `server` varchar(255) NOT NULL,
  `datacenter` varchar(255) NOT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `externalLink` varchar(255) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_location__server_name` (`server`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
