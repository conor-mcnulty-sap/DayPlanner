const { supabase } = require('../../supabaseClient.js');
const express = require('express');

const router = express.Router();

//Get all desks
router.get('/', async (req, res) => {
    const {data, error} = await supabase
    .from('desks')
    .select('*');
    res.send(data);
});

// Get Favourite Desks
router.get('/favourites', async (req, res) => {
    const {data, error} = await supabase
    .from('favourites')
    .select('*,desks(*)');
    res.send(data);
}
);

// Favourite Desk
router.post('/favouritedesk', async (req, res) => {
    let in_deskid = req.query.desk_id;
    let in_userid = req.query.user_id;


    // Check if desk is already in favourites
    const {data: favourites, error} = await supabase
    .from('favourites')
    .select('*')
    .eq('desk_id', in_deskid)
    .eq('user_id', in_userid);

    if (favourites.length > 0) {
        res.send('Desk already in favourites');
        console.log('Desk already in favourites');
        return;
    }
    else {
        const {data, error} = await supabase
        .from('favourites')
        .insert(
            {
                user_id: in_userid,
                desk_id: in_deskid
            }
        );
        res.send(data);
        console.log('Desk added to favourites');
    }
});

// Remove Favourite Desk
router.delete('/removefavourite', async (req, res) => {
    let in_deskid = req.query.desk_id;
    let in_userid = req.query.user_id;

    // If desk is not in favourites
    const {data: favourites, error} = await supabase
    .from('favourites')
    .select('*')
    .eq('desk_id', in_deskid)
    .eq('user_id', in_userid);

    if (favourites.length === 0) {
        res.send('Desk not in favourites');
        console.log('Desk not in favourites');
        return;
    }
    else {
        const {data, error} = await supabase
        .from('favourites')
        .delete()
        .eq('desk_id', in_deskid)
        .eq('user_id', in_userid);
        res.send("Desk removed from favourites");
        console.log('Desk removed from favourites');
    }
});

// Filter Desks by floor
router.get('/filterbyfloor', async (req, res) => {
    let in_floor = req.query.floor;

    const {data, error} = await supabase
    .from('desks')
    .select('*')
    .eq('floor', in_floor);
    res.send(data);
});

// Get favourite desk for certain user
router.get('/favouritesbyuser', async (req, res) => {
    let in_userid = req.query.user_id;

    const {data, error} = await supabase
    .from('favourites')
    .select('*,desks(*)')
    .eq('user_id', in_userid);

    // If no favourites
    if (data.length === 0) {
        res.send('No favourites found');
        console.log('No favourites found');
        return;
    }
    else {
        res.send(data);
        console.log("Favourites by user sent")
    }
});

// Filter Desks that are available on a certain building, floor and date
router.get('/filterbybuildingflooranddate', async (req, res) => {
    let in_building = req.query.building;
    let in_floor = req.query.floor;
    let in_date = req.query.date;


    // Get all desks in building and floor
    const {data: desks, error} = await supabase
    .from('desks')
    .select('*')
    .eq('building', in_building)
    .eq('floor', in_floor);

    // Get all bookings for that date
    const {data: bookings, error1} = await supabase
    .from('bookings')
    .select('desk_id')
    .eq('date', in_date);


    // If no bookings, all desks are available
    if (bookings === null || bookings.length === 0) {
        res.send(desks);
        console.log("All desks available");
        return;
    }
    else
    {
        // Get all desks that are not booked on that date
        var available_desks = [];
        for (var i = 0; i < desks.length; i++) {
            var booked = false;
            for (var j = 0; j < bookings.length; j++) {
                if (desks[i].id === bookings[j].desk_id) {
                    booked = true;
                    break;
                }
            }
            if (!booked) {
                available_desks.push(desks[i]);
            }
        }
        res.send(available_desks);
        console.log("Available desks sent");
    }
});





module.exports = router;
