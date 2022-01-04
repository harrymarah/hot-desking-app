const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookingSchema = new Schema({
    bookingDate: Date,
    bookedAM: Boolean,
    bookedPM: Boolean,
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Booking', BookingSchema);