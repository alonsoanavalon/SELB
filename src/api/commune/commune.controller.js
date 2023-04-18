const router = require('express').Router()
const exerciseService = require('./commune.service')

router.get('/', async (req, res) => {
    const results = await exerciseService.getAll();
    res.send(results);
})

router.get('/:id', async (req, res) => {
  const exercise = await exerciseService.getById(req.params.id);
  res.send(exercise);
})

module.exports = router;