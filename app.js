const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const {mongoDbUrl, PORT} = require('./config/configuration');
const hbs = require('express-handlebars');
const {selectOption} = require('./config/customFunctions');
const flash = require('connect-flash');
const session = require('express-session');
const {globalVariables} = require('./config/configuration');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const passport = require('passport');

const app = express();

// Configure Mongoose to Connect to MongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        console.log("MongoDB Connected Successfully.");
    }).catch(err => {
        console.log("Database connection failed.");
});



/* Configure express*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// flaash and session
app.use(session({
    secret: 'anysecret',
    saveUninitialized: true,
    resave: true
}));

app.use(flash());

/* Use Global Variables */
app.use(globalVariables);

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());


/* File Upload Middleware*/
app.use(fileUpload());



/* Setup View Engine To Use Handlebars */
app.engine('handlebars', hbs({defaultLayout: 'default', helpers: {select: selectOption}}));
app.set('view engine' , 'handlebars');



const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');


/* Method Override Middleware*/
app.use(methodOverride('newMethod'));


app.use('/', defaultRoutes);
app.use('/admin', adminRoutes);


app.listen(3000, () => {
   console.log("server started on port 3000");
});