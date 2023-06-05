if (!process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// ATLAS USERNAME: user1        PASSWORD: HYPY3dVSQ8Nf8llU

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressError = require('./utils/expressError');
const expressSessions = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');



const campgroundsRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/user');


// mongoose.connect('mongodb://localhost:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
// const dbUrl = process.env.DB_URL;

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
    // await mongoose.connect(dbUrl);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database Connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(mongoSanitize({ replaceWith: '_' }));


app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: { secret }
})

const sessionConfig = {
    store,
    name: 'YelpSession',
    secret,
    resave: false,
    // security: true,  //PROVES HTTPS SUPPORT (LOCALHOST ISN'T HTTPS BUT IS HTTP, HENCE IT WONT WORK ON LOCALHOST)
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.use(expressSessions(sessionConfig));

app.use(flash());
app.use(helmet());

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

];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
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
                "https://res.cloudinary.com/dsj08kdma/", // LAST BIT IS THE ACCOUNT ID ON CLOUDINARY TO RESTRICT IMAGES ONLY FROM ADMIN ACCT
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // This is a workaround for a bug that would add the 'returnTo' value to the session and even if we go to 
    // someother page OR try to login on our own before being prompted by the auth handlers, we'll still be 
    // redirected to the original page (which made the 'returnTo' val in session (mostly its the New Campground page)).
    if (!['/login', '/', '/logout', '/register'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.get('/', (req, res) => {
    console.log(req.query)
    res.render('home');
})

app.get('/fakeuser', async (req, res) => {
    const u = new User({ email: 'stg@gmail.com', username: 'stg' });
    const newUser = await User.register(u, 'adg');
    res.send(newUser);
})


app.use('/campgrounds', campgroundsRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/', userRouter);

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found!', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong.';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Serving on Port ${port}`);
})
