use studentworks;
/*
    Delete user accounts that have not been verified through email after 1 week

DELETE FROM USERS
WHERE registrationStatus = false AND (DATEDIFF(now(), USERS.registrationDate) > 7);
*/
SELECT * FROM USERS WHERE userName = 'omak';
