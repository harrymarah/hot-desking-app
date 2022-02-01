const mongoose = require('mongoose');
const office = require('./office');
const Schema = mongoose.Schema

const BookingSchema = new Schema({
    bookingDate: Date,
    bookedAM: Boolean,
    bookedPM: Boolean,
    bookedAMBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    bookedPMBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    office: {
        type: Schema.Types.ObjectId,
        ref: 'Office'
    }
})

module.exports = mongoose.model('Booking', BookingSchema);