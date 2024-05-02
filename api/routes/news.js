const express = require('express');

const router = express.Router();

//Get all news
router.get('/', (req, res) => {
    //res.send('Welcome to the News');
    res.sendFile('output.json', { root: "./" });
});

module.exports = router;