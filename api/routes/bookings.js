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
    let in_deskid = req.query.desk_id;
    let in_userid = req.query.user_id;
    let in_date = req.query.date;

    // Check if input is empty
    if (in_deskid == "" || in_userid == "" || in_date == "") {
        res.send('Invalid input');
        console.log('Invalid input (Null)');
        return;
    }
    
    //Split date
    var dates = in_date.split("-");

    var date1 = dates[0] + "-" + dates[1] + "-" + dates[2];
    var date2 = dates[3] + "-" + dates[4] + "-" + dates[5];

    // Check if user has already booked desk for that date
    const {data: user_bookings, error2} = await supabase
    .from('bookings')
    .select('desk_id')
    .eq('user_id', in_userid)
    .gte('date', date1)
    .lte('date', date2);

    if (user_bookings.length > 0) {
        res.send('User already booked desk for that date');
        console.log('User already booked desk for that date');
        return;
    }

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
            const {data2, error2} = await supabase
            .from('last_booked')
            .insert(
                {
                    desk_id: in_deskid,
                    user_id: in_userid,
                    date: date1_str
                }
            );
            if (error) {
                res.send('Error booking desk');
                console.log('Error booking desk');
                console.log(error);
                return;
            }
            date1.setDate(date1.getDate() + 1);
        }
        res.send("Desk booked successfully");
        console.log('Desk booked successfully');
    }
});

// Remove Booking
router.delete('/removebooking', async (req, res) => {
    let in_deskid = req.query.desk_id;
    let in_userid = req.query.user_id;
    let in_date = req.query.date;

    // Check if input is empty
    if (in_deskid == "" || in_userid == "" || in_date == "") {
        res.send('Invalid input');
        console.log('Invalid input (Null)');
        return;
    }

    // Remove booking for single date
    if (in_date.length == 10) {
        // if desk is not booked for that date
        const {data: bookings2, error} = await supabase
        .from('bookings')
        .select('desk_id')
        .eq('desk_id', in_deskid)
        .eq('user_id', in_userid)
        .eq('date', in_date);

        if (bookings2.length === 0) {
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

            // If error
            if (error) {
                res.send('Error removing booking');
                console.log('Error removing booking');
                console.log(error);
                return;
            }
            else {
                res.send("Booking removed successfully");
                console.log('Booking removed successfully');
                return;
            }
        }
    }

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

// Filters
// What users have booked desks at a certain date
router.get('/bookingsbydate', async (req, res) => {
    let in_date = req.query.date;

    const {data, error} = await supabase
    .from('bookings')
    .select('*,users(*)')
    .eq('date', in_date);

    // If no bookings found
    if (data.length === 0) {
        res.send('No bookings found');
        console.log('No bookings found');
        return;
    }
    else {
        // If user has booked multiple desks, only show one user
        var users = [];
        var user_ids = [];
        for (var i = 0; i < data.length; i++) {
            if (!user_ids.includes(data[i].user_id)) {
                users.push(data[i]);
                user_ids.push(data[i].user_id);
            }
        }
        res.send(users);
        console.log('Bookings found');
    }
});

// What desks have been booked by a certain user
router.get('/bookingsbyuser', async (req, res) => {
    let in_userid = req.query.user_id;

    const {data, error} = await supabase
    .from('bookings')
    .select('*,desks(*)')
    .eq('user_id', in_userid);

    // If no bookings found
    if (data.length === 0) {
        res.send('No bookings found');
        console.log('No bookings found');
        return;
    }
    else {
        res.send(data);
        console.log('Bookings found');
    }
});


// End of filters

// Last booked for a certain user
router.get('/lastbooked', async (req, res) => {
    let in_userid = req.query.user_id;

    const {data, error} = await supabase
    .from('last_booked')
    .select('*,desks(*)')
    .eq('user_id', in_userid)
    .order('id', {ascending: false})
    .limit(1);
    

    // If no booking found
    if (data.length === 0) {
        res.send('No last booking found');
        console.log('No last booking found');
        return;
    }
    else {
        res.send(data);
        console.log('Last booking found');
    }
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

    // If no booking found
    if (data.length === 0) {
        res.send('No booking found');
        console.log('No booking found');
        return;
    }
    else {
        res.send(data);
        console.log('Desks found');
    }
});

// Get Booking for certain user and date
router.get('/getbookinguserdate', async (req, res) => {
    let in_userid = req.query.user_id;
    let in_date = req.query.date;

    const {data, error} = await supabase
    .from('bookings')
    .select('*,desks(*)')
    .eq('user_id', in_userid)
    .eq('date', in_date);

    // If no booking found
    if (data.length === 0) {
        res.send('No booking found');
        console.log('No booking found');
        return;
    }
    else {
        res.send(data);
        console.log('Booking found');
    }
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
