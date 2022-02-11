const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')

const passport = require('passport')
const {isLoggedIn, isAdmin, isEmployee} = require('../middleware')

const user = require('../controllers/user')

router.route('/register-admin')
    .get(user.renderRegisterAdminForm)
    .post(catchAsync(user.registerAdmin))

router.route('/register-employee')
    .get(catchAsync(user.renderRegisterEmployeeForm))
    .post(catchAsync(user.registerEmployee))

router.route('/login')
.get(user.renderLoginPage)
.post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), user.loginUser)

router.get('/logout', user.logoutUser)

router.get('/mybookings', isLoggedIn, catchAsync(user.renderBookingsPage))

router.get('/admin-panel', isLoggedIn, isAdmin, catchAsync(user.renderAdminPanel))

router.route('/admin/:userid')
    .put(user.changeUserAdminPermission)
    .delete(user.deleteUser)

module.exports = router
