USE `competencias`;

DROP TABLE IF EXISTS `competicion`;

CREATE TABLE `competicion`
(
  `id` int
(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70) NOT NULL DEFAULT '',
  `genero_id` int(11),
  `actor_id` int(11),
  `director` int(11),
  PRIMARY KEY(`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=UTF8;
LOCK TABLES `competicion` WRITE;
INSERT INTO `competicion`
VALUES
    (1, 'Cual es la mejor pelicula?', NULL, NULL, NULL),
    (2, 'Que drama te hizo llorar mas?', 8, NULL, NULL),
    (3, 'Cual es la peli de terror mas bizarra?', 10, NULL, NULL),
    (4, 'Cual es la mejor peli con Julia Roberts?', NULL, 1044, NULL),
    (5, 'Cual es la mejor peli con De Niro?', NULL, 1702, NULL),
    (6, 'Cual es la mejor peli de Spielberg?', NULL, NULL, 3364);
UNLOCK TABLES;

USE `competencias`;

DROP TABLE IF EXISTS `votos_pelicula`;

CREATE TABLE `votos_pelicula`
(
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `competencia_id` int(11) NOT NULL,
  `pelicula_id` int(11) NOT NULL,
  `cantidad` int(11),
  PRIMARY KEY(`id`)
)  ENGINE=InnoDB DEFAULT CHARSET=UTF8;
