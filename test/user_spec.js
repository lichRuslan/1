var sinon = require('sinon');
var assert = require('assert');
var UsersApi = require('../users');
describe("Users", function(){
    it("#createUser", function(done){
        var user ={
            username: 'asd',
        }
        var insertWasCalled = false;
        var collection ={
            insert: function (data, cb){
                insertWasCalled = true;
                assert.equal(data.username, user.username);
                cb(null, [data]);
            }
        };
        var userApi = new UserApi(collection);
        userApi.createUser(user, function(error, storedUser){
            assert.ifError(error);
            assert.equal(storedUser.username, user.username);
            assert(insertWasCalled);
            done();
        });
    });
    describe("#activeUsers",function(){
        beforeEach(function(){
            this.collection ={
                count: sinon.stub()
            };
        });
        beforeEach(function(){
            this.userApi = new UsersApi(this.collection);
        });

        beforeEach(function(){
            this.collection.count.yields(null,5);
        });

        beforeEach(function(done){
            this.resultSpy = sinon.spy(done);
            this.userApi.activeUsers(done);
        });
        it ('should invoke count method on collection', function(){
            assert(this.collection.count.calledOnce);
        });
        it ('should look up users with photo ', function(){
            var query = this.collection.count.firstCall.args[0];
            assert.equal(query.withPhotos,  true);
        });

        it ('should look up active users', function(){
            var query = this.collection.count.firstCall.args[0];
            assert.equal(query.active,  true);
        });

    });
});