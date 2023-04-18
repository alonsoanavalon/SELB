const router = require('express').Router()
const courseService = require('./course.service')

router.get('/', async (req, res) => {
    const results = await courseService.getAll();
    res.send(results);
})

router.get('/:id', async (req, res) => {
  const exercise = await courseService.getById(req.params.id);
  res.send(exercise);
})

module.exports = router;