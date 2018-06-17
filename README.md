# StudentWorks
"By the Students, for the Students"

Authors: Stephen, Huda, Owen, Yuriy


<------- Installation -------->

This web application is built using NodeJS. 
In order to run the application, node v 8.1 must be installed on your computer.

Our web server is currently Ubuntu 16.04:
To install node on Ubuntu, run these two commmands:
          curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
          sudo apt-get install -y nodejs

Once you have installed node, the command: node --version , will confirm the installation. You should see version 8.x

This project uses an array of node packages. NPM (node package manager) comes pre-installed so long as you have followed the above instructions. 

In order for StudentWorks to properly work remotely, it's package depencies must also be installed. 
The quickest way to install these packages is through the included package-lock.json file. 
Running the command: npm install --save , will install and save all the dependencies onto the remote computer. 


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
  Run the command kill -9 [PID of the server] [PID of the node process] to end the instance of the server. 
 
After running the Forever script, you can view the website by going to your localhost:3000 in the browser. It is assumed that port 3000 is a free port on the remote computer. If it is not, the port can be changed within the server1.js file. 



<------- Installation Over-------->



