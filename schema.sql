
DROP DATABASE IF EXISTS employeeDB;

CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE employee (
    id INTEGER NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(30),
    lastName VARCHAR(30),
    rolesId INTEGER,
    managerId INTEGER,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INTEGER NOT NULL AUTO_INCREMENT,
    departName VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(12,2) NOT NULL,
    departId INTEGER NOT NULL,
    PRIMARY KEY (id)
);