const {companySchema, officeSchema, bookingSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const bcrypt = require('bcrypt');
const Booking = require('./models/booking');
const Company = require('./models/company')


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

module.exports.isBookingOwnerOrAdmin = async(req, res, next) => {
    const {id, officeid, bookingId} = req.params
    const booking = await Booking.findById(bookingId)
    if(req.user.isAdmin) return next()
    if(booking.bookedAM && booking.bookedPM){
        if(!booking.bookedAMBy.equals(req.user._id) && !booking.bookedPMBy.equals(req.user._id)){
            req.flash('error', 'You cannot delete other users bookings.')
            return res.redirect(req.headers.referer)
        }
    } else if (booking.bookedAM) {
        if(!booking.bookedAMBy.equals(req.user._id)){
            req.flash('error', 'You cannot delete other users bookings.')
            return res.redirect(req.headers.referer)
        }
    } else if (booking.bookedPM){
        if(!booking.bookedPMBy.equals(req.user._id)){
            req.flash('error', 'You cannot delete other users bookings.')
            return res.redirect(`/company/${id}/${officeid}`)
        }
    }
    next()
}

module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params;
    const business = await Business.findById(id);
    if(!business.addedBy.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/business/${id}`);
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if(!req.user.isAdmin){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect('/company')
    }
    next()
}

module.exports.isEmployee = async (req, res, next) => {
    const company = await Company.findById(req.params.id)
    if(req.user.company._id.toString() !== company._id.toString()){
        req.flash('error', 'You do not belong to that company!')
        return res.redirect('/company')
    }
    next()
}