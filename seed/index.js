const mongoose = require('mongoose');
const business = require('../models/business');
const Business = require('../models/business')
const businessDetails = require('./seedBiz')

mongoose.connect('mongodb://localhost:27017/hot-desk', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Database Connection Error'));
db.once("open", () => {
    console.log("Database Connection Established Sucessfully")
})

const seedDb = async () => {
    await Business.deleteMany({})
    for(let i = 0; i < businessDetails.length; i++){
        const b = new Business(businessDetails[i])
        await b.save()
    }
}

seedDb()