use sw;

INSERT INTO PROJECTS (title, description, creationDate, language, framework, courses, category, ImageFilePath, VideoUrl)
VALUES 
    ('Web Form', 'This is my form I made in web class', now(), 'Javascript', 'jQuery', 'WEB322', NULL,'htuffhfggfre', 'vrg4gfrerfe'),
    ('Calculator App', 'This is my description', now(), 'JAVA', 'Chai', 'JAC444', 'android', 'htuuuifhuifre', 'vhvfiuviurv');


INSERT INTO USERS (firstName, lastName, password, email, userName, userType, program, registrationStatus, registrationDate, registrationHashCode)
VALUES
    ('Fred', 'Smith', 'PassWrd', 'fs@myseneca.ca', 'fred_s', 'Contributor', 'BSD', TRUE, now(), 'huirhf8y89jce'),
    ('Charlotte', 'Baptist', 'cbaptist@myseneca.ca', 'MyNameIsCB12', 'cbaptist', 'Contributor', 'DDA', TRUE, now(), '987jj098cv'),
    ('Huda', 'Al Dallal', 'myPassw0rd4', 'hal-dallal@myseneca.ca', 'huda_a', 'Administrator', 'CPA', TRUE, now(), 'ghj9yhj76yujc'),
    ('John','Smith', 'pass1234', 'johnsmith12@myseneca.ca', 'johns', 'User', 'CPD', FALSE, '2017-12-25', 'uijnc09876tgnk'); 


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
    
    