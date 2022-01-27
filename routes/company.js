const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {validateCompany, hashPasscode, isLoggedIn} = require('../middleware')

const Company = require('../models/company')

router.get('/', catchAsync(async (req, res) => {
    const company = await Company.find({})
    res.render('company/index', {company})
}))

router.post('/', isLoggedIn, validateCompany, catchAsync(async (req, res, next) => {
    const company = new Company(req.body.company)
    company.companyPasscode = await hashPasscode(req.body.company.companyPasscode)
    await company.save()
    req.flash('success', 'Congratulations! You have successfully registered your company!')
    res.redirect(`company/${company._id}`)
}))

router.get('/new', isLoggedIn, (req,res) => {
    res.render('company/new')
})

router.get('/:id', isLoggedIn, catchAsync(async (req,res) => {
    const company = await (await Company.findById(req.params.id)).populate({path: 'offices'})
    if(!company){
        req.flash('error', 'Company not found')
        return res.redirect('/company')
    } 
    res.render('company/show', {company})
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const company = await Company.findById(req.params.id)
    if(!company){
        req.flash('error', 'Company not found')
        return res.redirect('/company')
    } 
    res.render('company/edit', {company})
}))


router.put('/:id', isLoggedIn, validateCompany, catchAsync(async (req, res, next) => {
    const {id} = req.params
    await Company.findByIdAndUpdate(id, {...req.body.company})
    req.flash('success', 'Congratulations! You have successfully updated your company!')
    res.redirect(`${id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params
    await Company.findByIdAndDelete(id)
    req.flash('success', 'You have successfully deleted your company.')
    res.redirect('/company')
}))

module.exports = router;