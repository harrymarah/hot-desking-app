const express = require('express')
const router = express.Router({mergeParams: true})

const Booking = require('../models/booking')
const Office = require('../models/office')
const Company = require('../models/company')

router.post('/', async (req, res) => {
    const booking = new Booking(req.body.booking)
    const office =  await Office.findById(req.params.officeid)
    const company = await Company.findById(req.params.id)
    const {deskIndex} = req.body.booking
    const deskBooked = office.desks[deskIndex]

    if(req.body.booking.bookedAM === 'on') booking.bookedAM = true
    if(req.body.booking.bookedPM === 'on') booking.bookedPM = true

    deskBooked.bookings.push(booking);

    await booking.save()
    await office.save()

    res.redirect(`/company/${company._id}/${office._id}`)
})

module.exports = router;


