require('dotenv').config();
require('./config/mongo');
const express = require('express');
const bodyParser = require('body-parser');

// EXPRESS CONFIG
const app = express();
const http = require('http').Server(app);
app.use(express.static('assets'));
app.use(bodyParser.json({extended: true,limit: '5mb',verify: function(req, res, buf, encoding) {
    // get rawBody
    req.rawBody = buf.toString();
}}));
//END  EXPRESS CONFIG

// ROUTES
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/posts', require('./routes/posts'));
// END ROUTES

app.get('/', function (req, res) {
    const error = {
        err: "Your IP has been flagged " + process.env.ENVIRONMENT
    }
    res.status(401).send(error);
});

app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});

http.listen(process.env.PORT, function () {
    console.log('KHALIL listening on port ' + process.env.PORT);
});