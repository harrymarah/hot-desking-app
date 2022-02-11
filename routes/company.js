const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {validateCompany, hashPasscode, isLoggedIn, isAdmin, isEmployee} = require('../middleware')
const company = require('../controllers/company')

const multer = require('multer')
const {storage, cloudinary} = require('../cloudinary')
const upload = multer({storage})

router.route('/')
    .get(isLoggedIn, catchAsync(company.renderCompanyPage))
    .post(isLoggedIn, isAdmin, upload.single('company[companyLogo]'), validateCompany, catchAsync(company.addCompany))

router.get('/new', isLoggedIn, isAdmin, company.renderNewCompanyForm)

router.route('/:id')
    .get(isLoggedIn, isEmployee, catchAsync(company.showCompany))
    .put(isLoggedIn, isAdmin, isEmployee, upload.single('company[companyLogo]'), catchAsync(company.editCompany))
    .delete(isLoggedIn, isAdmin, isEmployee, catchAsync(company.destroyCompany))

router.get('/:id/edit', isLoggedIn, isAdmin, isEmployee, catchAsync(company.renderCompanyEditForm))

module.exports = router;