const express = require('express');
const cors = require('cors');

const routes = require('./api/routes');

const prepareServer = () => {
    // Current time
    var date = new Date();

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/', routes);
 
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
        console.log('Current time: ' + date);
    });

    return app;
}

module.exports = {prepareServer};