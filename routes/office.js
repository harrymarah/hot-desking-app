const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const {validateOffice, isLoggedIn} = require('../middleware')

const Office = require('../models/office')
const Company = require('../models/company')

const multer = require('multer')
const {storage, cloudinary} = require('../cloudinary')
const upload = multer({storage})

router.get('/newoffice', isLoggedIn, catchAsync(async (req, res) => {
    const company = await Company.findById(req.params.id)
    res.render('office/new', {company})
}))

router.post('/office', upload.single('office[floorPlan]'), validateOffice, catchAsync(async (req, res, next) => {
    const {id} = req.params
    const company = await Company.findById(id)
    const office = new Office(req.body.office)
    company.offices.push(office)
    for(let i = 0; i < req.body.noOfDesks; i++){
        await office.desks.push({deskNumber: i + 1})
    }
    office.floorPlan.url = req.file.path
    office.floorPlan.filename = req.file.filename
    await company.save()
    await office.save()
    req.flash('success', 'Congratulations! You have successfully added your office!')
    res.redirect(`/company/${company._id}`)
}))

router.get('/:officeid', isLoggedIn, catchAsync(async (req, res) => {
    const office = await Office.findById(req.params.officeid).populate({path: 'desks.bookings',})
    const company = await Company.findById(req.params.id)
    if(!office){
        req.flash('error', 'Office not found')
        return res.redirect('/company')
    } 
    res.render('office/show', {office, company})
}))

router.get('/:officeid/edit', isLoggedIn, catchAsync(async (req, res) => {
    const office = await Office.findById(req.params.officeid)
    const company = await Company.findById(req.params.id)
    if(!office){
        req.flash('error', 'Office not found')
        return res.redirect('/company')
    } 
    res.render('office/edit', {office, company})
}))

router.put('/:officeid', isLoggedIn, upload.single('office[floorPlan]'), validateOffice, catchAsync(async (req, res, next) => {
    const office = await Office.findByIdAndUpdate(req.params.officeid, {...req.body.office})
    if(req.file){
        await cloudinary.uploader.destroy(office.floorPlan.filename)
        office.floorPlan.url = req.file.path
        office.floorPlan.filename = req.file.filename
        office.save()
    }
    req.flash('success', 'Congratulations! You have successfully updated your office!')
    res.redirect(`${req.params.officeid}`)
}))

module.exports = router