const Office = require('../models/office')
const Company = require('../models/company')
const Booking = require('../models/booking')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.renderNewOfficeForm = async (req, res) => {
    const company = await Company.findById(req.params.id)
    res.render('office/new', {company})
}

module.exports.addOffice = async (req, res, next) => {
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
}

module.exports.showOffice = async (req, res) => {
    const office = await Office.findById(req.params.officeid).populate({path: 'desks.bookings', populate: {path: 'bookedAMBy bookedPMBy'}})
    const company = await Company.findById(req.params.id)
    if(!office){
        req.flash('error', 'Office not found')
        return res.redirect('/company')
    } 
    res.render('office/show', {office, company})
}

module.exports.renderOfficeEditForm = async (req, res) => {
    const office = await Office.findById(req.params.officeid)
    const company = await Company.findById(req.params.id)
    if(!office){
        req.flash('error', 'Office not found')
        return res.redirect('/company')
    } 
    res.render('office/edit', {office, company})
}

module.exports.editOffice = async (req, res, next) => {
    const office = await Office.findByIdAndUpdate(req.params.officeid, {...req.body.office}).populate({path: 'desks.bookings'})
    const newNoOfDesks = parseInt(req.body.noOfDesks)
    if(newNoOfDesks > office.desks.length){
        const difference = newNoOfDesks - office.desks.length
        for(let i = 0; i < difference; i++){
            office.desks.push({deskNumber: office.desks.length + i + 1})
        }
    }
    if(newNoOfDesks < office.desks.length){
        const difference = office.desks.length - newNoOfDesks
        console.log(office.desks)
        for(let i = office.desks.length; i > newNoOfDesks; i--){
            office.desks[i-1].bookings.forEach(b => b.deleteOne())
            office.desks.pop()
        }
        req.flash('warning', 'Previous bookings may have been lost due to the number of desks being reduced.')
    }
    if(req.file){
        await cloudinary.uploader.destroy(office.floorPlan.filename)
        office.floorPlan.url = req.file.path
        office.floorPlan.filename = req.file.filename
    }
    const geoData = await geocoder.forwardGeocode({
        query: Object.values(req.body.office.officeAddress).join(', '),
        limit: 1
    }).send()
    office.geometry = geoData.body.features[0].geometry;
    office.save()
    req.flash('success', 'Congratulations! You have successfully updated your office!')
    res.redirect(`${req.params.officeid}`)
}

module.exports.deleteOffice = async (req, res) => {
    const {id, officeid} = req.params
    const office = await Office.findById(officeid)
    const bookings = await Booking.deleteMany({office: office})
    office.deleteOne()
    req.flash('warning', 'Office and associated bookings sucessfully deleted.')
    res.redirect('/company')
}
