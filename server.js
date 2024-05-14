const express = require('express');
const cors = require('cors');

const routes = require('./api/routes');

const prepareServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/', routes);
 
    app.listen(5000, () => {
        console.log('Server is running on port 5000');
    });

    return app;
}

module.exports = {prepareServer};