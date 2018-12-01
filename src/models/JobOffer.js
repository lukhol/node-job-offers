const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var JobOfferSchema = new Schema({
    _id: Schema.Types.ObjectId,
    title: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    companyName: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

JobOfferSchema.methods.getLocation = function() {
    return `/job/offers/${this._id}`;
};

module.exports = mongoose.model('JobOffer', JobOfferSchema);