const Joi = require('joi');
module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow('', null),
    country: Joi.string().required().pattern(/^[a-zA-Z\s\-]+$/).messages({
        'string.pattern.base': 'Country name must contain only letters, spaces, and hyphens'
    })
});
module.exports.reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
});