var sinon = require('sinon');
var assert = require('assert');
var UsersApi = require('../users');
describe("Users", function(){

    beforeEach(function(){
        this.collection ={
            count: sinon.stub(),
            insert: sinon.stub()
        };
    });
    beforeEach(function(){
        this.userApi = new UsersApi(this.collection);
    });

    describe('#createUser -2', function(){
        beforeEach(function(){
            this.user = {
                username: 'abc'
            };
        });

        beforeEach(function(){
            var storedUser = JSON.parse(JSON.stringify(this.user));
            storedUser._id ='1234';
            this.collection.insert.yields(null, [storedUser]);
        });

        beforeEach(function(done){
            this.resultSpy = sinon.spy(done);
            this.userApi.createUser(this.user, this.resultSpy);
        });

        it ('calls insert on collection', function(){
            assert(this.collection.insert.calledOnce);
        });
        it ('calls with matching username', function(){
            var insertArg = this.collection.insert.firstCall.args[0];
            assert.equal(insertArg.username, this.user.username);
        });
        it ('returns stored user with matching username', function(){
            assert.equal(this.resultSpy.firstCall.args[1].username, this.user.username);
        });
        it ('returns stored user with proper _id', function(){
            assert.equal(this.resultSpy.firstCall.args[1]._id, '1234');
        });
    });

    // it("#createUser", function(done){
    //     var user ={
    //         username: 'abc',
    //     }
    //     var insertWasCalled = false;
    //     var collection ={
    //         insert: function (data, cb){
    //             insertWasCalled = true;
    //             assert.equal(data.username, user.username);
    //             cb(null, [data]);
    //         }
    //     };
    //     var usersApi = new UsersApi(collection);
    //     usersApi.createUser(user, function(error, storedUser){
    //         assert.ifError(error);
    //         assert.equal(storedUser.username, user.username);
    //         assert(insertWasCalled);
    //         done();
    //     });
    // });
    describe("#activeUsers",function(){
        beforeEach(function(){
            this.collection.count.yields(null,5);
        });
        beforeEach(function(done){
            this.resultSpy = sinon.spy(done);
            this.userApi.activeUsers(this.resultSpy);
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
        it ('should call callback', function(){
            assert(this.resultSpy.calledOnce);
        });
        it ('should return without error', function(){
            assert.ifError(this.resultSpy.firstCall.args[0]);
        });
        it ('should return count', function(){
            assert.equal(this.resultSpy.firstCall.args[1], 5);
        });
    });
});