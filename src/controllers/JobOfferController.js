const JobOffer = require('../models/JobOffer');
const Category = require('../models/Category');
const mongoose = require('mongoose');
const moment = require('moment');
const Joi = require('joi');
const jobOfferValidator = require('../validation/JobOfferValidator');

class JobOfferController {
    getAll (req, res, next) {
        JobOffer.find((err, docs) => {
            if(err) {
                res.status(500);
                return res.json({
                    message: "Something went wrong. Sorry :("
                });
            }
    
            res.status(200);
            res.json(docs.map(item => {
                return {
                    id: item._id,
                    title: item.title,
                    from: item.from,
                    companyName: item.companyName,
                    categoryId: item.category._id
                }
            }));
        });
    }

    getById(req, res, next) {
        JobOffer.findOne({_id: req.params.id}, function(err, doc) {
            if(err || !doc) {
                res.status(404);
                return res.json({});
            }
    
            res.status(200);
            res.json({
                id: doc._id,
                title: doc.title,
                from: doc.from,
                to: doc.to, 
                companyName: doc.companyName,
                categoryId: doc.category._id
            });
        });
    }

    create(req, res, next) {
        const validationResult = Joi.validate(req.body, jobOfferValidator);
        if(validationResult.error) {
            res.status(400);
            return res.json(validationResult.error.details.map(d => d.message));
        }
    
        Category.findOne({_id: req.body.categoryId}, function(err, doc) {
            if(err) {
                res.status(500);
                return res.json({
                    message: "CategoryId cannot be empty."
                });
            }
    
            const jobOffer = new JobOffer({
                _id: new mongoose.Types.ObjectId(),
                title: req.body.title,
                from: moment(req.body.from, 'DD-MM-YYYY').toDate(),
                to: moment(req.body.to, 'DD-MM-YYYY').toDate(),
                companyName: req.body.companyName,
                category: doc._id,
                user: req.userData.id
            })
            .save(function(err, result) {
                if(err) {
                    res.status(500);
                    return res.json({
                        message: "Saving failed. Try again later."
                    });
                }
    
                res.status(201);
                res.location(result.getLocation());
                res.end();
            });;
        });
    }

    async search(req, res, next) {
        try {
            const result = await JobOffer.find({
                $and: [
                    { category: { $in : req.query.categoryId } },
                    { user: { $in: req.query.userId } }
                ]
            });
            
            res.status(200);
            res.json(result.map(it => {
                return {
                    id: it._id,
                    from: it.from,
                    to: it.to,
                    companyName: it.companyName,
                    category: it.category,
                    user: it.user
                }
            }));
        } catch (e) {
            res.status(400);
            res.json({
                message: "Database call failed."
            });
        }
    };
};

module.exports = new JobOfferController();