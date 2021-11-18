const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CompanySchema = new Schema({
    companyName: String,
    companyLogo: String,
    uniqueCompanyCode: String,
    companyPasscode: String,
    employees: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    offices: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Office'
        }
    ],
})

module.exports = mongoose.model('Company', CompanySchema);
