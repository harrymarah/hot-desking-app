const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const Business = require('./models/business')
const Company = require('./models/company')
const Office = require('./models/office')
const Booking = require('./models/booking')
const User = require('./models/user')

mongoose.connect('mongodb://localhost:27017/hot-desk', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Database Connection Error'));
db.once("open", () => {
    console.log("Database Connection Established Sucessfully")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/company', async (req, res) => {
    const company = await Company.find({})
    res.render('company/index', {company})
})

app.post('/company', async (req, res) => {
    const company = new Company(req.body.company)
    await company.save()
    res.redirect(`company/${company._id}`)
})

app.get('/company/new', (req,res) => {
    res.render('company/new')
})

app.get('/company/:id', async (req,res) => {
    const company = await (await Company.findById(req.params.id)).populate({path: 'offices'})
    res.render('company/show', {company})
})

app.get('/company/:id/edit', async (req, res) => {
    const company = await Company.findById(req.params.id)
    res.render('company/edit', {company})
})

app.get('/company/:id/newoffice', async (req, res) => {
    const company = await Company.findById(req.params.id)
    res.render('office/new', {company})
})

app.post('/company/:id/office', async (req, res) => {
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

app.put('/company/:id', async (req, res) => {
    const {id} = req.params
    await Company.findByIdAndUpdate(id, {...req.body.company})
    res.redirect(`${id}`)
})

app.delete('/company/:id', async (req, res) => {
    const {id} = req.params
    await Company.findByIdAndDelete(id)
    res.redirect('/company')
})

app.get('/company/:id/:officeid', (req, res) => {
    res.send('working')
})

app.get('/company/:id/:officeid/edit', async (req, res) => {
    const office = await Office.findById(req.params.officeid)
    res.render('office/edit', {office})
})

app.all('*', (req, res) => {
    res.status(404).render('404')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})