const { supabase } = require('../../supabaseClient.js');
const express = require('express');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    const {data, error} = await supabase
    .from('users')
    .select('*');
    res.send(data);
});

// Create user
router.post('/createuser', async (req, res) => {
    let in_name = req.body.name;
    let in_email = req.body.email;

    // Check if user already exists
    const {data: users, error} = await supabase
    .from('users')
    .select('*')
    .eq('email', in_email);

    if (users.length > 0) {
        res.send('User already exists');
        console.log('User already exists');
        return;
    }
    else {
        const {data, error} = await supabase
        .from('users')
        .insert(
            {
                name: in_name,
                email: in_email
            }
        );
        res.send(data);
        console.log('User added successfully');
    }
});

module.exports = router;