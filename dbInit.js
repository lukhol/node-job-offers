const User = require('./src/models/User');
const Category = require('./src/models/Category');
const mongoose = require('mongoose');

module.exports = (connection) => {
    console.log('MongoDB connected!');

    User.findOne({email: "admin@admin.pl"}).exec()
        .then(user => {
            if(user == null) {
                var user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: 'admin@admin.pl',
                    password: 'admin',
                    roles: [
                        "ROLE_USER", "ROLE_ADMIN"
                    ]
                });

                return user.save();
            } else {
                console.log(user.hasRole('ROLE_USER'));
            }
        })
        .then(result => {
            if(result) {
                console.log('Admin user created.');
            }
        })
        .catch(err => console.log(err));

    Category.find({name: "IT"}, function(err, doc) {
        if(!err) {
            const category = new Category({
                _id: new mongoose.Types.ObjectId(),
                name: 'IT'
            });

            category.save((err, res) => {
                if(res) {
                    console.log(`Category IT added, Id: ${res._id}`);
                }
            });
        }
    });
};