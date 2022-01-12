const {companySchema, officeSchema, bookingSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')


module.exports.validateCompany = (req, res, next) => {
    const {error} = companySchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateOffice = (req, res, next) => {
    const {error} = officeSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateBooking = (req, res, next) => {
    const {error} = bookingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

