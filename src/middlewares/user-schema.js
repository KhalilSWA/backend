const Joi = require('joi');

const Schema = {
    authSchema: Joi.object({
        email: Joi.string().email().required(),
        userName: Joi.string().required(),
        phone: Joi.string().length(8).pattern(/^[0-9]+$/).required(),
        password: Joi.string().min(6).max(32).required()
    }),
    loginSchema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(32).required()
    }),
    updateSchema: Joi.object({
        userName: Joi.string(),
        phone: Joi.string().length(8).pattern(/^[0-9]+$/),
        old_password: Joi.string().min(6).max(32).when('password', { is: Joi.exist(), then: Joi.required(), otherwise: Joi.optional() }),
        password: Joi.string().min(6).max(32)
    }).min(1),
}

module.exports = Schema;