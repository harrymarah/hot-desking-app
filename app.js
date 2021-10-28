const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/registerbusiness', async (req, res) => {
    const biz = new Business({name: 'HMVA', address: '139 The Queens Drive', numOfDesks: 25, businessCode: 'HMVA94'})
    await biz.save()
    res.send(biz)
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})