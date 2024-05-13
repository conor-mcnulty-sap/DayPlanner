const { supabase } = require('../../supabaseClient.js');
const express = require('express');

const router = express.Router();

// Get all Buildings
router.get('/', async (req, res) => {
    const {data, error} = await supabase
    .from('buildings')
    .select('*');
    res.send(data);
});

// Get all floors of a building
router.get('/floors', async (req, res) => {
    let building = req.query.building;
    const {data, error} = await supabase
    .from('buildings')
    .select('*')
    .eq('building', building);
    res.send(data);
});

module.exports = router;