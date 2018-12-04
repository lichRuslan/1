function UsersApi(coll){
    this.coll =coll;
};
UsersApi.prototype.createUser = function(user, callback){
    this.coll.insert (user, function(error, docs){
        if (error){
            callback(error);
        }else{
            callback(null, docs[0]);
        }
    });
};
UsersApi.prototype.activeUsers = function(callback){
    var query = {
        active : true,
        withPhotos: true
    }
    this.coll.count(query, callback);
};
module.exports = UsersApi;