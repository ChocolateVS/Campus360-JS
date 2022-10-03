# Campus360-JS
## Navigation system around a campus using 360degree view of points on a map
### University of Waikato funded project - developed following on from the COMPX241-21A Smoke and Mirrors Project
made to showcase student talent @ UoW.

## How to use
### SERVER Setup:
Navigate to docker-compose.yaml - ensure passwords are what you want, and the index/package.json in NODE up to date.   
```docker-compose up```  
#### Setting up the SQL  
```docker exec -it server_mongodb_1 sh```  
```mongosh -u campus360 -p SuperSecurePassword!``` then to create user for NodeJS 
```use waikato_db; 
db.createUser({user:'remote', pwd:'SuperSecurePassword!', roles:[{role:'readWrite', db:'waikato_db'}] });
```
(feel free to customise the db user's details - just make sure to update the .env in /NODE to match)
then 
```exit```  
You should now be good to go, either open port 3000(nodejs) and 3002(mongo-express) on your system, or use a nginx to proxypass (We used nginx).  
(**not** recommended) open 27017 if you need direct access to the mongodb server  

#### Editing:  
  To edit the NodeJS when docker has already been created ```docker exec -it server_nodejs_1 sh```  
  then ```apt update && apt install nano && nano index.js```  
  
  To edit the mongodb: ```docker exec -it server_mongo_1 sh``` then  
  ```mongosh -u campus360 -p SuperSecurePassword! waikato_db``` (campus360/SuperSecurePassword are the Admin details in docker-compose.yaml)
   Otherwise if 3002 is an open port on the server ```serverip:3002/``` should allow you to access the GUI editor - remote/SuperSecurePassword (change in docker-compose.yaml)  
---
### Android App Setup
Install the android app on your android phone - connect to the Insta360x2 camera via wifi - and start taking photos + mapping points   
Once you have your points and everything loaded, you can then export it all the the SQL database, which can be subsequently accessed via the frontend.  

## How it works
HTML5 - front end - Using Panolens.js to view 360deg    
NodeJS - server side  
MongoDB - database   
Mongo-Express - GUI mongodb editor
Docker - runs the NodeJS, DB and GUI editor  
  
Android App - create maps, points and manage bringing all together - connects via Wifi to the 360deg camera.  

Rowan: Developed the Android app & Front end
Alexander: Developed the server configuration & Front end
