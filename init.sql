CREATE DATABASE IF NOT EXISTS CollaborativeTasksDb;

USE CollaborativeTasksDb;

CREATE TABLE Users(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Firstname VARCHAR(255) NOT NULL
);

CREATE TABLE Tasks(
    Id INT PRIMARY KEY AUTO_INCREMENT,
    UserId INT,
    Label VARCHAR(255) NOT NULL DEFAULT '0',
    Status TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

INSERT INTO Users(Name, Firstname) VALUES("Frère", "Loïc");
INSERT INTO Users(Name, Firstname) VALUES("Marits", "Arnaud");
INSERT INTO Users(Name, Firstname) VALUES("Landi", "Sacha");
INSERT INTO Users(Name, Firstname) VALUES("Bouillon", "Tom");