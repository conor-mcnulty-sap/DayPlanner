const express = require('express');
const newsRoutes = require('./routes/news');
const usersRoutes = require('./routes/users');
const desksRoutes = require('./routes/desks');
const bookingsRoutes = require('./routes/bookings');
const carpoolsRoutes = require('./routes/carpools');
const tasksRoutes = require('./routes/tasks');
const buildingsRoutes = require('./routes/buildings');
//const testRoutes = require('./routes/test');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

router.use('/api/news', newsRoutes);
router.use('/api/users', usersRoutes);
router.use('/api/desks', desksRoutes);
router.use('/api/bookings', bookingsRoutes);
router.use('/api/carpools', carpoolsRoutes);
router.use('/api/tasks', tasksRoutes);
router.use('/api/buildings', buildingsRoutes);
//router.use('/api/test', testRoutes);

module.exports = router;