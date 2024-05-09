const { supabase } = require('../../supabaseClient.js');
const express = require('express');

const router = express.Router();

//Get all tasks
router.get('/', async (req, res) => {
    const {data, error} = await supabase
    .from('tasks')
    .select('*,users(*)');
    res.send(data);
});

// Get User Tasks
router.get('/usertasks', async (req, res) => {
    let in_userid = req.body.user_id;
    const {data, error} = await supabase
    .from('tasks')
    .select('*,users(*)')
    .eq('user', in_userid);
    res.send(data);
});

// Add Task
router.post('/addtask', async (req, res) => {
    let in_userid = req.body.user_id;
    let in_taskname = req.body.task_name;
    let in_taskdescription = req.body.task_description;
    let in_taskdate = req.body.task_date;
    let in_tasktime = req.body.task_time;
    let in_taskcolour = req.body.task_colour;

    const {data, error} = await supabase
    .from('tasks')
    .insert(
        {
            user: in_userid,
            task: in_taskname,
            description: in_taskdescription,
            date: in_taskdate,
            time: in_tasktime,
            colour: in_taskcolour
        }
    );
    res.send(data);
    console.log('Task added successfully');
});

// Remove Task
router.delete('/removetask', async (req, res) => {
    let in_taskid = req.body.id;

    const {data, error} = await supabase
    .from('tasks')
    .delete()
    .eq('id', in_taskid);
    res.send(data);
    console.log('Task removed successfully');
});


module.exports = router;