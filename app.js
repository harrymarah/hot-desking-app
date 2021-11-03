const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Business = require('./models/business')

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

app.get('/myoffices', async (req, res) => {
    const business = await Business.find({})
    res.render('business/index', {business})
})

app.post('/myoffices', async (req, res) => {
    const business = new Business(req.body.business)
    await business.save()
    res.redirect(`myoffices/${business._id}`)
})

app.get('/myoffices/new', (req,res) => {
    res.render('business/new')
})

app.get('/myoffices/:id', async (req,res) => {
    const business = await Business.findById(req.params.id)
    res.render('business/show', {business})
})

app.get('/myoffices/:id/edit', async (req, res) => {
    const business = await Business.findById(req.params.id)
    res.render('business/edit', {business})
})

app.put('/myoffices/:id', async (req, res) => {
    const {id} = req.params
    await Business.findByIdAndUpdate(id, {...req.body.business})
    res.redirect(`${id}`)
})

app.delete('/myoffices/:id', async (req, res) => {
    const {id} = req.params
    await Business.findByIdAndDelete(id)
    res.redirect('/myoffices')
})

app.get('*', (req, res) => {
    res.render('404')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})