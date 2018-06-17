use sw;
/*
    Delete user accounts that have not been verified through email after 1 week

DELETE FROM USERS
WHERE registrationStatus = false AND (DATEDIFF(now(), USERS.registrationDate) > 7);

SELECT * FROM USERS WHERE userName = 'omak';


SELECT p.*, b.userID
FROM PROJECTS p, BRIDGE_USERS_PROJECTS b
WHERE (p.ProjectID = b.ProjectID);
*/

SELECT proj.*, u.*
FROM PROJECTS proj
  JOIN BRIDGE_USERS_PROJECTS b on proj.ProjectID = b.ProjectID
  JOIN USERS u on b.userID = u.userID
WHERE proj.ProjectID = 1;