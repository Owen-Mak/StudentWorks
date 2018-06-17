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
    firstName   VARCHAR(30) NOT NULL,
    lastName    VARCHAR(30) NOT NULL,
    password    CHAR(50)  NOT NULL,
    email	    VARCHAR(50) NOT NULL,    
    userName    VARCHAR(20) NOT NULL UNIQUE,    
    userType    VARCHAR(25) NOT NULL CHECK(userType IN ('User','Contributor', 'Administrator')),
    program     VARCHAR(25) CHECK (program IN ('CPA', 'CPD', 'BSD', 'DDA', 'OTHER')),
    registrationStatus BOOLEAN,
    registrationDate DATE NOT NULL,
    registrationCode CHAR(65),
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
    ImageFilePath CHAR(50),
    VideoUrl    CHAR(50),
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



