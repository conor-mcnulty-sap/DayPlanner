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
    let in_userid = req.query.user_id;

    const {data, error} = await supabase
    .from('tasks')
    .select('*,users(*)')
    .eq('user', in_userid);
    
    // Sort task by the time
    data.sort((a, b) => {
        return a.time.localeCompare(b.time);
    });
    res.send(data);
});

// Add Task
router.post('/addtask', async (req, res) => {
    let in_userid = req.query.user_id;
    let in_taskname = req.query.task_name;
    let in_taskdescription = req.query.task_description;
    let in_taskdate = req.query.task_date;
    let in_tasktime = req.query.task_time;
    let in_taskcolour = req.query.task_colour;

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
    let in_taskid = req.query.id;

    const {data, error} = await supabase
    .from('tasks')
    .delete()
    .eq('id', in_taskid);
    res.send(data);
    console.log('Task removed successfully');
});


module.exports = router;