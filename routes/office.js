const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const {validateOffice, isLoggedIn, isAdmin, isEmployee} = require('../middleware')

const Office = require('../models/office')
const Company = require('../models/company')
const Booking = require('../models/booking')

const multer = require('multer')
const {storage, cloudinary} = require('../cloudinary')
const upload = multer({storage})

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

router.get('/newoffice', isLoggedIn, catchAsync(async (req, res) => {
    const company = await Company.findById(req.params.id)
    res.render('office/new', {company})
}))

router.post('/office', upload.single('office[floorPlan]'),isLoggedIn, isAdmin, validateOffice, isEmployee, catchAsync(async (req, res, next) => {
    const {id} = req.params
    const company = await Company.findById(id)
    const office = new Office(req.body.office)
    const geoData = await geocoder.forwardGeocode({
        query: Object.values(req.body.office.officeAddress).join(', '),
        limit: 1
    }).send()
    office.geometry = geoData.body.features[0].geometry;
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

router.get('/:officeid', isLoggedIn, isEmployee, catchAsync(async (req, res) => {
    const office = await Office.findById(req.params.officeid).populate({path: 'desks.bookings', populate: {path: 'bookedAMBy bookedPMBy'}})
    const company = await Company.findById(req.params.id)
    if(!office){
        req.flash('error', 'Office not found')
        return res.redirect('/company')
    } 
    res.render('office/show', {office, company})
}))

router.get('/:officeid/edit', isLoggedIn, isAdmin, isEmployee, catchAsync(async (req, res) => {
    const office = await Office.findById(req.params.officeid)
    const company = await Company.findById(req.params.id)
    if(!office){
        req.flash('error', 'Office not found')
        return res.redirect('/company')
    } 
    res.render('office/edit', {office, company})
}))

router.put('/:officeid', isLoggedIn, isAdmin, isEmployee, upload.single('office[floorPlan]'), validateOffice, catchAsync(async (req, res, next) => {
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

router.delete('/:officeid', isLoggedIn, isAdmin, isEmployee, async (req, res) => {
    const {id, officeid} = req.params
    const office = await Office.findById(officeid)
    const bookings = await Booking.deleteMany({office: office})
    office.deleteOne()
    req.flash('warning', 'Office and associated bookings sucessfully deleted.')
    res.redirect('/company')
})

module.exports = router