const User = require('../models/user')
const Company = require('../models/company')
const Booking = require('../models/booking')
const Office = require('../models/office')

const bcrypt = require('bcrypt')
const { models } = require('mongoose')


module.exports.renderRegisterAdminForm = (req, res) => {
    res.render('users/register-admin')
}

module.exports.renderRegisterEmployeeForm = (req, res) => {
    res.render('users/register-employee')
}

module.exports.registerAdmin = async (req, res, next) => {
    try{
        const {email, username, password} = req.body
        const user = new User({email, username})
        user.isAdmin = true
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) return next(err)
            req.flash('success', 'Welcome to hotDesk! Add your company details below.')
            res.redirect('/company/new')
        })
    } catch(e){
        req.flash('error', e.message)
        return res.redirect('/register-admin')
    }
}

module.exports.registerEmployee = async (req, res) => {
    const {email, username, password, companyCode, companyPasscode} = req.body
    const company = await Company.findOne({uniqueCompanyCode: companyCode})
    if(!company){
        req.flash('error', 'Company or company passcode not recognised.')
        return res.redirect('/register-employee')
    }
    const result = await bcrypt.compare(companyPasscode, company.companyPasscode)
    if(result){
        try{
            const user = new User({email, username})
            user.isAdmin = false
            const registeredUser = await User.register(user, password)
            company.employees.push(registeredUser)
            user.company = company
            await company.save()
            await user.save()
            req.login(registeredUser, err => {
                if(err) return next(err)
                req.flash('success', 'Welcome to hotDesk!')
                res.redirect('/company')
            })
        } catch(e){
            req.flash('error', e.message)
            res.redirect('/register-employee')
        }
    } else {
        req.flash('error', 'Company or company passcode not recognised')
        return res.redirect('/register-employee')
    }
}

module.exports.renderLoginPage = (req, res) => {
    if(req.user) return res.redirect('/company')
    else return res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}!`)
    const redirectUrl = req.session.returnTo || '/company'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res) => {
    req.logout()
    res.redirect('/')
}

module.exports.renderBookingsPage = async(req, res) => {
    const user = await User.findById(req.user._id)
    .populate({
        path: 'bookings',
        populate: {path: 'office'}
    })
    const company = await Company.find({employees: user})
    res.render('bookings/show', {user, company})
}

module.exports.renderAdminPanel = async(req, res) => {
    const users = await User.find({company: req.user.company})
    const company = await Company.find({employees: req.user._id})
    .populate({path: 'offices', 
    populate: {path: 'desks.bookings',
    populate: {path: 'bookedAMBy bookedPMBy'}}})
    res.render('users/admin-panel', {users, company})
}

module.exports.changeUserAdminPermission = async(req, res) => {
    const {userid} = req.params
    const user = await User.findById(userid)
    const {adminStatus} = req.body
    if(userid.toString() === req.user._id.toString()){
        req.flash('error', 'You cannot makes changes to your own account.')
        return res.redirect('/admin-panel')
    }
    if(adminStatus){
        user.isAdmin = true
        await user.save()
        return res.redirect('/admin-panel')
    }  
    if(!adminStatus){
        user.isAdmin = false
        await user.save()
        return res.redirect('/admin-panel')
    }
}

module.exports.deleteUser = async(req, res) => {
    const {userid} = req.params
    const user = await User.findById(userid)
    if(userid.toString() === req.user._id.toString()){
        req.flash('error', 'You cannot makes changes to your own account.')
        return res.redirect('/admin-panel')
    }
    const bookings = await Booking.deleteMany({$or: [{bookedAMBy: user}, {bookedPMBy: user}]})
    await user.deleteOne()
    req.flash('warning', 'User and associated bookings sucessfully deleted.')
    res.redirect('/admin-panel')
}

