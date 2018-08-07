<img src='/public/images/logo.png'></img>
"By the Students, for the Students"

Authors: [Stephen](https://github.com/steaward), [Huda](https://github.com/ooHAoo), [Owen](https://github.com/Owen-Mak), [Yuriy](https://github.com/YuriyKartuzov)

---------------------------------------------------------------------------------------------------------------------------------
[Deployment](https://github.com/steaward/StudentWorks/blob/master/README.md#deployment)
- [Connecting your own Databases](https://github.com/steaward/StudentWorks/blob/master/README.md#connecting-to-your-own-database)
- [Logging Errors](https://github.com/steaward/StudentWorks/blob/master/README.md#logging-errors)
- [Logging Admin Files](https://github.com/steaward/StudentWorks/blob/master/README.md#logging-the-admin-files)


[User guide](https://github.com/steaward/StudentWorks/blob/master/README.md#------------------------------------------------user-guide------------------------------------------------)
- [Administration](https://github.com/steaward/StudentWorks/blob/master/README.md#admin-status)


## Deployment

This web application is built using NodeJS. 
In order to run the application, node v 8.1 must be installed on your computer.

Our web server is currently Ubuntu 16.04:
To install node on Ubuntu, run these two commmands:

	curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash `
	sudo apt-get install -y nodejs

Once you have installed node, the command: node --version , will confirm the installation. You should see version 8.x

This project uses an array of node packages. NPM (node package manager) comes pre-installed so long as you have followed the above instructions. 

In order for StudentWorks to properly work remotely, it's package depencies must also be installed. 

The quickest way to install these packages is through the included package-lock.json file. 

Running the command: `npm install --save` , will install and save all the dependencies onto the remote computer. 


There are two ways to run the server.

The easiest way, is to use the included scripts, found under ~/scripts.

The script ./startNode will start the server.

The script ./killNode will kill any node processes, and thus shut down the server.

The other way to run the server is to manually run it from multiple commands:

In order to start the server, we have chosen a Process Manager script called Forever. 

**In order to run Forever, you must be within the StudentWorks directory**
	
	To start the server: forever start server1.js
	
	To stop the server: forever stop server1.js
	
	To kill the server: 
	
  		The best way to do this is to list the PID of the script running. 
  
  		Forever list will show you two PID's. The PID of the script, as well as the PID of the node process. 
  
  		Run the command `kill -9 [PID of the server] [PID of the node process]` to end the instance of the server. 
 
After running the Forever script, you can view the website by going to your localhost:3000 in the browser. It is assumed that port 3000 is a free port on the remote computer. If it is not, the port can be changed within the server1.js file. 

## Connecting to your own Database

StudentWorks currently runs alongside mysql  (for all the api calls to project and user information) as well as MongoDB for the comment section of the project page.

When installing StudentWorks, you must have a mysql database setup. Scripts are included to create / remove the required tables necessary. You should run these scripts found in ./sqlScripts before continuing on. 

Next you must change lines 18 onwards in the `./db_connect.js` file to incorporate 


    connectInfo.host = "<hostname>.<domain>";
    
    connectInfo.user = "<username on host>";
    
    connectInfo.password = "<password>";
    
    connectInfo.port = <port number used by the database>;


Once you have filled these out, all video, images and text will be stored through your mysql server. 

User comments are stored using MongoDB, as the schema for the tables can be quickly created using JavaScript. 

This js file can be found at `/public/projectPage/comments.js` 

Through using a site such a mlab.com, you can create your own free account and link it in the code here:

` db = mongoose.createConnection("mongodb://<username>:<password>@<mlab.connection>", { useNewUrlParser : true });`

Mlab will automatically create a table for the comments if you do not create one before starting up this connection. 

## Logging Errors 

If the server goes down, you can check an error log which is attriubuted to the NodeJS process. Any console.logs, or throw messages will appear in this log.
To find the log, simply type forever list, and look under the log column for the directory which stores the log file.
You can then run the cat command to view the file and see what went wrong.

## Logging The Admin Files

StudentWorks also comes equipped with a logging system written in C. This system is used purely for the adminstration side of the site. It logs upload/remove activity, as well as records when the logging system has been tampered with.

In order to have this logging system active, and available for use in the web browser (under Admininstration) the following must be run on the server host:

`gcc ./logger.c -o logger`


## <-------------------------------------------     User Guide     -------------------------------------------> 

StudentWorks is setup so anyone can view the website, browse profiles, and make comments on projects. 

However, users can sign up and create accounts to access other features of the site, such as recording a video of themselves

using their project and contributing their project to the website. The signup process is as follows:

	-Through the registration link, a username, password and email are entered. The account reamains
	
	dormant until the verification link is clicked. This link is sent, by StudentWorks, to the given 
	
	email address during registration.
	
	
	- User's can now login and are able to access the contribute page. This page details how to record 
	
	a video of their project, and upload to either their computers, or directly to StudentWorks. 

<img src='/public/images/userModal.png'></img>

	- The user will see links respective to their account status. The image above shows how an 
	
	adminstrative user has access to the admin page. 
	
#### Admin Status

StudentWorks is intended to be run by others. That is, trusted user's can be given admin status by other admins. 

Administration consists of the following: 

`1. Ability to add (accept a pending project) or remove projects which showcase abuse, NSFW content, ect.`

`2. Ability to give other user's admin status, or remove admin status. ` 

`3. Access an interactive shell (the terminal belonging to the server hosting nodeJs)`

`4. View server statistics`

<img src='/public/images/adminPage.png'></img>

