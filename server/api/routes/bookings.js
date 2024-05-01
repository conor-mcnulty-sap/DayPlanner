const { supabase } = require('../../supabaseClient.js');
const express = require('express');

const router = express.Router();

//Get all Bookings
router.get('/', async (req, res) => {
    const {data, error} = await supabase
    .from('bookings')
    .select('*,desks(*)');
    res.send(data);
});

//Booking Desk
router.post('/bookdesk', async (req, res) => {
    const {data, error} = await supabase
    .from('bookings')
    .insert(
        {
            desk_id: req.body.desk_id,
            user_id: req.body.user_id,
            date: req.body.date,
        }
    );
});

// Remove Booking
router.delete('/removebooking', async (req, res) => {
    const {data, error} = await supabase
    .from('bookings')
    .delete()
    .match({ id: req.body.id });
});

module.exports = router;
