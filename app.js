const express = require('express');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

const app = express();
const router = require('./router');

const port = process.env.PORT || 5000;

var bodyParser = require('body-parser');
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use((req, res, next) => {
    const models = require('./models_sample')
    const db = {
        User: new models.User(),
        Post: new models.Post()
    };
    req.db = db;
    req.jwt = Promise.promisifyAll(jwt);
    next();
});

router(app);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
