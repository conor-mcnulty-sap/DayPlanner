const { supabase } = require('../../supabaseClient.js');
const express = require('express');

const router = express.Router();

//Booking Desks For Multiple Users
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

module.exports = router;