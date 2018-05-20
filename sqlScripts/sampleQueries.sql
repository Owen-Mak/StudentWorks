
no rows selectedno rows selected

no rows selectedno rows selected

Error starting at line : 4 in command -
SELECT *, TO_DAYS(USERS.registrationDate - now() FROM USERS
WHERE registrationStatus = false AND TO_DAYS(USERS.registrationDate - now()) < 7
Error at Command Line : 4 Column : 1
Error report -
SQL Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'FROM USERS
WHERE registrationStatus = false AND TO_DAYS(USERS.registrationDate -' at line 1

no rows selectedno rows selected
userID      firstName                      lastName                       password                                           email                                              userName             userType                  program                   registrationStatus registrationDate          registrationHashcode                                              TO_DAYS(USERS.registrationDate - now()) 
----------- ------------------------------ ------------------------------ -------------------------------------------------- -------------------------------------------------- -------------------- ------------------------- ------------------------- ------------------ ------------------------- ----------------------------------------------------------------- --------------------------------------- 
4           John                           Smith                          pass1234                                           johnsmith12@myseneca.ca                            johns                User                      CPD                       false              2018-05-13                uijnc09876tgnk                                                                                            

userID      firstName                      lastName                       password                                           email                                              userName             userType                  program                   registrationStatus registrationDate          registrationHashcode                                              TO_DAYS(now() - USERS.registrationDate ) 
----------- ------------------------------ ------------------------------ -------------------------------------------------- -------------------------------------------------- -------------------- ------------------------- ------------------------- ------------------ ------------------------- ----------------------------------------------------------------- ---------------------------------------- 
4           John                           Smith                          pass1234                                           johnsmith12@myseneca.ca                            johns                User                      CPD                       false              2018-05-13                uijnc09876tgnk                                                                                             


Error starting at line : 4 in command -
SELECT *, TO_DAYS(SUBTIME(now(), USERS.registrationDate) FROM USERS
WHERE registrationStatus = false 
Error at Command Line : 4 Column : 1
Error report -
SQL Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'FROM USERS
WHERE registrationStatus = false' at line 1
userID      firstName                      lastName                       password                                           email                                              userName             userType                  program                   registrationStatus registrationDate          registrationHashcode                                              SUBTIME(now(), USERS.registrationDate) 
----------- ------------------------------ ------------------------------ -------------------------------------------------- -------------------------------------------------- -------------------- ------------------------- ------------------------- ------------------ ------------------------- ----------------------------------------------------------------- ------------------------- 
4           John                           Smith                          pass1234                                           johnsmith12@myseneca.ca                            johns                User                      CPD                       false              2018-05-13                uijnc09876tgnk                                                                              

userID      firstName                      lastName                       password                                           email                                              userName             userType                  program                   registrationStatus registrationDate          registrationHashcode                                              SUBDATE(now(), USERS.registrationDate) 
----------- ------------------------------ ------------------------------ -------------------------------------------------- -------------------------------------------------- -------------------- ------------------------- ------------------------- ------------------ ------------------------- ----------------------------------------------------------------- ------------------------- 
4           John                           Smith                          pass1234                                           johnsmith12@myseneca.ca                            johns                User                      CPD                       false              2018-05-13                uijnc09876tgnk                                                                              

SUBDATE(now(), USERS.registrationDate) 
------------------------- 
                          

SUBDATE(USERS.registrationDate, 7) 
------------------------- 
2018-05-06                


Error starting at line : 4 in command -
SELECT DATE_SUB(now(), USERS.registrationDate) FROM USERS
WHERE registrationStatus = false 
Error at Command Line : 4 Column : 1
Error report -
SQL Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'USERS.registrationDate) FROM USERS
WHERE registrationStatus = false' at line 1

Error starting at line : 4 in command -
SELECT DATE_TIME(now(), USERS.registrationDate) FROM USERS
WHERE registrationStatus = false 
Error at Command Line : 4 Column : 1
Error report -
SQL Error: FUNCTION sw.DATE_TIME does not exist

Error starting at line : 4 in command -
SELECT SYB_TIME(now(), USERS.registrationDate) FROM USERS
WHERE registrationStatus = false 
Error at Command Line : 4 Column : 1
Error report -
SQL Error: FUNCTION sw.SYB_TIME does not exist

Error starting at line : 4 in command -
SELECT SUB_TIME(now(), USERS.registrationDate) FROM USERS
WHERE registrationStatus = false 
Error at Command Line : 4 Column : 1
Error report -
SQL Error: FUNCTION sw.SUB_TIME does not exist
SUBTIME(now(), USERS.registrationDate) 
------------------------- 
                          

registrationDate          SUBTIME(now(), USERS.registrationDate) 
------------------------- ------------------------- 
2018-05-13                                          

registrationDate          SUBTIME(now(), USERS.registrationDate) 
------------------------- ------------------------- 
2018-05-13                                          


Sw succeeded.

registrationDate          SUBTIME(now(), USERS.registrationDate) 
------------------------- ------------------------- 
2018-05-13                                          


Sw succeeded.

registrationDate          SUBTIME(now(), USERS.registrationDate) 
------------------------- ------------------------- 
2017-12-25                                          


Sw succeeded.

registrationDate          TIMEDIFF(now(), USERS.registrationDate) 
------------------------- ------------------------- 
2017-12-25                                          


Sw succeeded.

registrationDate          TIMEDIFF(now(), USERS.registrationDate) 
------------------------- ------------------------- 
2017-12-25                                          


Sw succeeded.

registrationDate          DATEDIFF(now(), USERS.registrationDate) 
------------------------- --------------------------------------- 
2017-12-25                139                                     


Sw succeeded.

registrationDate          DATEDIFF(now(), USERS.registrationDate) 
------------------------- --------------------------------------- 
2017-12-25                139                                     


Sw succeeded.


Error starting at line : 5 in command -
DELETE FROM USERS
WHERE registrationStatus = false AND DATEDIFF(now(), USERS.registrationDate) > 7
Error at Command Line : 5 Column : 1
Error report -
SQL Error: Cannot delete or update a parent row: a foreign key constraint fails (`sw`.`BRIDGE_USERS_PROJECTS`, CONSTRAINT `BRIDGE_USERS_PROJECTS_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `USERS` (`userID`))

Sw succeeded.


Error starting at line : 5 in command -
DELETE FROM USERS
WHERE registrationStatus = false AND (DATEDIFF(now(), USERS.registrationDate) > 7)
Error at Command Line : 5 Column : 1
Error report -
SQL Error: Cannot delete or update a parent row: a foreign key constraint fails (`sw`.`BRIDGE_USERS_PROJECTS`, CONSTRAINT `BRIDGE_USERS_PROJECTS_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `USERS` (`userID`))

Sw succeeded.


1 row deleted.

