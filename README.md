# Campus360-JS
## Navigation system around a campus using 360degree view of points on a map
### University of Waikato funded project - developed following on from the COMPX241-21A Smoke and Mirrors Project
made to showcase student talent @ UoW.

## How to use
SERVER:
Navigate to docker-compose.yaml - ensure you have the skeleton.sql in SQL up to date, and the index/package.json in NODE up to date. 
```docker-compose up```
Setting up the SQL
```docker exec -it campus360_mysql_1 sh```
```cd docker-entrypoint-initdb.d```
```mysql -u root -p waikato_db < skeleton.sql ``` - sign in, then ```exit```  
You should now be good to go, either open 3000 on your system, or use a nginx to proxypass (We used nginx)

Install the android app on your android phone - connect to the Insta360x2 camera - and start taking photos + mapping points   

Once you have your points and everything loaded, you can then export it all the the SQL database, which can be subsequently accessed via the frontend

## How it works
HTML5 front end - Using Panolens.js to view 360deg    
NodeJS + MySQL backend    
  
Android App to create maps, points and manage bringing all together.  

