const Joi = require('joi');

const Schema = {
    postSchema: Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        price: Joi.number().min(0).required(),
        pictures: Joi.array().items(Joi.string())
    }),
    updateSchema: Joi.object({
        title: Joi.string(),
        content: Joi.string(),
        price: Joi.number().min(0),
        pictures: Joi.array().items(Joi.string())
    }).min(1),
    loadPostsSchema: Joi.object({
        page: Joi.number().min(0).default(0),
        limit: Joi.number().min(1).max(50).default(10)
    })
}

module.exports = Schema;