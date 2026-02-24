CREATE DATABASE secret_match;

USE secret_match;

CREATE TABLE uporabniki (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(50) NOT NULL,
                            email VARCHAR(50) NOT NULL UNIQUE,
                            password VARCHAR(255) NOT NULL,
                            eventJoined BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE matches (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         giverId INT NOT NULL,
                         recieverId INT NOT NULL,
                         UNIQUE (giverId),
                         FOREIGN KEY (giverId) REFERENCES uporabniki(id),
                         FOREIGN KEY (recieverId) REFERENCES uporabniki(id)
);