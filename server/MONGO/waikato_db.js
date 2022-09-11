conn = new Mongo();
db = conn.getDB("waikato_db");

db.createCollection("campus360");


db.createUser({user: "remote", pwd: "Campus360", roles: ["readWrite"]});
