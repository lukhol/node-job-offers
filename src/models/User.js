const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: { 
        type: String, required: true, unique: true,
        match:  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: [true, 'Password is required'] },
    active: { type: Boolean, default: true }, 
    createdDate: { type: Date, default: Date.now },
    roles: [
        {
            type: String, 
            enum: ["ROLE_USER", "ROLE_ADMIN"],
            default: "ROLE_ADMIN"
        }
    ]
});

UserSchema.pre('save', next => {
    let now = new Date();
    if(!this.createdDate) {
        this.createdDate = now;
    }

    next();
});

UserSchema.methods.hasRole = function(role) {
    return this.roles.includes(role);
};

module.exports = mongoose.model('User', UserSchema);