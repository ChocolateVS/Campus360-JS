# Campus360-JS
## Navigation system around a campus using 360degree view of points on a map
### University of Waikato funded project - developed following on from the COMPX241-21A Smoke and Mirrors Project
made to showcase student talent @ UoW.

```WARNING: The API is completely unprotected - WILL EVENTUALLY IMPLEMENT AUTHKEYS```

## How to use
---
### SERVER Setup:
Navigate to docker-compose.yaml - ensure passwords are what you want, and the index/package.json in NODE up to date.   
```sudo docker-compose build && sudo docker-compose up```  
- Note: The container names will have the parent folder's name as a prefix and a number as a suffix e.g. parent_nodejs_1, campus360-js_nodejs_1, etc.  
#### Setting up the MongoDB  
 - Make sure you update the passwords in here to reflect your docker-compose.yaml  
Once ```sudo docker-compose up``` has booted up (i.e. creates the containers), you will need to 'ctrl-c' and exit out   
**please note the logs in the docker-compose up will indicate NodeJS & mongo-express are crashing, this is EXPECTED until we do the next step**  
- Please note: You will have to start the mongoDB by ITSELF when doing this step - the other containers depend on the credentials created in this step to work  
- Campus360-JS should be the parent folder, so the containers will start with campus360-js, but this may be different for you. Please check the closing statement of the docker-compose up to see, or run ```docker ps -a```    
```sudo docker start campus360-js_mongo_1```  
```docker exec -it campus360-js_mongo_1 sh```    
```mongosh -u campus360 -p SuperSecurePassword! waikat_db``` then to create user for NodeJS  
```db.createUser({user:'remote', pwd:'SuperSecurePassword!', roles:[{role:'readWrite', db:'waikato_db'}] });
```  
(feel free to customise the db user's details - just make sure to update the .env in /NODE to match)  
then   
```exit```   
You should now be good to go, either open port 3001(nodejs) and 3002(mongo-express online editor) on your system, or use a nginx to proxypass (We used nginx).  
(**not** recommended) open 27017 if you need direct access to the mongodb server  
To Start: ```sudo docker-compose up``` or ```sudo docker start campus360-js_nodejs_1 campus360-js_mongo_1 campus360-js_mongo-express_1```  

#### Editing:  
---
  To edit the NodeJS when docker has already been created ```docker exec -it campus360-js_nodejs_1 sh```  
  then ```apt update && apt install nano && nano index.js```  
  
  To edit the mongodb: ```docker exec -it campus360-js_mongo_1 sh``` then  
  ```mongosh -u campus360 -p SuperSecurePassword! waikato_db``` (campus360/SuperSecurePassword! are the Admin details in docker-compose.yaml)
   Otherwise if 3002 is an open port on the server ```<serverip>:3002/``` should allow you to access the GUI editor - remote/SuperSecurePassword! (change in docker-compose.yaml)  
---
### Android App Setup
[Install](https://github.com/ChocolateVS/Campus360-MapBuilder) the android app on your android phone - connect to the Insta360x2 camera via wifi - and start taking photos + mapping points   
Once you have your points and everything loaded, you can then export it all the the Mongo database, which can be subsequently accessed via the frontend/API.  

## How it works
HTML5 - front end - Using Panneleum to view 360deg    
NodeJS - server side  
MongoDB - database   
Mongo-Express - GUI mongodb editor
Docker - runs the NodeJS, DB and GUI editor  
  
[Android App](https://github.com/ChocolateVS/Campus360-MapBuilder) - Gitrepo linked - create maps, points and manage bringing all together - connects via Wifi to the 360deg camera.  

### Common Issues
Build fails - make sure that there is a /images dir in the /server section, make sure you have docker-compose installed, make sure you have docker installed. Make sure you are running docker-compose up, from the parent directory, instead of in '/server'
Docker won't run - make sure the latest version is installed, make sure you are running commands as sudo OR have your user added the docker admin group 
My changes to the mongo/mongo-express aren't showing - Any changes to the docker-compose.yaml, e.g. password, etc). First try 'docker-compose down', if that doesn't work you will need to DELETE the containers associated (don't worry db, images, & client side data is stored in docker volumes in ```/var/lib/docker/volumes```)
Can't access /var/lib/docker/volumes - you may need to go into ```sudo su```, as it is a protected folder
Can't access any info from the client side - all the API calls are to a hardcoded URL(yes, i know), you will have to change this to your server
CORS error - inside /server/index.js there is a CORS statement that can allow or restrict clients from requesting the API
Cannot run https to http - Either use NGINX + certbot to request over an API, or configure the express to use HTTPS yourself. OR just run everything on http for simplicity.

Rowan: Developed the Android app & Front end
Alexander: Developed the server configuration & Front end
