const { supabase } = require('../../supabaseClient.js');
const express = require('express');


const dotenv = require('dotenv');
dotenv.config();
const BING_MAPS_KEY = process.env.BING_MAPS_KEY;

const axios = require('axios');

const router = express.Router();

// Get all Carpoolers
router.get('/carpooler', async (req, res) => {
    const {data, error} = await supabase
    .from('carpooler')
    .select('*');
    res.send(data);
});

// Get all Carpoolee
router.get('/carpoolee', async (req, res) => {
    const {data, error} = await supabase
    .from('carpoolee')
    .select('*');
    res.send(data);
});

// Add Carpooler
router.post('/addcarpooler', async (req, res) => {
    let user_id = req.body.user_id;
    let eircode = req.body.eircode;

    //if carpooler already exists
    const {data: carpoolers, error} = await supabase
    .from('carpooler')
    .select('user_id')
    .eq('user_id', user_id);

    if (carpoolers.length > 0) {
        res.send('Carpooler already exists');
        console.log('Carpooler already exists');
        return;
    }
    else {
        const {data, error} = await supabase
        .from('carpooler')
        .insert(
            {
                user_id: user_id,
                eircode: eircode
            }
        );
        res.send(data);
        console.log('Carpooler added successfully');
    }
});

// Add Carpoolee
router.post('/addcarpoolee', async (req, res) => {
    let user_id = req.body.user_id;
    let eircode = req.body.eircode;

    //if carpoolee already exists
    const {data: carpoolees, error} = await supabase
    .from('carpoolee')
    .select('user_id')
    .eq('user_id', user_id);

    if (carpoolees.length > 0) {
        res.send('Carpoolee already exists');
        console.log('Carpoolee already exists');
        return;
    }
    else {
        const {data, error} = await supabase
        .from('carpoolee')
        .insert(
            {
                user_id: user_id,
                eircode: eircode
            }
        );
        console.log('Carpoolee added successfully');
        res.send(data);
    }
});

// Remove Carpooler
router.delete('/removecarpooler', async (req, res) => {
    let user_id = req.body.user_id;

    //if carpooler does not exist
    const {data: carpoolers, error} = await supabase
    .from('carpooler')
    .select('user_id')
    .eq('user_id', user_id);

    if (carpoolers.length == 0) {
        res.send('Carpooler does not exist');
        console.log('Carpooler does not exist');
        return;
    }
    else {
        const {data, error} = await supabase
        .from('carpooler')
        .delete()
        .eq('user_id', user_id);
        console.log('Carpooler removed successfully');
        res.send(data);
    }

    
});

// Remove Carpoolee
router.delete('/removecarpoolee', async (req, res) => {
    let user_id = req.body.user_id;

    //if carpoolee does not exist
    const {data: carpoolees, error} = await supabase
    .from('carpoolee')
    .select('user_id')
    .eq('user_id', user_id);

    if (carpoolees.length == 0) {
        res.send('Carpoolee does not exist');
        console.log('Carpoolee does not exist');
        return;
    }
    else {
        const {data, error} = await supabase
        .from('carpoolee')
        .delete()
        .eq('user_id', user_id);
        console.log('Carpoolee removed successfully');
        res.send(data);
    }
});

// Distance Between Two EirCodes
router.get('/distance', async (req, res) => {

    // var url = "http://dev.virtualearth.net/REST/v1/Locations?q=Seattle&key=" + bing_maps_api_key;

    let eircode1 = req.query.eircode1;
    let eircode2 = req.query.eircode2;

    let url = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + eircode1 + "&wp.1=" + eircode2 + "&key=" + BING_MAPS_KEY;
    const {data, error} = await axios.get(url);
    let traveldistance = data.resourceSets[0].resources[0].travelDistance;
    traveldistance =  traveldistance + " km";
    res.send(traveldistance);
    console.log(traveldistance);
});

module.exports = router;