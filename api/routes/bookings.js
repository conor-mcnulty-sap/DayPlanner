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

    //Split date
    var dates = in_date.split("-");

    var date1 = dates[0] + "-" + dates[1] + "-" + dates[2];
    var date2 = dates[3] + "-" + dates[4] + "-" + dates[5];

    // Check if desk is already booked from date 1 to date 2
    const {data: bookings, error} = await supabase
    .from('bookings')
    .select('desk_id')
    .eq('desk_id', in_deskid)
    .gte('date', date1)
    .lte('date', date2);

    if (bookings.length > 0) {
        res.send('Desk already booked for that date');
        console.log('Desk already booked for that date');
        return;
    }
    else {
        // Make a booking from date 1 to date 2 (including dates inbetween)
        var date1 = new Date(date1);
        var date2 = new Date(date2);

        while (date1 <= date2) {
            date1_str = date1.toISOString().split('T')[0];
            const {data, error} = await supabase
            .from('bookings')
            .insert(
                {
                    desk_id: in_deskid,
                    user_id: in_userid,
                    date: date1_str
                }
            );
            date1.setDate(date1.getDate() + 1);
        }
        res.send("Desk booked successfully");
        console.log('Desk booked successfully');
    }
});

// Remove Booking
router.delete('/removebooking', async (req, res) => {
    let in_deskid = req.body.desk_id;
    let in_userid = req.body.user_id;
    let in_date = req.body.date;

    //Split date
    var dates = in_date.split("-");

    var date1 = dates[0] + "-" + dates[1] + "-" + dates[2];
    var date2 = dates[3] + "-" + dates[4] + "-" + dates[5];

    // If desk is not booked from date 1 to date 2
    const {data: bookings, error} = await supabase
    .from('bookings')
    .select('desk_id')
    .eq('desk_id', in_deskid)
    .gte('date', date1)
    .lte('date', date2);

    if (bookings.length === 0) {
        res.send('Desk is not booked for that date');
        console.log('Desk is not booked for that date');
        return;
    }
    else {
        var date1 = new Date(date1);
        var date2 = new Date(date2);

        while (date1 <= date2) {
            date1_str = date1.toISOString().split('T')[0];
            const {data, error} = await supabase
            .from('bookings')
            .delete()
            .eq('desk_id', in_deskid)
            .eq('user_id', in_userid)
            .eq('date', date1_str);
            date1.setDate(date1.getDate() + 1);
        }
        res.send("Booking removed successfully");
        console.log('Booking removed successfully');
    }
});

// What users have booked desks at a certain date
router.get('/bookingsbydate', async (req, res) => {
    let in_date = req.query.date;

    const {data, error} = await supabase
    .from('bookings')
    .select('*,users(*)')
    .eq('date', in_date);
    res.send(data);
});

// What desks have been booked by a certain user
router.get('/bookingsbyuser', async (req, res) => {
    let in_userid = req.query.user_id;

    const {data, error} = await supabase
    .from('bookings')
    .select('*,desks(*)')
    .eq('user_id', in_userid);
    res.send(data);
});

// Last booked for a certain user
router.get('/lastbooked', async (req, res) => {
    let in_userid = req.query.user_id;

    const {data, error} = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', in_userid)
    .order('date', {ascending: false})
    .limit(1);
    res.send(data);
});

// Find desk by booking
router.get('/finddesk', async (req, res) => {
    let in_userid = req.query.user_id;
    let in_date = req.query.date;

    const {data, error} = await supabase
    .from('bookings')
    .select('desks(*)')
    .eq('user_id', in_userid)
    .eq('date', in_date);
    res.send(data);
});

// Test 
router.get('/test', async (req, res) => {
    var str = "2022-09-15-2023-10-20";

    var dates = str.split("-");

    var date1 = dates[0] + "-" + dates[1] + "-" + dates[2];
    var date2 = dates[3] + "-" + dates[4] + "-" + dates[5];
    
    console.log(date1); // output: Thu Sep 15 2022 ...
    console.log(date2); // output: Fri Oct 20 2023 ...
    res.send('Test');
});

// test 2


module.exports = router;
