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
  try {
    const activity = await activityService.createActivity(req.body);
    res.status(201).send(activity)
  } catch (err) {
    res.status(500).send({
      message:"Hubo un error al ingresar el ejercicio",
      error: err
    });
  }

})
module.exports = router;