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
    let in_deskid = req.body.desk_id;
    let in_userid = req.body.user_id;


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
    let in_deskid = req.body.desk_id;
    let in_userid = req.body.user_id;

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
        res.send(data);
        console.log('Desk removed from favourites');
    }
});

// Filter Desks by floor
router.get('/filterbyfloor', async (req, res) => {
    let in_floor = req.body.floor;

    const {data, error} = await supabase
    .from('desks')
    .select('*')
    .eq('floor', in_floor);
    res.send(data);
});




module.exports = router;
