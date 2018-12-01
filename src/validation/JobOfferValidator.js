const BaseJoi = require('joi');
const joiDateExtension = require('joi-date-extensions');
const Joi = BaseJoi.extend(joiDateExtension);

const jobOfferSchema = Joi.object().keys({
    title: Joi.string().min(1).max(50).required(),
    companyName: Joi.string().min(1).max(50).required(),
    categoryId: Joi.string().min(24).max(24).required(),
    from: Joi.date().format('DD-MM-YYYY').required(),
    to: Joi.date().format('DD-MM-YYYY').required()
});

module.exports = jobOfferSchema;