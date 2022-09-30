
DROP DATABASE waikato_db;
CREATE DATABASE waikato_db;


USE waikato_db;

#Create Tables
CREATE TABLE Campus (
  id varchar(255) PRIMARY KEY,
  name varchar(255)
);

CREATE TABLE Block (
  id varchar(255) PRIMARY KEY,
  name varchar(6),

  campus varchar(255),
  FOREIGN KEY (campus) REFERENCES Campus (id)
);

CREATE TABLE Floor (
  id varchar(255) PRIMARY KEY,
  name varchar(4) NOT NULL,
  scale float DEFAULT 1.0,
  local_directory varchar(255),
  filename varchar(255),

  block varchar(255),
  FOREIGN KEY (block) REFERENCES Block (id)
);

CREATE TABLE Point (
  id varchar(255) PRIMARY KEY,
  x int NOT NULL,
  y int NOT NULL,
  local_directory varchar(255),
  filename varchar(255),
  gyro_data varchar(255),
  type varchar(20) DEFAULT 'Point',

  floor varchar(255) NOT NULL,
  FOREIGN KEY (floor) REFERENCES Floor (ID)
);

CREATE TABLE Room (
    id varchar(255) PRIMARY KEY,
    code varchar(15),
    name varchar(50),

    point varchar(255) NOT NULL,
    FOREIGN KEY (point) REFERENCES Point (id)
);