const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var CategorySchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, required: true, unique: true },
    jobOffers: [
        { type: Schema.Types.ObjectId, ref: 'JobOffer' }
    ]
});

module.exports = mongoose.model('Category', CategorySchema);