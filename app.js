const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.route');
const colorRouter = require('./routes/color.route');
const watchlistRouter = require('./routes/watchlist.route');

const app = express();


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use('/', userRouter);
app.use('/', colorRouter); 
app.use('/', watchlistRouter); 

module.exports = app;
