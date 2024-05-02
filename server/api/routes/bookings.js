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
    let in_deskid = req.body.desk_id;
    let in_userid = req.body.user_id;
    let in_date = req.body.date;

    // Check if desk is already booked for that date
    const {data: bookings, error} = await supabase
    .from('bookings')
    .select('desk_id')
    .eq('desk_id', in_deskid)
    .eq('date', in_date);

    if (bookings.length > 0) {
        res.send('Desk already booked for that date');
        console.log('Desk already booked for that date');
        return;
    }
    else {
        const {data, error} = await supabase
        .from('bookings')
        .insert(
            {
                desk_id: in_deskid,	
                user_id: in_userid,
                date: in_date
            }
        );
        res.send(data);
        console.log ('Desk booked successfully');
    }
});

// Remove Booking
router.delete('/removebooking', async (req, res) => {
    let in_deskid = req.body.desk_id;
    let in_userid = req.body.user_id;
    let in_date = req.body.date;

    // If desk is not booked for that date
    const {data: bookings, error} = await supabase
    .from('bookings')
    .select('desk_id')
    .eq('desk_id', in_deskid)
    .eq('date', in_date);

    if (bookings.length === 0) {
        res.send('Desk is not booked for that date');
        console.log('Desk is not booked for that date');
        return;
    }
    else {
        const {data, error} = await supabase
        .from('bookings')
        .delete()
        .eq('desk_id', in_deskid)
        .eq('user_id', in_userid)
        .eq('date', in_date);
        res.send(data);
        console.log('Booking removed successfully');
    }
});

// What users have booked desks at a certain date
router.get('/bookingsbydate', async (req, res) => {
    let in_date = req.body.date;

    const {data, error} = await supabase
    .from('bookings')
    .select('*,users(*)')
    .eq('date', in_date);
    res.send(data);
});

module.exports = router;
