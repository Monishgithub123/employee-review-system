require('dotenv').config();
const express = require('express'); // requiring express
const port = process.env.PORT || 8000; // assigning port for testing
const app = express();

// requiring express-ejs-layouts for rendering layouts
const expressLayout = require('express-ejs-layouts');

// requiring the database connection
const db = require('./config/mongoose');

const bodyParser = require('body-parser');

// creating session
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local');

// requiring mongo-store for session persistence in the database
const MongoStore = require('connect-mongo');

// for showing action notifications
const flash = require('connect-flash'); 
const flashMiddleWare = require('./config/flashMiddleware');

// parsing the request body
app.use(bodyParser.urlencoded({ extended: false }));

// serving static files from the assets folder
app.use(express.static('./assets'));

// setting up the view engine as ejs
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(expressLayout);

// mongo store is used to store the session cookie in the database
app.use(session({
    name: "ERS",
    // change secret before deployment in production
    secret: process.env.SESSION_SECRET || "employeeReviewSystem",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/ersystem', // Using environment variable for MongoDB URL
        autoRemove: 'disabled'
    },
        (err) => {
            console.log(err || 'connect-mongo setup ok');
        }
    )
}));

// using passport for authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// using Connect Flash for flash messages
app.use(flash());
app.use(flashMiddleWare.setFlash);

// setting up the router (MVC structure)
app.use('/', require('./routes/index'));

// setting up the server at the given port
app.listen(port, function (err) {
    if (err) {
        console.log("Error in running the app.", err);
        return;
    }
    console.log("Server is up and running at port", port);
});
