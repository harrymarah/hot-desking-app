const express = require('express')
const router = express.Router({mergeParams: true})
const catchAsync = require('../utils/catchAsync')
const {validateOffice, isLoggedIn, isAdmin, isEmployee} = require('../middleware')
const office = require('../controllers/office')

const multer = require('multer')
const {storage, cloudinary} = require('../cloudinary')
const upload = multer({storage})

router.get('/newoffice', isLoggedIn, catchAsync(office.renderNewOfficeForm))

router.post('/office', upload.single('office[floorPlan]'),isLoggedIn, isAdmin, validateOffice, isEmployee, catchAsync(office.addOffice))

router.route('/:officeid')
    .get(isLoggedIn, isEmployee, catchAsync(office.showOffice))
    .put(isLoggedIn, isAdmin, isEmployee, upload.single('office[floorPlan]'), validateOffice, catchAsync(office.editOffice))
    .delete(isLoggedIn, isAdmin, isEmployee, catchAsync(office.deleteOffice))

router.get('/:officeid/edit', isLoggedIn, isAdmin, isEmployee, catchAsync(office.renderOfficeEditForm))

module.exports = router