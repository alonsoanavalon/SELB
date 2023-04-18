const router = require('express').Router()
const schoolService = require('./school.service')

router.get('/', async (req, res) => {
    const results = await schoolService.getAll();
    res.send(results);
})

router.get('/:id', async (req, res) => {
  const exercise = await schoolService.getById(req.params.id);
  res.send(exercise);
})

module.exports = router;