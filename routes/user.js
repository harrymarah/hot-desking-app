const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user')
const { models } = require('mongoose')

router.get('/register-admin', (req, res) => {
    res.render('users/register-admin')
})

router.post('/register-admin', catchAsync(async (req, res) => {
    try{
        const {email, username, password} = req.body
        const user = new User({email, username})
        user.isAdmin = true
        const registeredUser = await User.register(user, password)
    } catch(e){
        req.flash('error', e.message)
        res.redirect('/register-admin')
    }
    console.log(registeredUser)
    req.flash('success', 'Welcome to hotDesk! Add your company details below.')
    res.redirect('/company/new')
}))

router.get('/register-employee', (req, res) => {
    res.render('users/register-employee')
})


module.exports = router
