-- DATABASE
DROP DATABASE IF EXISTS guess_location;
CREATE DATABASE guess_location CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
-- USER
DROP USER IF EXISTS guess_location_player;
CREATE USER guess_location_player IDENTIFIED BY 'g43S5_pa5sword';

-- TABLES
USE guess_location

DROP TABLE IF EXISTS table_name;
CREATE TABLE locations (
    location_id int AUTO_INCREMENT,
    year int,
    country varchar(1024),
    image_path varchar(1024),
    PRIMARY KEY (location_id),
);