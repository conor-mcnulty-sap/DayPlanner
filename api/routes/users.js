const { supabase } = require('../../supabaseClient.js');
const express = require('express');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    const {data, error} = await supabase
    .from('users')
    .select('*');
    res.send(data);
});

module.exports = router;