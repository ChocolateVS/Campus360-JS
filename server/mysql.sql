#DELETE before adding
DROP TABLE Room;
DROP TABLE Point;
DROP TABLE Floor;
DROP TABLE Block;
DROP TABLE Campus;

#Recreate Tables
CREATE TABLE Campus (
  id int PRIMARY KEY AUTO_INCREMENT,
  name varchar(255)
);

CREATE TABLE Block (
  code varchar(6) PRIMARY KEY,
  campus int NOT NULL,
  FOREIGN KEY (campus) REFERENCES Campus (id)
);

CREATE TABLE Floor (
  code varchar(4) PRIMARY KEY,
  block varchar(6) NOT NULL,
  scale float DEFAULT 1.0,
  FOREIGN KEY (block) REFERENCES Block (code)
);

CREATE TABLE Point (
  id int PRIMARY KEY AUTO_INCREMENT,
  x int NOT NULL,
  y int NOT NULL,
  image_path varchar(255),
  gyro_data varchar(255),
  type varchar(20) DEFAULT 'Point',
  floor varchar(4) NOT NULL,
  FOREIGN KEY (floor) REFERENCES Floor (code)
);

CREATE TABLE Room (
    code varchar(15) PRIMARY KEY,
    name varchar(50),
    point int NOT NULL,
     FOREIGN KEY (point) REFERENCES Point (id)
    );
