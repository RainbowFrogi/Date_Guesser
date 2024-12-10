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
    image_description varchar(1024),
    PRIMARY KEY (location_id)
);

INSERT INTO locations( location_id, year, country, image_path, image_description)
VALUES
(1,2014,"Finland", "/public/img/1.jpg", "This is a demo image from the year 2014 in Helsinki"),
(2,1989,"Germany", "/public/img/2.jpg", "This photo is from the collapse of the Berlin Wall in 1989"),
(3,1935,"Germany", "/public/img/3.jpg", "This photo is from the Nürnberg Rally in 1935"),
(4,2001,"United States of America", "/public/img/4.jpg", "This is a photo from the 2001 9/11 attack in New York, USA"),
(5,1942,"Japan", "/public/img/5.jpg", "This is a photo from 1942 Japan where people are protesting against the war"),
(6,1940,"Japan", "/public/img/6.jpg", "This is a photo from 1940 Japan"),
(7,1959,"Cuba", "/public/img/7.jpg", "This is a photo from 1959 Cuba with Fidel Castro having a speech"),
(8,1984,"Russia", "/public/img/8.jpg", "This pohto shows people standing in a queue waiting to get inside the Mausoleum of Lenin in 1984"),
(9,1969,"United States of America", "/public/img/9.jpg", "The photo shows Saturn V rocket launch in 1969"),
(10,2019,"France", "/public/img/10.jpg", "This is a photo from the 2019 Notre Dame fire in Paris"),
(11,2020,"Lebanon", "/public/img/11.jpg", "This is a photo from the 2020 Beirut explosion in Lebanon"),
(12,2001,"Afghanistan", "/public/img/12.jpg", "This is a photo from the 2001 Afghanistan war"),
(13,2016,"United Kingdom", "/public/img/13.jpg", "This is a photo from the 2016 Brexit referendum in the UK"),
(14,2021,"United States of America", "/public/img/14.jpg", "This is a photo from the 2021 Capitol Hill riot in Washington DC"),
(15,2022,"United Kingdom", "/public/img/15.jpg", "This is a photo from the 2022 Queen Elizabeth II funeral in the UK"),
(16,1989,"China", "/public/img/16.jpg", "The photo is from the tiananmen square massacre of 1989 in China"),
(17,2021,"Egypt","/public/img/17.jpg","The container ship Ever Given in 2021 lodged in the Suez Canal as viewed from the ISS"),
(18,1943,"Russia","/public/img/18.jpg","Stalingrad in 1943 after liberation from german occupation")

