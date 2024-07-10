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

// Get bookings for all meeting rooms
router.get('/bookings', async (req, res) => {
    const {data, error} = await supabase
    .from('meeting_room_bookings')
    .select('*');
    res.send(data);
    console.log('Meeting Room Bookings retrieved successfully');
});


//Book Meeting Room
router.post('/bookmeetingroom', async (req, res) => {
    let in_meeting_room = req.query.meeting_room;
    let in_start_date_time = req.query.start_date_time;
    let in_end_date_time = req.query.end_date_time;

    console.log(req.query.meeting_room);
    console.log(req.query.start_date_time);
    console.log(req.query.end_date_time);

    // Check if input is empty
    if (in_meeting_room == "" || in_start_date_time == "" || in_end_date_time == "") {
        res.send('Invalid input');
        console.log('Invalid input (Null)');
        return;
    }

    // Check if meeting room is already booked from start_date_time to end_date_time
    const {data: bookings, error} = await supabase
    .from('bookings_meeting_rooms')
    .select('meeting_room')
    .eq('meeting_room', in_meeting_room)
    .gte('start_date_time', in_start_date_time)
    .lte('end_date_time', in_end_date_time);

    if (bookings.length > 0) {
        res.send('Meeting Room already booked for that date and time');
        console.log('Meeting Room already booked for that date and time');
        return;
    }

    else {
        // Make a booking from start_date_time to end_date_time
        const {data, error} = await supabase
        .from('bookings_meeting_rooms')
        .insert([
            {
                meeting_room: in_meeting_room, 
                start_date_time: in_start_date_time, 
                end_date_time: in_end_date_time}
        ]);

        res.send('Meeting Room booked successfully');
        console.log('Meeting Room booked successfully');
    }
});

//Check availability of Meeting Room at certain date and time
router.get("/checkavailability", async (req, res) => {
    let in_start_date_time = req.query.start_date_time;

    // Check if input is empty
    if (in_start_date_time == "") {
        res.send('Invalid input');
        console.log('Invalid input (Null)');
        return;
    }

    //Get all meeting rooms
    const {data: meeting_rooms, error} = await supabase
    .from('meeting_rooms')
    .select('*');

    //Get all bookings for meeting rooms during start_date_time
    const {data: bookings, error2} = await supabase
    .from('bookings_meeting_rooms')
    .select('meeting_room')
    .gte('start_date_time', in_start_date_time);

    //If no bookings found
    if (bookings.length == 0) {
        res.send(meeting_rooms);
        console.log('All meeting rooms available');
        return;
    }
    else 
    {
        //Get all meeting rooms that are not booked during start_date_time
        var available_meeting_rooms = [];
        for (var i = 0; i < meeting_rooms.length; i++) {
            var booked = false;
            for (var j = 0; j < bookings.length; j++) {
                if (meeting_rooms[i].meeting_room == bookings[j].meeting_room) {
                    booked = true;
                    break;
                }
            }
            if (!booked) {
                available_meeting_rooms.push(meeting_rooms[i]);
            }
        }
        res.send(available_meeting_rooms);
        console.log('Available meeting rooms sent');
    }
});


    

module.exports = router;