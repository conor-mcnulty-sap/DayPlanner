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

    if (data == null)
        {
            console.log("meeting room null");
            return;
        }

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

    // Check if input is empty
    if (in_meeting_room == "" || in_start_date_time == "" || in_end_date_time == "") {
        res.send('Invalid input');
        console.log('Invalid input (Null)');
        return;
    }

    const { data: meet, error3 } = await supabase
    .from('meeting_rooms')
    .select('*')
    .eq('meeting_room', in_meeting_room)

    let in_building = meet[0].building;
    let in_floor = meet[0].floor;

    console.log(req.query.meeting_room);
    console.log(req.query.start_date_time);
    console.log(req.query.end_date_time);
    console.log(in_building);
    console.log(in_floor);



    // Check if meeting room is already booked from start_date_time to end_date_time
    // Get all bookings for the current date and time range
    let dateParts = in_start_date_time.split(' ')[0].split('-');

    let year = dateParts[0];
    let month = dateParts[1];
    let day = dateParts[2];

    let dateParts2 = in_end_date_time.split(' ')[0].split('-');

    let year2 = dateParts2[0];
    let month2 = dateParts2[1];
    let day2 = dateParts2[2];


    const hours = '00';
    const minutes = '00';
    const hours2 = '23';
    const minutes2 = '59';

    let date = `${year}-${month}-${day} ${hours}:${minutes}`;
    let end_date = `${year2}-${month2}-${day2} ${hours2}:${minutes2}`;

        const { data: bookings, error } = await supabase
            .from('bookings_meeting_rooms')
            .select('*, meeting_room!inner(*)')
            .eq('meeting_room.building', in_building)
            .eq('meeting_room.floor', in_floor)
            .gte('start_date_time', date)
            .lte('end_date_time', end_date);

        if (error) {
            throw error;
        }
        var booked_meeting_rooms = [];

        // Check for overlap with existing bookings
        for (let booking of bookings) {
            const bookingStart = new Date(booking.start_date_time);
            const bookingEnd = new Date(booking.end_date_time);
            const requestedStart = new Date(in_start_date_time);
            const requestedEnd = new Date(in_end_date_time);

            // Add 1 hour to requestedStart
            requestedStart.setHours(requestedStart.getHours() + 1);

            // Add 1 hour to requestedEnd
            requestedEnd.setHours(requestedEnd.getHours() + 1);

            // Add 1 hour to bookingStart
            bookingStart.setHours(bookingStart.getHours() + 1);

            // Add 1 hour to bookingEnd
            bookingEnd.setHours(bookingEnd.getHours() + 1);

            console.log(booking.meeting_room.meeting_room);
            console.log(bookingStart);
            console.log(bookingEnd);
            console.log(requestedStart);
            console.log(requestedEnd);



            if (requestedStart < bookingEnd && requestedEnd > bookingStart) {
                booked_meeting_rooms.push(booking.meeting_room);
            }
        }

    let booked = false;

    for (let booking of booked_meeting_rooms) {
        console.log(booking.meeting_room);
        if (booking.meeting_room == in_meeting_room){
            booked = true;
        }
    }

    if (booked == true) {
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

// //Check availability of Meeting Room at certain date and time
// router.get("/checkavailability", async (req, res) => {
//     let in_start_date_time = req.query.start_date_time;

//     // Check if input is empty
//     if (in_start_date_time == "") {
//         res.send('Invalid input');
//         console.log('Invalid input (Null)');
//         return;
//     }

//     //Get all meeting rooms
//     const {data: meeting_rooms, error} = await supabase
//     .from('meeting_rooms')
//     .select('*');

//     //Get all bookings for meeting rooms during start_date_time
//     const {data: bookings, error2} = await supabase
//     .from('bookings_meeting_rooms')
//     .select('meeting_room')
//     .gte('start_date_time', in_start_date_time);

//     if (bookings == null)
//         {
//             console.log("booking meeting room null");
//             return;
//         }

//     //If no bookings found
//     if (bookings.length == 0) {
//         res.send(meeting_rooms);
//         console.log('All meeting rooms available');
//         return;
//     }
//     else 
//     {
//         //Get all meeting rooms that are not booked during start_date_time
//         var available_meeting_rooms = [];
//         for (var i = 0; i < meeting_rooms.length; i++) {
//             var booked = false;
//             for (var j = 0; j < bookings.length; j++) {
//                 if (meeting_rooms[i].meeting_room == bookings[j].meeting_room) {
//                     booked = true;
//                     break;
//                 }
//             }
//             if (!booked) {
//                 available_meeting_rooms.push(meeting_rooms[i]);
//             }
//         }
//         res.send(available_meeting_rooms);
//         console.log('Available meeting rooms sent');
//     }
// });

//Check availability of Meeting Room at certain date and time and building and floor
// router.get("/checkavailabilitybuildingfloor", async (req, res) => {
//     let in_start_date_time = req.query.start_date_time;
//     let in_building = req.query.building;
//     let in_floor = req.query.floor;
//     let in_end_date_time = req.query.end_date_time;

//     // Check if input is empty
//     if (in_start_date_time == "" && in_building == "" && in_floor == "" && in_end_time == "") {
//         res.send('Invalid input');
//         console.log('Invalid input (Null)');
//         return;
//     }

//     //Get all meeting rooms
//     const {data: meeting_rooms, error} = await supabase
//     .from('meeting_rooms')
//     .select('*')
//     .eq('building',in_building)
//     .eq('floor',in_floor);

//     //Get all bookings for meeting rooms during start_date_time and end_date_time
//     const {data: bookings, error2} = await supabase
//     .from('bookings_meeting_rooms')
//     .select('meeting_room')
//     .lte('start_date_time', in_start_date_time)
//     .gte('end_date_time', in_end_date_time);

//     if (bookings == null)
//     {
//         console.log("booking meeting room null");
//         return;
//     }

//     //If no bookings found
//     if (bookings.length == 0) {
//         res.send(meeting_rooms);
//         console.log('All meeting rooms available');
//         return;
//     }
//     else 
//     {
//         //Get all meeting rooms that are not booked during start_date_time
//         var available_meeting_rooms = [];
//         for (var i = 0; i < meeting_rooms.length; i++) {
//             var booked = false;
//             for (var j = 0; j < bookings.length; j++) {
//                 if (meeting_rooms[i].meeting_room == bookings[j].meeting_room) {
//                     console.log(meeting_rooms[i].meeting_room + " Booked");
//                     booked = true;
//                     break;
//                 }
//             }
//             if (!booked) {
//                 available_meeting_rooms.push(meeting_rooms[i]);
//             }
//         }
//         console.log(available_meeting_rooms);
//         res.send(available_meeting_rooms);
//         console.log('Available meeting rooms sent');
//     }
// });

router.get("/checkavailabilitybuildingfloor", async (req, res) => {
    let in_start_date_time = req.query.start_date_time;
    let in_building = req.query.building;
    let in_floor = req.query.floor;
    let in_end_date_time = req.query.end_date_time;

    // Check if input is empty
    if (!in_start_date_time || !in_building || !in_floor || !in_end_date_time) {
        res.status(400).send('Invalid input');
        console.log('Invalid input (Null)');
        return;
    }

    // Get all bookings for the current date and time range
    let dateParts = in_start_date_time.split(' ')[0].split('-');

    let year = dateParts[0];
    let month = dateParts[1];
    let day = dateParts[2];

    let dateParts2 = in_end_date_time.split(' ')[0].split('-');

    let year2 = dateParts2[0];
    let month2 = dateParts2[1];
    let day2 = dateParts2[2];


    const hours = '00';
    const minutes = '00';
    const hours2 = '23';
    const minutes2 = '59';

    let date = `${year}-${month}-${day} ${hours}:${minutes}`;
    let end_date = `${year2}-${month2}-${day2} ${hours2}:${minutes2}`;

        const { data: bookings, error } = await supabase
            .from('bookings_meeting_rooms')
            .select('*, meeting_room!inner(*)')
            .eq('meeting_room.building', in_building)
            .eq('meeting_room.floor', in_floor)
            .gte('start_date_time', date)
            .lte('end_date_time', end_date);

        if (error) {
            throw error;
        }

        var booked_meeting_rooms = [];

        let i = 0;

        // Check for overlap with existing bookings
        for (let booking of bookings) {
            let bookingStart = new Date(booking.start_date_time);
            let bookingEnd = new Date(booking.end_date_time);
            let requestedStart = new Date(in_start_date_time);
            let requestedEnd = new Date(in_end_date_time);

            // Add 1 hour to requestedStart
            requestedStart.setHours(requestedStart.getHours() + 1);

            // Add 1 hour to requestedEnd
            requestedEnd.setHours(requestedEnd.getHours() + 1);

            // Add 1 hour to bookingStart
            bookingStart.setHours(bookingStart.getHours() + 1);

            // Add 1 hour to bookingEnd
            bookingEnd.setHours(bookingEnd.getHours() + 1);

            console.log(booking.meeting_room.meeting_room);
            console.log(booking.meeting_room.id);
            console.log(bookingStart);
            console.log(bookingEnd);
            console.log(requestedStart);
            console.log(requestedEnd);



            if (requestedStart < bookingEnd && requestedEnd > bookingStart) {
                console.log("booked");
                booked_meeting_rooms.push(booking.meeting_room.id);
                i++
            }
        }
    res.send(booked_meeting_rooms);
});

module.exports = router;