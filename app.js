if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const CronJob = require('cron').CronJob
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require('connect-mongo')

const User = require('./models/user')
const Booking = require('./models/booking')

const companies = require('./routes/company')
const offices = require('./routes/office')
const bookings = require('./routes/booking')
const users = require('./routes/user')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/hot-desk'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Database Connection Error'));
db.once("open", () => console.log("Database Connection Established Sucessfully"))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.end.SECRET || 'thisisasecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on('error', function(e) {
    console.log('Session store error')
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 604800000, //miliseconds in a week
        maxAge: 604800000,
    }
}
app.use(session(sessionConfig))
app.use(flash())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdnjs.cloudflare.com"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = ["https://cdnjs.cloudflare.com"];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dtyeth4uh/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const deleteExpiredBookings = new CronJob('00 00 00 * * *', async () => {
    const deleteDate = new Date(Date.now())
    deleteDate.setDate(deleteDate.getDate() - 3)
    await Booking.deleteMany({bookingDate: {$lt: deleteDate}})
})

deleteExpiredBookings.start()

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.warning = req.flash('warning')
    next()
})

app.use('/company', companies)
app.use('/company/:id', offices)
app.use('/company/:id/:officeid/bookings', bookings)
app.use('/', users)


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
    res.status(404).render('404')
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Something went wrong'} = err;
    if(!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode)
    if(statusCode === 404) return res.render('404')
    req.flash('error', err.message)
    console.log(err)
    res.redirect('back')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})