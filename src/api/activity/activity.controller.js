const router = require('express').Router()
const activityService = require('./activity.service')

router.get('/', async (req, res) => {
    const results = await activityService.getAllActivity();
    res.send(results);
})

router.get('/:id', async (req, res) => {
  const activity = await activityService.getActivityById(req.params.id);
  res.send(activity);
})

router.post('/', async (req, res) => {
    const activity = await activityService.createActivity(req.body);
    res.send(activity)
})
module.exports = router;