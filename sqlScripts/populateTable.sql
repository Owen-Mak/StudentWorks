use sw;

INSERT INTO PROJECTS (title, description, creationDate, language, framework, courses, category, ImageFilePath, VideoUrl)
VALUES 
    ('Conteract', 'This is a webapp to connect employees with potential employers.', now(), 'Javascript', 'jQuery', 'PRJ666', NULL,'project/1/img/conteractThumbnail.jpg', 'project/1/video/Conteract.mp4'),
    ('The Last Transmission', 'This is a game within a 2D world with point and click shooting elements. The camera is situated in a birds eye view, and the objective of the game is to find jerry cans.', now(), 'Java', 'Reactjs', 'PRJ666', NULL, 'project/2/img/solitaryThumbnail.jpg', 'project/2/video/TheLastTransmission.mp4'),
    ('Solitary', 'This is a 2D platformer with various puzzles. The object of the game is to reach the end point of the 2D stage.', now(), 'C++', 'Unity', 'PRJ666', NULL,'project/3/img/solitaryThumbnail.jpg', 'project/3/video/'),
    ('Web Form', 'This is my form I made in web class', now(), 'Javascript', 'jQuery', 'WEB322', NULL,'htuffhfggfre', 'vrg4gfrerfe'),
    ('Calculator App', 'This is a calculator meant for doing simple arithmetic', now(), 'Java', 'Chai', 'JAC444', 'android', 'htuuuifhuifre', 'vhvfiuviurv'),
    ('Chess App', 'This is a chess app with a very smart AI', now(), 'C#', 'EnitityFramework', 'JAC444', 'linux', 'project/6/img/someThumbnail.jpg', 'vhvfiuviurv');
    


INSERT INTO USERS (firstName, lastName, password, email, userName, userType, program, registrationStatus, registrationDate, registrationHashCode)
VALUES
    ('Fred', 'Smith', 'PassWrd', 'fs@myseneca.ca', 'fred_s', 'Contributor', 'BSD', TRUE, now(), 'huirhf8y89jce'),
    ('Charlotte', 'Baptist', 'cbaptist@myseneca.ca', 'MyNameIsCB12', 'cbaptist', 'Contributor', 'DDA', TRUE, now(), '987jj098cv'),
    ('Huda', 'Al Dallal', 'myPassw0rd4', 'hal-dallal@myseneca.ca', 'huda_a', 'Administrator', 'CPA', TRUE, now(), 'ghj9yhj76yujc'),
    ('John','Smith', 'pass1234', 'johnsmith12@myseneca.ca', 'johns', 'User', 'CPD', FALSE, '2017-12-25', 'uijnc09876tgnk');
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
    
    