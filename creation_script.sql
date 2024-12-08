-- DATABASE
DROP DATABASE IF EXISTS guess_location;
CREATE DATABASE guess_location;
-- CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- USER
DROP USER IF EXISTS 'guess_location_player'@'localhost';
CREATE USER 'guess_location_player'@'localhost' IDENTIFIED BY 'g43S5_pa5sword';

GRANT SELECT, INSERT, UPDATE, DELETE ON guess_location.* TO 'guess_location_player'@'localhost';

FLUSH PRIVILEGES;

-- TABLES
USE guess_location;

DROP TABLE IF EXISTS locations;
CREATE TABLE locations (
    location_id int,
    year int,
    country varchar(1024),
    image_path varchar(1024),
    PRIMARY KEY (location_id)
);

INSERT INTO locations( location_id, year, country, image_path)
VALUES
(1,2014,"Finland", "/public/img/1.jpg"),
(2,1989,"Germany", "/public/img/2.jpg"),
(3,1943,"Germany", "/public/img/3.jpg"),
(4,2001,"United States of America", "/public/img/4.jpg"),
(5,1942,"Japan", "/public/img/5.jpg"),
(6,1940,"Japan", "/public/img/6.jpg"),
(7,1959,"Cuba", "/public/img/7.jpg"),
(8,1984,"Russia", "/public/img/8.jpg"),
(9,1969,"United States of America", "/public/img/9.jpg"),
(10,2019,"France", "/public/img/10.jpg"),
(11,2020,"Lebanon", "/public/img/11.jpg"),
(12,2001,"Afghanistan", "/public/img/12.jpg"),
(13,2016,"United Kingdom", "/public/img/13.jpg"),
(14,2021,"United States of America", "/public/img/14.jpg"),
(15,2022,"United Kingdom", "/public/img/15.jpg"),
(16,1989,"China", "/public/img/16.jpg");

