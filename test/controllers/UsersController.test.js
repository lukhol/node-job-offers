const chai = require('chai');
const sinon = require('sinon');
var expect = chai.expect;

const User = require('../../src/models/User');
const UserController = require('../../src/controllers/UserController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('----- UserController -----', function() {
    let bcryptStub;

    beforeEach(function() {
        sinon.stub(User, 'findOne');
        sinon.stub(User, 'remove');
        sinon.stub(User, 'find');
        bcryptStub = sinon.stub(bcrypt, 'compare');
    });

    afterEach(function() {
        User.findOne.restore();
        User.remove.restore();
        User.find.restore();
        bcrypt.compare.restore();
    });

    context('GET BY ID', function() {    
        it('CANNOT - database call error', function() {
            User.findOne.yields({}, null);
            var req = {
                params: { id: "5bf9c6720f0b7f2d5cc5576b" }
            };
            var res = {
                status: sinon.stub(),
                json: sinon.stub()
            };
    
            UserController.getById(req, res, null);
    
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledWith(res.json, {message: {}});
        });
    
        it('CANNOT - not exist', function(){
            User.findOne.yields(null, null);
            var req = {
                params: { id: "5bf9c6720f0b7f2d5cc5576b" }
            };
            var res = {
                status: sinon.stub(),
                json: sinon.stub()
            };
    
            UserController.getById(req, res, null);
    
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, null);
        });

        it('CAN - success', function() {
            var expectedUser = {
                active: true,
                roles: ["ROLE_USER","ROLE_ADMIN"],
                _id: "5bf9c6720f0b7f2d5cc5576b",
                email: "admin@admin.pl",
                password: "admin",
                createdDate: "2018-11-24T21:45:22.688Z",
                __v: 0
            };
    
            User.findOne.yields(null, expectedUser);
            var req = {
                params: {
                    id: "5bf9c6720f0b7f2d5cc5576b"
                }
            };
            var res = {
                status: sinon.stub(),
                json: sinon.stub()
            };
    
            UserController.getById(req, res, null);
            
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, expectedUser);
        });
    });

    context('DELETE BY ID', function() {
        it('CANNOT - user cannot remove another user', function() {
            var req = {
                params: {
                    id: "123"
                },
                userData: {
                    id: "1234"
                }
            };
            var res = {
                status: sinon.stub(),
                json: sinon.stub()
            };
    
            UserController.delete(req, res, null);
    
            sinon.assert.calledWith(res.status, 400);
            sinon.assert.calledWith(res.json, {
                message: "This delete operation is not allowed."
            });
        });
    
        it('CAN - success', function() {
            var req = {
                params: { id: "1234" },
                userData: { id: "1234" }
            };
            var res = {
                status: sinon.stub(),
                json: sinon.stub()
            };
    
            User.remove.yields(null, {});
    
            UserController.delete(req, res, null);
    
            sinon.assert.calledWith(res.status, 204);
            sinon.assert.calledWith(res.json, {
                message: "Deleted successfully."
            });
        });
    });

    context('LOGIN', function() {
        it('CANNOT - not found user by email', function() {
            var req = {
                body: {
                    email: "test@test.pl"
                }
            };
            var res = {
                status: sinon.stub(),
                json: sinon.stub()
            };
    
            User.find.yields(null,[]);
    
            UserController.login(req, res, null);
    
            sinon.assert.calledWith(res.status, 401);
            sinon.assert.calledWith(res.json, {
                message: "Auth failed."
            });
        });
    
        it('CANNOT - bcrypt compare failed.', function() {
            const expectedUser = {
                _id: "someid",
                email: "email",
                password: "password",
                roles: ['ROLE_USER']
            };
    
            var req = {
                body: {
                    email: "test@test.pl"
                }
            };
    
            var res = {
                status: sinon.stub(),
                json: sinon.stub()
            };
    
            User.find.yields(null, [expectedUser]);
            bcrypt.compare.yields({error: "error"}, null);
    
            UserController.login(req, res, null);
    
            sinon.assert.calledWith(res.status, 401);
            sinon.assert.calledWith(res.json, {message: "Authorization failed."});
        });
    
        it('CAN - success', function() {
            const expectedUser = {
                _id: "someid",
                email: "email",
                password: "password",
                roles: ['ROLE_USER']
            };
    
            var req = {
                body: {
                    email: "test@test.pl"
                }
            };
    
            var res = {
                status: sinon.stub(),
                json: sinon.stub(),
                setHeader: sinon.stub()
            };
    
            User.find.yields(null, [expectedUser]);
            bcrypt.compare.yields(null, "some-hash-from-test");
    
            UserController.login(req, res, null);
    
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.setHeader, "Authorization", sinon.match.string);
            sinon.assert.calledWith(res.json, {token: sinon.match.string}); 
        });
    });
});