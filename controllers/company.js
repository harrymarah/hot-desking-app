const Company = require('../models/company')
const User = require('../models/user')
const {hashPasscode} = require('../middleware')

module.exports.renderCompanyPage = async (req, res) => {
    const user = await User.findById(req.user._id)
    const company = await Company.findOne({employees: user}).populate({path: 'offices'})
    if(!company) res.redirect('company/new')
    res.render('company/show', {company})
}

module.exports.addCompany = async (req, res) => {
    const company = new Company(req.body.company)
    const user = await User.findById(req.user._id)
    company.uniqueCompanyCode = company.uniqueCompanyCode.toUpperCase()
    company.companyPasscode = await hashPasscode(req.body.company.companyPasscode)
    company.employees.push(user)
    user.company = company
    company.companyLogo.url = req.file.path
    company.companyLogo.filename = req.file.filename
    await company.save()
    await user.save()
    req.flash('success', 'Congratulations! You have successfully registered your company!')
    res.redirect(`company/${company._id}`)
}

module.exports.renderNewCompanyForm = (req,res) => {
    res.render('company/new')
}

module.exports.showCompany = async (req,res) => {
    const company = await Company.findById(req.params.id).populate({path: 'offices'})
    if(!company){
        req.flash('error', 'Company not found')
        return res.redirect('/company')
    } 
    res.render('company/show', {company})
}

module.exports.renderCompanyEditForm = async (req, res) => {
    const company = await Company.findById(req.params.id)
    if(!company){
        req.flash('error', 'Company not found')
        return res.redirect('/company')
    } 
    res.render('company/edit', {company})
}

module.exports.editCompany = async (req, res, next) => {
    const {id} = req.params
    const company = await Company.findByIdAndUpdate(id, {...req.body.company})
    if(req.file){
        await cloudinary.uploader.destroy(company.companyLogo.filename)
        company.companyLogo.url = req.file.path
        company.companyLogo.filename = req.file.filename
        company.save()
    }
    req.flash('success', 'Congratulations! You have successfully updated your company!')
    res.redirect(`${id}`)
}

module.exports.destroyCompany = async (req, res) => {
    const {id} = req.params
    const company = await Company.findById(id).populate({path: 'offices'})
    company.offices.forEach(office => office.deleteOne())
    const users = await User.find({company: company}).populate({path: 'bookings'})
    users.forEach(user => {
        if(user.bookings){
            user.bookings.forEach(booking => booking.deleteOne())
        }
    })
    users.forEach(user => user.deleteOne())
    company.deleteOne()
    res.redirect('/')
}