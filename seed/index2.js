const mongoose = require('mongoose')
const Company = require('../models/company')
const Office = require('../models/office')
const Booking = require('../models/booking')
const User = require('../models/user')
const companyDetails = require('../seed/seedBiz')


mongoose.connect('mongodb://localhost:27017/hot-desk', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Database Connection Error'));
db.once("open", () => {
    console.log("Database Connection Established Sucessfully")
})

const seedDB = async () => {
    await Company.remove({})
    for(let i = 0; i < companyDetails.length; i++){
        const b = new Company(companyDetails[i])
        await b.save()
    }
}

seedDB().then(() => mongoose.connection.close())