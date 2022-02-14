const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extention = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean
            }
        }
    }
});

const Joi = BaseJoi.extend(extention);

module.exports.companySchema = Joi.object({
    company: Joi.object({
        companyName: Joi.string().required().escapeHTML(),
        companyLogo: Joi.object({
            url: Joi.string().escapeHTML(),
            filename: Joi.string().escapeHTML()
        }),
        uniqueCompanyCode: Joi.string().escapeHTML().required().min(6).max(6)
            .messages({
                'string.min': 'Unique company code must be exactly 6 characters long', 
                'string.max': 'Unique company code must be exactly 6 characters long'
            }),
        companyPasscode: Joi.string().escapeHTML().required(),
        employees: Joi.object(),
        offices: Joi.array()
    }).required()
})

module.exports.officeSchema = Joi.object({
    office: Joi.object({
        officeNickname: Joi.string().escapeHTML().required(),
        officeAddress: Joi.object({
            streetAddress: Joi.string().escapeHTML().required(),
            town: Joi.string().escapeHTML(),
            county: Joi.string().escapeHTML(),
            postcode: Joi.string().escapeHTML().required()
        }).required(),
        geometry: Joi.object(),
        floorPlan: Joi.object({
            url: Joi.string().escapeHTML(),
            filename: Joi.string().escapeHTML()
        }),
        desks: Joi.array(),
        noOfDesks: Joi.any()
    }).required()
})

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        bookingDate: Joi.date().min('now').required()
        .messages({
            'date.min': 'Booking must be in the future.'
        }),
        deskIndex: Joi.number(),
        bookedAM: Joi.string().escapeHTML(),
        bookedPM: Joi.string().escapeHTML(),
        bookedAMBy: Joi.object(),
        bookedPMBy: Joi.object(),
    }).required()
})