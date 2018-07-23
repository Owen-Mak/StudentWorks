use sw;

INSERT INTO PROJECTS (title, description, creationDate, language, framework, courses, category, ImageFilePath, VideoFilePath, status)
VALUES 
    ('Conteract', 'This is a webapp to connect employees with potential employers.', now(), 'Javascript', 'jQuery', 'PRJ666', NULL,'1/img/conteractThumbnail.jpg', '1/video/Conteract.webm', 'approved'),
    ('The Last Transmission', 'This is a game within a 2D world with point and click shooting elements. The camera is situated in a birds eye view, and the objective of the game is to find jerry cans.', now(), 'Java', 'Reactjs', 'PRJ666', NULL, '2/img/TheLastTransmissionThumbnail.jpg', '2/video/TheLastTransmission.webm', 'approved'),
    ('Solitary', 'This is a 2D platformer with various puzzles. The object of the game is to reach the end point of the 2D stage.', now(), 'C++', 'Unity', 'PRJ666', NULL, '3/img/solitaryThumbnail.jpg', '3/video/Solitary_-new.webm', 'approved'),
    ('Kitchen Modeller', 'An app to accurrately design the kitchen', '2004-05-01', 'Visual Basic', NULL, NULL, 'utility', '4/img/kitchen.png', '4/video/Kitchen.mp4', 'approved'),
    ('Arcanoid Game', 'A version of the popular arcanoid game from the 80s', '2005-05-01', 'C++', NULL, NULL, 'game','5/img/arcanoid1.png', '5/video/Arcanoid.mp4', 'approved'),       
    ('Calculator App', 'This is a calculator meant for doing simple arithmetic', now(), 'C++', 'Chai', 'JAC444', 'android', 'images/empty.png', null, 'approved'),
    ('Chess App', 'This is a chess app with a very smart AI', now(), 'C++', 'nginx', 'JAC444', 'linux', 'images/empty.png', null, 'approved');
    /*
    ('Language filter project#1', 'This is a project to test the language filter using C++ as the language value.', now(), 'C++', 'Visual Studio', 'OOP244', 'linux', 'images/empty.png', null),
    ('Language filter project#2', 'This is a project to test the language filter using C++ as the language value.', now(), 'C++', 'GNU', 'IPC144', 'windows', 'images/empty.png', null),
    ('Language filter project#3', 'This is a project to test the language filter using C++ as the language value.', now(), 'C++', 'Boost', 'OOP345', 'mac', 'images/empty.png', null),
    ('Language filter project#4', 'This is a project to test the language filter using C++ as the language value.', now(), 'C++', 'nginx', 'OOP244', 'linux', 'images/empty.png', null),
    ('Language filter project#5', 'This is a project to test the language filter using C++ as the language value.', now(), 'C++', 'COM', 'OOP244', 'windows', 'images/empty.png', null),
    ('Language filter project#6', 'This is a project to test the language filter using C++ as the language value.', now(), 'C++', 'ATL', 'OOP244', 'mac', 'images/empty.png', null),
    ('Framework filter project#1', 'This is a project to test the framework filter using jQuery as the framework value.', now(), 'Javascript', 'jQuery', 'INT222', 'linux', 'images/empty.png', null),
    ('Framework filter project#2', 'This is a project to test the framework filter using jQuery as the framework value.', now(), 'Javascript', 'jQuery', 'INT322', 'windows', 'images/empty.png', null),
    ('Framework filter project#3', 'This is a project to test the framework filter using jQuery as the framework value.', now(), 'Javascript', 'jQuery', 'INT422', 'mac', 'images/empty.png', null),
    ('Framework filter project#4', 'This is a project to test the framework filter using jQuery as the framework value.', now(), 'Javascript', 'jQuery', 'INT222', 'linux', 'images/empty.png', null),
    ('Framework filter project#5', 'This is a project to test the framework filter using jQuery as the framework value.', now(), 'Javascript', 'jQuery', 'INT322', 'windows', 'images/empty.png', null),
    ('Framework filter project#6', 'This is a project to test the framework filter using jQuery as the framework value.', now(), 'Javascript', 'jQuery', 'INT422', 'mac', 'images/empty.png', null),
    ('Category filter project#1', 'This is a project to test the category filter using game as the category value.', now(), null, null, null, 'game', 'images/empty.png', null),
    ('Category filter project#2', 'This is a project to test the category filter using game as the category value.', now(), null, null, null, 'game', 'images/empty.png', null),
    ('Category filter project#3', 'This is a project to test the category filter using game as the category value.', now(), null, null, null, 'game', 'images/empty.png', null),
    ('Category filter project#4', 'This is a project to test the category filter using game as the category value.', now(), null, null, null, 'game', 'images/empty.png', null),
    ('Category filter project#5', 'This is a project to test the category filter using game as the category value.', now(), null, null, null, 'game', 'images/empty.png', null),
    ('Category filter project#6', 'This is a project to test the category filter using game as the category value.', now(), null, null, null, 'game', 'images/empty.png', null);
    
    */


INSERT INTO USERS (firstName, lastName, password, email, userName, userType, program, registrationStatus, registrationDate, registrationCode, imagePath, userDescription)
VALUES
    ('Fred', 'Smith', 'PassWrd', 'fs@myseneca.ca', 'fred_s', 'Contributor', 'BSD', TRUE, now(), '123', null, null),
    ('Charlotte', 'Baptist', 'MyNameIsCB12','cbaptist@myseneca.ca', 'cbaptist', 'Contributor', 'DDA', TRUE, now(), '234', null, null),
    ('Huda', 'Al Dallal', 'myPassw0rd4', 'hal-dallal@myseneca.ca', 'huda_a', 'Admin', 'CPA', TRUE, now(), '345', null, null),
    ('John','Smith', 'pass1234', 'johnsmith12@myseneca.ca', 'johns', 'Contributor', 'CPD', FALSE, '2017-12-25', '456', null, null),
    ('Owen', 'Mak', '123', 'omak@myseneca.ca', 'omak', 'Admin', 'CPA', TRUE, now(), '567', null, null),
    ('Jon', 'Snow', 'Winterfell', 'john@gmail.com', 'jsnow', 'Contributor', null, FALSE, '2016-01-01', '678', null, null),
    ('John', 'Doe', 'm1ss1ng', 'unknown@nowhere.com', 'jDoe', 'Contributor', null, FALSE, '2013-06-06', '789', null, null),
    ('Vasia', 'Jopovych', 'vj123', 'vjopovych@hotmail.com', 'vJopovych', 'Contributor', null, TRUE, '2018-01-01', '890', null, null),
    ('Vaselisa', 'Pizdaivanovna', 'vp456', 'vPizdaivanovna@gmail.com', 'vPizdaivanovna','Contributor', null, TRUE, '2018-01-01', '901', null, null),
    ('Johnny', 'Waters', 'jw789', 'jWaters@gmail.com', 'jWaters', 'Contributor', null, TRUE, '2018-01-01', '1234', null, null),
    ('Yuriy', 'Kartuzov', 'yuriyA', 'kyuriy@myseneca.ca', 'yuriy', 'Contributor', null, TRUE, now(), '12345', null, null),
    ('Yuriy', 'Kartuzov', 'yuriyA', 'kyuriy@myseneca.ca', 'yuriyA', 'Admin', null, TRUE, now(), '12345', null, null),
    ('Not Really', 'Owen', 'asdf1234', 'owenmak325@gmail.com', 'NotOwen', 'Admin', null, TRUE, now(), '12345', null, null);


/* Associate users to projects:
    Fred (UserID == 1)      -> WebForm (projectID == 2)
    Charlotte (UserID == 2) -> Calculator (projectID == 2)
    Huda (UserID == 3)      -> WebForm (projectID == 1)
    John (UserID == 4)      -> no projects (NULL)
*/

INSERT INTO BRIDGE_USERS_PROJECTS (userID, projectID)
VALUES
    (1, 2),
    (2, 2),
    (3, 3),
    (4, 6),
    (5, 6),
    (6, 4),
    (7, 4),    
    (8, 1),
    (9, 1),
    (10, 1),
    (2, 6);

INSERT INTO COMMENTS (userID, commentContent, date)
VALUES
/* I'm pretty sure you need to know which project this belongs to */
    (1, 'Hey, what library did you use for this?', now()),
    (2, 'Wow, great job! Can I pm you for some questions', now()),
    (1, 'Yes, go ahead', now()),
    (3, 'Thanks for your contribution!', now());
    
    