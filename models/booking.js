const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookingSchema = new Schema({
    bookedFrom: Date,
    bookedTo: Date,
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Booking', BookingSchema);