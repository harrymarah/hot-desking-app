const Joi = require('joi');

module.exports.companySchema = Joi.object({
    company: Joi.object({
        companyName: Joi.string().required(),
        companyLogo: Joi.string().required(),
        uniqueCompanyCode: Joi.string().required().min(6).max(6)
            .messages({
                'string.min': 'Unique company code must be exactly 6 characters long', 
                'string.max': 'Unique company code must be exactly 6 characters long'
            }),
        companyPasscode: Joi.string().required(),
        employees: Joi.object(),
        offices: Joi.array()
    }).required()
})

module.exports.officeSchema = Joi.object({
    office: Joi.object({
        officeNickname: Joi.string().required(),
        officeAddress: Joi.object({
            streetAddress: Joi.string().required(),
            town: Joi.string(),
            county: Joi.string(),
            postcode: Joi.string().required()
        }).required(),
        floorPlan: Joi.string(),
        desks: Joi.array()
    }).required()
})

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        bookingDate: Joi.date().min('now').required()
        .messages({
            'date.min': 'Booking must be in the future.'
        }),
        deskIndex: Joi.number(),
        bookedAM: Joi.string(),
        bookedPM: Joi.string(),
        bookedAMBy: Joi.object(),
        bookedPMBy: Joi.object(),
    }).required()
})