const { supabase } = require('../../supabaseClient.js');
const express = require('express');

const router = express.Router();

//Booking Desk
router.post('/bookdesk', async (req, res) => {
    let in_deskid = req.query.desk_id;
    let in_useremail = req.query.user_email;
    let in_date = req.query.date;
    let auth = false;
    let time = new Date();

    console.log(in_deskid);
    console.log(in_useremail);
    console.log(in_date);

    // Check if input is empty
    if (in_deskid == "" || in_useremail == "" || in_date == "") {
        res.send('Invalid input');
        console.log('Invalid input (Null)');
        return;
    }
    
    //Split date
    var dates = in_date.split("-");

    var date1 = dates[0] + "-" + dates[1] + "-" + dates[2];
    var date2 = dates[3] + "-" + dates[4] + "-" + dates[5];

    //Get user id
    const {data , error3} = await supabase
    .from('users')
    .select('id')
    .eq('email', in_useremail);

    in_userid = data[0].id;

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
        console.log(date1);
        console.log(date1);

        var date1 = new Date(date1);
        var date2 = new Date(date2);

        date1.setDate(date1.getDate() + 1);
        date2.setDate(date1.getDate() + 1);
        console.log(date1);
        console.log(date2);

        while (date1 <= date2) {
            date1_str = date1.toISOString().split('T')[0];
            const {data, error} = await supabase
            .from('bookings')
            .insert(
                {
                    desk_id: in_deskid,
                    user_id: in_userid,
                    date: date1_str,
                    authorisation: auth,
                    time: time
                }
            );
            const {data2, error2} = await supabase
            .from('last_booked')
            .insert(
                {
                    desk_id: in_deskid,
                    user_id: in_userid,
                    date: date1_str,
                    authorisation: auth,
                    time: time
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

// Verify Authorisation
router.put('/verify', async (req, res) => {
    let in_useremail = req.query.user_email;

    //Get user id
    const {data , error3} = await supabase
    .from('users')
    .select('id')
    .eq('email', in_useremail);

    in_userid = data[0].id;

    // Get the current date
    const now = new Date();

    // Extract the year, month, and day
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(now.getDate()).padStart(2, '0');

    // Format the date as YYYY-MM-DD
    const currentDate = `${year}-${month}-${day}`;

    const {data1, error} = await supabase
    .from('bookings')
    .update({ authorisation: true})
    .eq('user_id', in_userid)
    .eq('date', currentDate);

    if (error) {
        console.log("error not verified");
        return;
    }

    console.log("Verified");
    res.send("Verified");

});

module.exports = router;