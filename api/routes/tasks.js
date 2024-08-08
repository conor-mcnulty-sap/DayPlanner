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

    if (error){
        return error;
    }

    // If user has no tasks
    if (data.length == 0) {
        res.send('No tasks found for user');
        console.log('No tasks found for user');
        return;
    }
    else {
        // Sort task by the time
        data.sort((a, b) => {
            return a.time.localeCompare(b.time);
        });
        res.send(data);
    }
    console.log('Tasks retrieved successfully');
});

// Add Task
router.post('/addtask', async (req, res) => {
    let in_userid = req.query.user_id;
    let in_taskname = req.query.task_name;
    let in_taskdescription = req.query.task_description;
    let in_taskdate = req.query.task_date;
    let in_tasktime = req.query.task_time;
    let in_taskduration = req.query.task_duration;
    let in_taskcolour = req.query.task_colour;
    let in_event_id = req.query.event_id;

    console.log(in_tasktime);
    console.log(in_taskduration);


    // Split the time strings into components
    let [hours1, minutes1] = in_tasktime.split(':').map(Number);
    let [hours2, minutes2] = in_taskduration.split(':').map(Number);

    // Add the times together
    let totalMinutes = minutes1 + minutes2;
    let totalHours = hours1 + hours2 + Math.floor(totalMinutes / 60);

    // Adjust the total values to fit into proper time format
    let finalMinutes = totalMinutes % 60;
    let finalHours = totalHours % 24; // Assuming we are not dealing with more than 24 hours

    // Format the result as HH:MM:SS
    let newTaskTime = [
        finalHours.toString().padStart(2, '0'),
        finalMinutes.toString().padStart(2, '0'),
    ].join(':');

    console.log("New Task Time: ", newTaskTime);


    const {data, error} = await supabase
    .from('tasks')
    .insert(
        {
            user: in_userid,
            task: in_taskname,
            description: in_taskdescription,
            date: in_taskdate,
            time: in_tasktime,
            end_time: newTaskTime,
            duration: in_taskduration,
            colour: in_taskcolour,
            event_id: in_event_id
        }
    );

    // If task isnt added
    if (error) {
        res.send('Task not added');
        console.log('Task not added');
        return;
    }
    else {
        res.send(data);
        console.log('Task added successfully');
    }
});

// Remove Task
router.delete('/removetask', async (req, res) => {
    let in_taskid = req.query.id;

    const {data, error} = await supabase
    .from('tasks')
    .delete()
    .eq('event_id', in_taskid);
    
    // If task isnt removed
    if (error) {
        res.send('Task not removed');
        console.log('Task not removed');
        return;
    }
    else {
        res.send(data);
        console.log('Task removed successfully');
    }
});


module.exports = router;