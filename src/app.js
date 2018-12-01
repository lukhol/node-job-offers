const express = require('express');
const app = express();
const config = require('./config/config');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const User = require('./models/User');

//Use global promise implementation
mongoose.Promise = global.Promise;
 
if(process.env.NODE_ENV === 'test') {
    mongoose
    .connect(config.db)
    .then(connection => console.log('MongoDB test connected succesfully!'))
    .catch(err => console.error("MongoDB error: ", err));
} else {
    mongoose
    .connect(config.db)
    .then(require('../dbInit'))
    .catch(err => {console.error("MongoDB error: ", err)});
}

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Middlewares here
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static' ,express.static(path.join(__dirname, 'public'))); //server files from public/ directory under static/name url path

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Requested-With, Accept, Authorization');

    if(req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }

    next();
});

//Routes here
app.get('/', (req, res) => {
    
    res.send('Test');
});
app.use('/users', require('./routes/UsersRoutes'));
app.use('/job/offers', require('./routes/JobOffersRoutes'))

app.use((req, res, next) => {
    res.status(200).json({
        message: "It works!"
    });
});

app.use((req, res, next) => {
    //Catch all not matched paths
    const error = new Errors('Not found');
    error.status = 404;
    next(error);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        message: "Unexpected error occured... ;(",
        stack: err.stack
    });
});

module.exports = app;