const mongoose = require('mongoose')
const Schema = mongoose.Schema


const OfficeSchema = new Schema({
    officeAddress:{
        streetAddress: String,
        town: String,
        county: String,
        postcode: String
    },
    floorPlan: String,
    desks: [
        {
            deskNumber: Number,
            bookings:{
                type: Schema.Types.ObjectId,
                ref: 'Booking'
            }
        }
    ]
})