db.createUser({
    user:'remote', 
    pwd:'SuperSecurePassword!', 
    roles:[{
        role:'readWrite', 
        db:'waikato_db'
    }] 
});