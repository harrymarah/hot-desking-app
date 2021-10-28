const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BusinessSchema = new Schema({
    name: String,
    address: String,
    floorPlan: String,
    numOfDesks: Number,
    businessCode: String
})

module.exports = mongoose.model('Business', BusinessSchema);