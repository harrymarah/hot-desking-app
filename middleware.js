const {companySchema, officeSchema, bookingSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const bcrypt = require('bcrypt')


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
    const {error} = officeSchema.validate(req.body, {allowUnknown: true});
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

module.exports.hashPasscode = async (passcode) => {
    const hash = await bcrypt.hash(passcode, 12)
    return hash
}

module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be logged in to do that!')
        return res.redirect('/login')
    }
    next()
}

module.exports.isAdmin = (req, res, next) => {
    if(!req.user.isAdmin){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect('/company')
    }
    next()
}