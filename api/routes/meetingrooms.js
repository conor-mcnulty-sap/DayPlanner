const { supabase } = require('../../supabaseClient.js');
const express = require('express');

const router = express.Router();

// Get all Meeting Rooms
router.get('/', async (req, res) => {
    const {data, error} = await supabase
    .from('meeting_rooms')
    .select('*');
    res.send(data);
    console.log ('Meeting Rooms retrieved successfully');
});

// Get Meeting Room from certain building and floor
router.get('/buildingfloor', async (req, res) => {
    let in_building = req.query.building;
    let in_floor = req.query.floor;

    const {data, error} = await supabase
    .from('meeting_rooms')
    .select('*')
    .eq('building', in_building)
    .eq('floor', in_floor);

    // If no meeting rooms found
    if (data.length == 0) {
        res.send('No meeting rooms found');
        console.log('No meeting rooms found');
        return;
    }
    else {
        res.send(data);
        console.log('Meeting Rooms retrieved successfully');
    }
});

module.exports = router;