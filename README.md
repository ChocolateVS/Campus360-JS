# Campus360-JS
## Navigation system around a campus using 360degree view of points on a map
### University of Waikato funded project - developed following on from the COMPX241-21A Smoke and Mirrors Project
made to showcase student talent @ UoW.

```WARNING: The API is completely unprotected - WILL EVENTUALLY IMPLEMENT AUTHKEYS```

## How to use
---
### SERVER Setup:
- Navigate to docker-compose.yaml, .env, and mongo-init.js - ensure passwords are what you want, and the index.js & package.json in /server is up to date. 
- Make sure you update the passwords in mongo-init.js to reflect the usr/pwd of the url inside the .env
'sudo docker-compose up' should handle everything.
Either open port 3001(nodejs) and 3002(mongo-express online editor) on your system, or use a nginx to proxypass (We used nginx).  
- (**not** recommended) open 27017 if you need direct access to the mongodb server  
- Note: The container names will have the parent folder's name as a prefix and a number as a suffix e.g. parent_nodejs_1, campus360-js_nodejs_1, etc, so if any of the container names used here don't match yours, feel free to change the suffix to match your parent folder. 
To Start: ```sudo docker-compose build && sudo docker-compose up```(ctrl+c to exit) or (only after docker-compose has been run atleast once) ```sudo docker start campus360-js_nodejs_1 campus360-js_mongo_1 campus360-js_mongo-express_1``` 
- The second option is a more permanent 'on', 'docker-compose up' only stays on as long as the ssh session is open

#### Editing:  
---
 To edit the NodeJS when docker has already been created:
 - ```docker exec -it campus360-js_nodejs_1 sh```
 - ```apt update && apt install nano && nano index.js``` 
 or (catch all)
 - ```sudo docker-compose build && sudo docker-compose up``` -> ctrl-c -> ```sudo docker start campus360-js_nodejs_1 campus360-js_mongo_1 campus360-js_mongo-express_1```

  
 - To edit the mongodb: 
 - ```docker exec -it campus360-js_mongo_1 sh```  
 - ```mongosh -u <mongo_root_usr> -p <mongo_root_pwd>``` (usr/pwd are the Admin details in docker-compose.yaml)
 - ```use waikato_db;```
 Otherwise if 3002 is an open port on the server ```<serverip>:3002/``` should allow you to access the GUI editor - remote/SuperSecurePassword! (change in docker-compose.yaml)  
---
### Android App Setup:
- [Install](https://github.com/ChocolateVS/Campus360-MapBuilder) the android app on your android phone
- connect to the Insta360x2 camera via wifi - and start taking photos + mapping points   
- Once you have your points and everything loaded, you can then export it all the the Mongo database, which can be subsequently accessed via the frontend/API.  

## How it works
HTML5 - front end - Using Panneleum to view 360deg    
NodeJS - server side  
MongoDB - database   
Mongo-Express - GUI mongodb editor
Docker - runs the NodeJS, DB and GUI editor  
[Android App](https://github.com/ChocolateVS/Campus360-MapBuilder) - Gitrepo linked - create maps, points and manage bringing all together - connects via Wifi to the 360deg camera.  

### Common Issues
- Build fails - make sure that there is a /images dir in the /server section, make sure you have docker-compose installed, make sure you have docker installed. 
- Make sure you are running docker-compose up, from the parent directory, instead of in '/server'
- Docker won't run - make sure the latest version is installed, make sure you are running commands as sudo OR have your user added the docker admin group 
- My changes to the mongo/mongo-express aren't showing - Any changes to the docker-compose.yaml, e.g. password, etc). First try 'docker-compose down', if that doesn't work you will need to DELETE the containers associated (don't worry db, images, & client side data is stored in docker volumes in ```/var/lib/docker/volumes```), If that still doesn't work, you will need to clear the volume information `inside /var/lib/docker/volumes/campus306-js_mongo_1/_data` <- most common problem for Mongo not logging in, make sure after rm that there is still a '\_data' dir, otherwise the docker will crash on next attempt to load it.
- MongoDB/Mongosh won't log in - see 'what if the credentials failed for MongoDB' if the login is failing during 'docker-compose up'. If you are trying to log in with mongosh, and the credentials in docker-compose.yaml aren't working, (DANGEROUS) you may need to clear the docker volume for the mongo, because the populating of the mongo config may have corrupted in earlier steps, and not loaded the credentials (see 'my changes to the mongo/...' for steps). 
- Can't access /var/lib/docker/volumes - you may need to go into ```sudo su```, as it is a protected folder
- Can't access any info from the client side - all the API calls are to a hardcoded URL(yes, i know), you will have to change this to your server
- CORS error - inside /server/index.js there is a CORS statement that can allow or restrict clients from requesting the API
- Cannot run https to http - Either use NGINX + certbot to request over an API, or configure the express to use HTTPS yourself. OR just run everything on http for simplicity.


#### What if the credentials failed for MonoDB - Manually setting the credentials for the waikato_db
Potentially the docker-compose up may show that the mongo-init.js has failed to create the neccessary users - follow this to manually add said user.
Once ```sudo docker-compose up``` has booted up (i.e. creates the containers), you will need to 'ctrl-c' and exit out   
- **please note the logs in the docker-compose up will indicate NodeJS & mongo-express are crashing, this is EXPECTED until we do the next step**  
- Please note: You will have to start the mongoDB by ITSELF when doing this step - the other containers depend on the credentials created in this step to work  
- Campus360-JS should be the parent folder, so the containers will start with campus360-js, but this may be different for you. Please check the closing statement of the docker-compose up to see, or run ```docker ps -a```    
- ```sudo docker start campus360-js_mongo_1```  
- ```docker exec -it campus360-js_mongo_1 sh```    
- ```mongosh -u <mongo_root_usr> -p <mongo_root_pwd>``` then to create user for NodeJS  
- ```use waikato_db;```
- ```db.createUser({user:'<usr in .env/MONGO_URL & mongo-init.js>', pwd:'<pwd in .env/MONGO_URL & mongo-init.js>', roles:[{role:'readWrite', db:'waikato_db'}] });```  
(feel free to customise the db user's details - just make sure to update the .env in /NODE to match)  
- ```exit```   

Rowan: Developed the Android app & Front-end  
Alexander: Developed the backend, server-config & Front end  
