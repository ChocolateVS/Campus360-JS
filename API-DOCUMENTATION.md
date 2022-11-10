# API documentation

PATCH works by passing the object made from the 'query' params is passed to be directly updated - so the names of the items must match the associated db object  
ALL non-get requests must have a 'auth' param in the BODY (i.e. not ?auth=) - AUTH_KEY is found in server/.env  

## UTILITY

- GET /api/all - returns entire DB of projects, fully expanded
- GET /api/rooms - returns all rooms
- GET /api/roomlocation/\<roomID> - will return {level:\<levelObj>, area:\<areaObj>} for given ID
- GET /api/pointlocation/\<pointID> - will return {level:\<levelObj>, area:\<areaObj>} for given ID

## PROJECT
- GET /api/project/\<optional ID for specific>
- POST /api/project?id=\<optional>&name=\<required string>
- PATCH /api/project/\<projectID>?name=\<optional string>
- DELETE /api/project/\<projectID>

## AREA

- GET /api/project/\<projectID>/area/\<optional ID for specific>
- POST /api/project/\<projectID>/area?id=\<optional>&name=\<required string>
- PATCH /api/project/\<projectID>/area/\<areaID>?name=\<optional string>
- DELETE /api/project/\<projectID>/area/\<areaID>

## LEVEL

- GET /api/project/\<projectID>/area/<areaID>/level/\<optional ID for specific>
- POST /api/project/\<projectID>/area/<areaID>/level?id=\<optional objectid>&name=\<required string>&image_scale=\<default 1 number>&local_directory=\<default ./images string>&filename=\<default '' string>
- PATCH /api/project/\<projectID>/area/\<areaID>/level/\<levelID>?name=\<optional string>&image.scale=\<optional number>&image.directory=\<optional string>&image.name=\<optional string> 
- DELETE /api/project/\<projectID>/area/\<areaID>/level/\<levelID>

## IMAGES - Please note, if level=<uuid> is found to be invalid, the image will be saved to folder regardless & local_directory must EXIST
*If no id is provided, will just save file with defaults (./images & original filename)*  
*attach the file under key 'file'*
- POST /api/upload/panorama?id=\<required valid ObjectId>&filename=\<default '' string>&north=\<percent default 0.5 number>&local_directory=\<dirname string default ''>
- POST /api/upload/floorplan?id=\<required valid ObjectId>&filename=\<default '' string>&scale=\<default 1 number>&local_directory=\<dirname string default ''>



## Room
```NOTE: Room and Point are referenced by LEVEL```
- GET /api/project/\<projectID>/area/\<areaID>/level/\<levelID>/room/\<optional ID for specific>
- POST /api/project/\<projectID>/area/\<areaID>/level/\<levelID>/room?id=\<optional objectid>&name=\<required string>&owner=\<default '' string>&type=\<default '' string>
- PATCH /api/project/\<projectID>/area/\<areaID>/level/\<levelID>/room/\<roomID>?name=\<optional string>&owner=\<optional string>&type=\<optional string>
- DELETE /api/project/\<projectID>/area/\<areaID>/level/\<levelID>/room/\<roomID>

## Point
```NOTE: Room and Point are referenced by LEVEL```
- GET /api/project/\<projectID>/area/\<areaID>/level/\<levelID>/point/\<optional ID for specific>
- POST /api/project/\<projectID>/area/\<areaID>/level/\<levelID>/point?id=\<optional>&name=\<required string>&x=\<required number>&y=\<required number>&north=\<default 0.5 number>&type=\<default '' string>&local_directory=\<default '' string>&filename=\<default '' string> 
- PATCH /api/project/\<projectID>/area/\<areaID>/level/\<levelID>/point/\<pointID>?name=\<optional string>&x=\<optional number>&y=\<optional number>&type=\<optional string>&image.north=\<optional number>&image.directory=\<optional string>&image.name=\<optional string> 
- DELETE /api/project/\<projectID>/area/\<areaID>/level/\<levelID>/point/\<pointID>

## Linking a point to a ROOM or a POINT
*Append /link to end of .../room/\<roomID> or .../point/\<pointID>*
- GET .../link/\<optional ID for specific>
- POST .../link/\<pointID>
- PATCH .../link/\<current pointID>?id=<new pointID>
- DELETE .../link/\<pointID>
*Please note, the pointID must exist to be added - I have used 'pointID' to make it clear a link is an actual POINT object somewhere*


*I have done basic testing at the capacity I can with little data, it is not comprehensive*
