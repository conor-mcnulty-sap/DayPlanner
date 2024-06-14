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
    let user_id = req.query.user_id;
    let eircode = req.query.eircode;

    // Check input 
    if (eircode == null) {
        res.send('Invalid input');
        console.log(eircode);
        console.log('Invalid input (Null)');
        return;
    }
    // Check special characters
    else if (!/^[a-zA-Z0-9 ]+$/.test(eircode)) {
        res.send('Invalid input');
        console.log('Invalid input (Special Character)');
        return;
    }
    // Check if there is a space
    else if (eircode[3] ===  ' ' ) {
        //Remove space
        eircode = eircode.substring(0, 3) + eircode.substring(3);
    }
    // Check if input is 7 characters
    else if (eircode.length != 7) {
        res.send('Invalid input');
        console.log('Invalid input (Length)');
        return;
    }


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
    let user_id = req.query.user_id;
    let eircode = req.query.eircode;

    // Check input 
    if (eircode == null) {
        res.send('Invalid input');
        console.log('Invalid input');
        return;
    }
    // Check special characters
    else if (!/^[a-zA-Z0-9 ]+$/.test(eircode)) {
        res.send('Invalid input');
        console.log('Invalid input');
        return;
    }
    // Check if there is a space
    else if (eircode[3] ===  ' ' ) {
        //Remove space
        eircode = eircode.substring(0, 3) + eircode.substring(3);
    }
    // Check if input is 7 characters
    else if (eircode.length != 7) {
        res.send('Invalid input');
        console.log('Invalid input');
        return;
    }


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
    let user_id = req.query.user_id;

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
    let user_id = req.query.user_id;

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

    // If there is an error
    if (error) {
        res.send('Error');
        console.log('Error');
        return;
    }
    else{
        let traveldistance = data.resourceSets[0].resources[0].travelDistance;
        traveldistance =  traveldistance + " km";
        res.send(traveldistance);
        console.log(traveldistance);
    }
});

// List Carpooler closest to you
router.get('/closestcarpooler', async (req, res) => {
    let user_id = req.query.user_id;

    console.log(user_id);

    // If user is carpooler 
    const {data: carpooler, error2} = await supabase
    .from('carpooler')
    .select('user_id')
    .eq('user_id', user_id);

    if (carpooler.length > 0) {
        console.log('You are a carpooler');

        // If carpooler also exists as carpoolee
        const {data: carpoolee, error3} = await supabase
        .from('carpoolee')
        .select('user_id')
        .eq('user_id', user_id);

        console.log(carpoolee);

        if (carpoolee.length > 0) {
            console.log('You are also a carpoolee');
        }
        else {
            return;
        }
    }

    console.log("test2");

    //get all carpoolers
    const {data: carpoolers, error} = await supabase
    .from('carpooler')
    .select('*,users(*)');

    //Get user eircode
    const {data: user, error1} = await supabase
    .from('carpoolee')
    .select('eircode')
    .eq('user_id', user_id);

    // If user does not exist
    if (user.length == 0) {
        res.send('User does not exist');
        console.log('User does not exist');
        return;
    }

    let user_eircode = user[0].eircode;

    //Get list of carpooler eircodes
    let carpooler_eircodes = [];
    for (let i = 0; i < carpoolers.length; i++) {
        carpooler_eircodes.push(carpoolers[i].eircode);
    }

    //Get list of distances
    let distances = [];
    for (let i = 0; i < carpooler_eircodes.length; i++) {
        let url = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + user_eircode + "&wp.1=" + carpooler_eircodes[i] + "&key=" + BING_MAPS_KEY;
        const {data, error} = await axios.get(url);
        let traveldistance = data.resourceSets[0].resources[0].travelDistance;
        distances.push(traveldistance);
    }

    //Combine carpooler and distance
    let carpooler_distance = [];
    for (let i = 0; i < carpoolers.length; i++) {
        carpooler_distance.push({carpooler: carpoolers[i], distance: distances[i]});
    }

    //Sort by distance
    carpooler_distance.sort(function(a, b) {
        return a.distance - b.distance;
    });

    res.send(carpooler_distance);
    console.log("Returned list of carpoolers closest to you");

});

// List Carpoolee closest to you
router.get('/closestcarpoolee', async (req, res) => {
    let user_id = req.query.user_id;

    // If user is carpoolee 
    const {data: carpoolee, error2} = await supabase
    .from('carpoolee')
    .select('user_id')
    .eq('user_id', user_id);

    if (carpoolee.length > 0) {
        console.log('You are a carpoolee');

        // If carpoolee also exists as carpooler
        const {data: carpooler, error3} = await supabase
        .from('carpooler')
        .select('user_id')
        .eq('user_id', user_id);

        if (carpooler.length > 0) {
            console.log('You are also a carpooler');
        }
        else {
            return;
        }
    }

    //get all carpoolee
    const {data: carpoolees, error} = await supabase
    .from('carpoolee')
    .select('*,users(*)');

    //Get user eircode
    const {data: user, error1} = await supabase
    .from('carpooler')
    .select('eircode')
    .eq('user_id', user_id);

    // If user does not exist
    if (user.length == 0) {
        res.send('User does not exist');
        console.log('User does not exist');
        return;
    }

    let user_eircode = user[0].eircode;

    //Get list of carpoolee eircodes
    let carpoolee_eircodes = [];
    for (let i = 0; i < carpoolees.length; i++) {
        carpoolee_eircodes.push(carpoolees[i].eircode);
    }

    //Get list of distances
    let distances = [];
    for (let i = 0; i < carpoolee_eircodes.length; i++) {
        let url = "http://dev.virtualearth.net/REST/v1/Routes?wp.0=" + user_eircode + "&wp.1=" + carpoolee_eircodes[i] + "&key=" + BING_MAPS_KEY;
        const {data, error} = await axios.get(url);
        let traveldistance = data.resourceSets[0].resources[0].travelDistance;
        distances.push(traveldistance);
    }

    //Combine carpooler and distance
    let carpoolee_distance = [];
    for (let i = 0; i < carpoolees.length; i++) {
        carpoolee_distance.push({carpoolee: carpoolees[i], distance: distances[i]});
    }

    //Sort by distance
    carpoolee_distance.sort(function(a, b) {
        return a.distance - b.distance;
    });

    res.send(carpoolee_distance);
    console.log("Returned list of carpoolee closest to you");

});

module.exports = router;