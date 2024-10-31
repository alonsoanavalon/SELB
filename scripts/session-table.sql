CREATE TABLE session_type (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(200) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO session_type (name) VALUES ('PLATFORM_LOGIN');

CREATE TABLE session_logged (
    id int NOT NULL AUTO_INCREMENT,
    sessionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    sessionTypeId int,
    userId int,
    PRIMARY KEY (id),
    FOREIGN KEY (sessionTypeId) REFERENCES session_type(id),
    FOREIGN KEY (userId) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;