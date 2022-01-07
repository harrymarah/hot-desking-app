const express = require('express')
const router = express.Router({mergeParams: true})

const Booking = require('../models/booking')
const Office = require('../models/office')

router.post('/', async (req, res) => {
    const booking = new Booking(req.body.booking)
    const office =  await Office.findById(req.params.officeid)
    const deskNumber = office.desks[req.body.booking.deskIndex]

    if(req.body.booking.bookedAM === 'on') booking.bookedAM = true
    if(req.body.booking.bookedPM === 'on') booking.bookedPM = true

    deskNumber.push(booking)
    await deskNumber.save()

    console.log(booking)
    res.send(deskNumber)
})

module.exports = router;


