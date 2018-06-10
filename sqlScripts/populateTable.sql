use sw;

INSERT INTO PROJECTS (title, description, creationDate, language, framework, courses, category, ImageFilePath, VideoUrl)
VALUES 
    ('Conteract', 'This is a webapp to connect employees with potential employers.', now(), 'Javascript', 'jQuery', 'PRJ666', NULL,'1/img/conteractThumbnail.jpg', '1/video/Conteract.mp4'),
    ('The Last Transmission', 'This is a game within a 2D world with point and click shooting elements. The camera is situated in a birds eye view, and the objective of the game is to find jerry cans.', now(), 'Java', 'Reactjs', 'PRJ666', NULL, '2/img/TheLastTransmissionThumbnail.jpg', '2/video/TheLastTransmission.mp4'),
    ('Solitary', 'This is a 2D platformer with various puzzles. The object of the game is to reach the end point of the 2D stage.', now(), 'C++', 'Unity', 'PRJ666', NULL, '3/img/solitaryThumbnail.jpg', '3/video/Solitary_-new.mp4'),
    ('Kitchen Modeller', 'An app to accurrately design the kitchen', '2004-05-01', 'Visual Basic', NULL, NULL, 'utility', '4/img/kitchen.png', '4/video/Kitchen.mp4'),
    ('Arcanoid Game', 'A version of the popular arcanoid game from the 80s', '2005-05-01', 'C++', NULL, NULL, 'game','5/img/arcanoid1.png', '5/video/Arcanoid.mp4'),
    ('empty', null, null, null, null, null, null, 'images/empty.png', null),    
    ('Calculator App', 'This is a calculator meant for doing simple arithmetic', now(), 'C++', 'Chai', 'JAC444', 'android', 'images/empty.png', null),
    ('Chess App', 'This is a chess app with a very smart AI', now(), 'C++', 'nginx', 'JAC444', 'linux', 'images/empty.png', null),
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
    
    


INSERT INTO USERS (firstName, lastName, password, email, userName, userType, program, registrationStatus, registrationDate)
VALUES
    ('Fred', 'Smith', 'PassWrd', 'fs@myseneca.ca', 'fred_s', 'Contributor', 'BSD', TRUE, now()),
    ('Charlotte', 'Baptist', 'cbaptist@myseneca.ca', 'MyNameIsCB12', 'cbaptist', 'Contributor', 'DDA', TRUE, now()),
    ('Huda', 'Al Dallal', 'myPassw0rd4', 'hal-dallal@myseneca.ca', 'huda_a', 'Administrator', 'CPA', TRUE, now()),
    ('John','Smith', 'pass1234', 'johnsmith12@myseneca.ca', 'johns', 'User', 'CPD', FALSE, '2017-12-25');
    /*('Owen', 'Mak', '123', 'omak@myseneca.ca', 'omak', 'Admin', 'CPA', FALSE, now(), '81dc9bdb52')*/


/* Associate users to projects:
    Fred (UserID == 1)      -> WebForm (projectID == 1)
    Charlotte (UserID == 2) -> Calculator (projectID == 2)
    Huda (UserID == 3)      -> WebForm (projectID == 1)
    John (UserID == 4)      -> no projects (NULL)
*/

INSERT INTO BRIDGE_USERS_PROJECTS (userID, projectID) 
VALUES
    (1, 1),
    (2, 2),
    (3, 1),
    (4, NULL);

INSERT INTO COMMENTS (userID, commentContent, date)
VALUES
    (1, 'Hey, what library did you use for this?', now()),
    (2, 'Wow, great job! Can I pm you for some questions', now()),
    (1, 'Yes, go ahead', now()),
    (3, 'Thanks for your contribution!', now());
    
    