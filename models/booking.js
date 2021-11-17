const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookingSchema = new Schema({
    bookedFrom: Date,
    bookedTo: Date,
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

