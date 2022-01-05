const express = require('express')
const router = express.Router({mergeParams: true})

const Booking = require('../models/booking')

router.post('/', (req, res) => {
    const {deskIndex, date, amBooking, pmBooking, allDayBooking} = req.body.booking
    res.send(req.body.booking)
    console.log(deskIndex)
})

module.exports = router;



