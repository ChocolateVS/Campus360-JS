# Campus360-JS
## Navigation system around a campus using 360degree view of points on a map
### University of Waikato funded project - developed following on from the COMPX241-21A Smoke and Mirrors Project
made to showcase student talent @ UoW.

## How to use
### SERVER Setup:
Navigate to docker-compose.yaml - ensure you have the skeleton.sql in SQL up to date, and the index/package.json in NODE up to date.   
```docker-compose up```  
#### Setting up the SQL  
```docker exec -it campus360_mysql_1 sh```  
```cd docker-entrypoint-initdb.d```  
```mysql -u root -p waikato_db < skeleton.sql ``` - sign in, then ```exit```  
You should now be good to go, either open port 3000(nodejs) and 8082(phpmyadmin) on your system, or use a nginx to proxypass (We used nginx).  
(**not** recommended) open 3306 if you need direct access to the mySQL server  

#### Editing:  
  To edit the NodeJS when docker has already been created ```docker exec -it campus360_nodejs_1 sh```  
  then ```apt update && apt install nano && nano index.js```  
  To edit the mysql: ```docker exec -it campus360_mysql_1 sh``` then  
  ```mysql -u root -p waikato_db```  
   Otherwise if 8082 is an open port on the server ```serverip:8082/phpmyadmin``` should allow you to access the Phpmyadmin   
---
### Android App Setup
Install the android app on your android phone - connect to the Insta360x2 camera via wifi - and start taking photos + mapping points   
Note: you must disconnect your phone from the Camera's wifi before the Database will be updated.  
Once you have your points and everything loaded, you can then export it all the the SQL database, which can be subsequently accessed via the frontend.  

## How it works
HTML5 - front end - Using Panolens.js to view 360deg    
NodeJS - server side  
MySQL - database   
PhpMyAdmin - service to edit the mySQL  
MongoDB - database (in development)  
Docker - runs the NodeJS, MySQL, PhpMyAdmin  
  
Android App - create maps, points and manage bringing all together - connects via Wifi to the 360deg camera.  

Rowan: Developed the Android app & Front end
Alexander: Developed the server configuration & Front end
