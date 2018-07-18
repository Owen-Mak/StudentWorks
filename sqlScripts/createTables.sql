use sw;
/*
ALTER TABLE USERS
    drop FOREIGN KEY USERS_ibfk_1;
*/
drop table BRIDGE_USERS_PROJECTS;
drop table PROJECTS;
drop table COMMENTS;
drop table USERS;


CREATE TABLE USERS (
    userID      INT(11) NOT NULL AUTO_INCREMENT,
    firstName   VARCHAR(30) NULL,
    lastName    VARCHAR(30) NULL,
    password    CHAR(50)  NOT NULL,
    email	    VARCHAR(100) NOT NULL,    
    userName    VARCHAR(30) NOT NULL UNIQUE,    
    userType    ENUM ('Visitor', 'Contributor', 'Admin'),
    program     VARCHAR(255) CHECK (program IN ('CPA', 'CPD', 'BSD', 'DDA', 'OTHER')),
    registrationStatus BOOLEAN,
    registrationDate DATE NOT NULL,
    registrationCode CHAR(65),
    imagePath CHAR(255),
    userDescription TEXT,
    PRIMARY KEY (userID))
engine=innodb;

CREATE TABLE PROJECTS (
    projectID   INT(11) AUTO_INCREMENT,
    title       VARCHAR(30) NOT NULL,
    description TEXT,
    creationDate DATE,    
    language    VARCHAR(30),
    framework   VARCHAR(30),
    courses     VARCHAR(20),
    category    VARCHAR(20), 
    ImageFilePath CHAR(255),
    VideoFilePath CHAR(255),
    status      ENUM('approved', 'pending'),
    PRIMARY KEY (projectID))
engine=innodb;

CREATE TABLE COMMENTS (
    commentID INT(11) NOT NULL AUTO_INCREMENT,
    userID      INT(11) NOT NULL,
    commentContent text NOT NULL,
    date DATE NOT NULL,    
    PRIMARY KEY (commentID),
    FOREIGN KEY (userID) REFERENCES USERS(userID))
engine=innodb;

CREATE TABLE BRIDGE_USERS_PROJECTS (
    bridgeId INT(11) PRIMARY KEY AUTO_INCREMENT,
    userID INT(11) NOT NULL,
    projectID INT(11),
    FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE,
    FOREIGN KEY (projectID)  REFERENCES PROJECTS(projectID) ON DELETE CASCADE)
engine=innodb;    



