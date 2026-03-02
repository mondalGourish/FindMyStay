//basically this schema is made for server side validation, it is imported in app.js and made a function which is passed as a middleware to the listing route and the 2nd one is for the review route so that noone can send a empty request from hopscotch or postman
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("",null),
    }).required()
});
//module.exports = listingSchema;

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
});