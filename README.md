# Campus360-JS
## Navigation system around a campus using 360degree view of points on a map
### University of Waikato funded project - developed following on from the COMPX241-21A Smoke and Mirrors Project
made to showcase student talent @ UoW.

## How to use

Setup a server with NodeJS & MySQL (We used PhpMyAdmin to manage the MySQL).  
The nodeJS must be able to connect to the MySQL, as it will be the communication point for the mobile app to send and receive data  
Create a mysql database using the mysql.sql file  
Install the android app on your android phone - connect to the Insta360x2 camera - and start taking photos + mapping points   

Once you have your points and everything loaded, you can then export it all the the SQL database, which can be subsequently accessed via the frontend

## How it works
HTML5 front end - Using Panolens.js to view 360deg    
NodeJS + MySQL backend    
  
Android App to create maps, points and manage bringing all together.  

