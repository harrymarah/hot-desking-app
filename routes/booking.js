const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const {validateBooking, isLoggedIn} = require('../middleware')

const Booking = require('../models/booking')
const Office = require('../models/office')
const Company = require('../models/company')
const User = require('../models/user')
const ExpressError = require('../utils/ExpressError')
const user = require('../models/user')

router.post('/', isLoggedIn, validateBooking, catchAsync(async (req, res, next) => {
    if(req.body.booking.bookedAM !== 'on' && req.body.booking.bookedPM !== 'on') throw new ExpressError('You must choose a time slot for your booking.', 400)
    const booking = new Booking(req.body.booking)
    const office =  await Office.findById(req.params.officeid)
    const company = await Company.findById(req.params.id)
    const user = await User.findById(req.user._id)
    const {deskIndex} = req.body.booking
    const deskBooked = office.desks[deskIndex]

    if(req.body.booking.bookedAM === 'on') {
        booking.bookedAM = true
        booking.bookedAMBy = user
    }

    if(req.body.booking.bookedPM === 'on') {
        booking.bookedPM = true
        booking.bookedPMBy = user
    }

    booking.deskNumber = parseInt(deskIndex) + 1

    deskBooked.bookings.push(booking);
    user.bookings.push(booking)
    booking.office = office

    await booking.save()
    await office.save()
    await user.save()

    req.flash('success', 'Congratulations! You have successfully booked a desk!')

    res.redirect(`/company/${company._id}/${office._id}`)
}))

router.delete('/:bookingId', isLoggedIn, catchAsync(async (req, res, next) => {
    const office =  await Office.findById(req.params.officeid)
    const company = await Company.findById(req.params.id)
    const {bookingId} = req.params
    await Booking.findByIdAndDelete(bookingId)
    req.flash('success', 'Booking successfully deleted.')
    res.redirect(`/company/${company._id}/${office._id}`)
}))

module.exports = router;


