const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const {validateBooking, isLoggedIn, isBookingOwnerOrAdmin, isEmployee} = require('../middleware')
const booking = require('../controllers/booking')

router.post('/', isLoggedIn, isEmployee, validateBooking, catchAsync(booking.addBooking))

router.delete('/:bookingId', isLoggedIn, isBookingOwnerOrAdmin, isEmployee, catchAsync(booking.deleteBooking))

module.exports = router;


