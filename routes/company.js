const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')

const Company = require('../models/company')

router.get('/', catchAsync(async (req, res) => {
    const company = await Company.find({})
    res.render('company/index', {company})
}))

router.post('/', catchAsync(async (req, res) => {
    const company = new Company(req.body.company)
    await company.save()
    res.redirect(`company/${company._id}`)
}))

router.get('/new', (req,res) => {
    res.render('company/new')
})

router.get('/:id', catchAsync(async (req,res) => {
    const company = await (await Company.findById(req.params.id)).populate({path: 'offices'})
    res.render('company/show', {company})
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const company = await Company.findById(req.params.id)
    res.render('company/edit', {company})
}))


router.put('/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    await Company.findByIdAndUpdate(id, {...req.body.company})
    res.redirect(`${id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params
    await Company.findByIdAndDelete(id)
    res.redirect('/company')
}))

module.exports = router;