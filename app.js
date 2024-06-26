require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use('/images', express.static('public/images'));
app.use('/videos', express.static('public/videos'));
app.use('/files', express.static('/public/files'));

const mediaRouter = require('./routes');
app.use('/api/v1', mediaRouter);

const usersRouter = require('./routes/user.routes');
app.use('/api/v1/', usersRouter);

app.get('/', (req, res) => res.render('image'));


// 500 error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        status: false,
        message: err.message,
        data: null
    });
});

// 404 error handler
app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: `are you lost? ${req.method} ${req.url} is not registered!`,
        data: null
    });
});

module.exports = app;
