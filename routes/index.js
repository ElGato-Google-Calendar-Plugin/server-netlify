const router = require('express').Router()
const calendar = require('./calendar')

router.post('/todayEvents', calendar.getTodayEvents);
router.post('/allEvents', calendar.getAllEvents);


module.exports = router;