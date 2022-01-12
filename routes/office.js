const express = require('express')
const router = express.Router({mergeParams: true})

const Office = require('../models/office')
const Company = require('../models/company')


router.get('/newoffice', async (req, res) => {
    const company = await Company.findById(req.params.id)
    res.render('office/new', {company})
})

router.post('/office', async (req, res) => {
    const {id} = req.params
    const company = await Company.findById(id)
    const office = new Office(req.body.office)
    company.offices.push(office)
    for(let i = 0; i < req.body.noOfDesks; i++){
        await office.desks.push({deskNumber: i + 1})
    }
    await company.save()
    await office.save()
    res.redirect(`/company/${company._id}`)
})

router.get('/:officeid', async (req, res) => {
    const office = await Office.findById(req.params.officeid).populate({path: 'desks.bookings'})
    const company = await Company.findById(req.params.id)
    res.render('office/show', {office, company})
})

router.get('/:officeid/edit', async (req, res) => {
    const office = await Office.findById(req.params.officeid)
    const company = await Company.findById(req.params.id)
    res.render('office/edit', {office, company})
})

router.put('/:officeid', async (req, res) => {
    const {officeid, id} = req.params
    const office = await Office.findById(req.params.officeid)
    await Office.findByIdAndUpdate(officeid, {...req.body.office})
    res.redirect(`${officeid}`)
})

module.exports = router