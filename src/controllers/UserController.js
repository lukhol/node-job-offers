const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = (req, res, next) => {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if(user != null) {
                res.status(409).json({message: "Invalid email. Choose another one."});
                return;
            }

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    res.status(409).json({message: "Something went wrong"});
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        active: true,
                        roles: [
                            'ROLE_USER'
                        ]
                    });

                    user.save().then(doc => {
                        res.status(201).json({message: "User created"});
                    })
                    .catch(err => {
                        res.status(400).json({message: "Error ocurred during creating user"});
                    });
                }
            });
        }) 
        .catch(err => {
            res.status(400).json({message: "This email is occupied."});
        })
};

exports.login = (req, res, next) => {
    User.find({email: req.body.email}, (err, user) => {
        if(user.length < 1) {
            res.status(401);
            res.json({message: "Auth failed."}); 
            return;
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err || !result) {
                res.status(401);
                res.json({message: "Authorization failed."}); 
                return;
            }

            const token = jwt.sign({
                id: user[0]._id,
                email: user[0].email,
                roles: user[0].roles
            }, 'secret-key', {
                expiresIn: "24h"
            });
            
            res.setHeader('Authorization', `Bearer ${token}`);
            res.status(200);
            res.json({
                token: token
            });
        });
    });
};

exports.delete = (req, res, next) => {
    if(req.userData.id === req.params.id) {
        User.remove({_id: req.params.id}, (err, doc) => {
            res.status(204);
            res.json({
                message: "Deleted successfully."
            });
        });
    } else {
        res.status(400);
        res.json({
            message: "This delete operation is not allowed."
        });
    }
};

exports.getById = (req, res, next) => {
    User.findOne({_id: req.params.id}, function(err, doc) {
        if(err) {
            res.status(404);
            res.json({
                message: err
            });
        }

        res.status(200);
        res.json(doc);
    });
};