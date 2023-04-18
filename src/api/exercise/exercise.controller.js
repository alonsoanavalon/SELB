const router = require('express').Router()
const exerciseService = require('./exercise.service')

router.get('/', async (req, res) => {
    const results = await exerciseService.getAllExercise();
    res.send(results);
})

router.get('/:id', async (req, res) => {
  const exercise = await exerciseService.getExerciseById(req.params.id);
  res.send(exercise);
})

router.post('/', async (req, res) => {
    const exercises = await exerciseService.createExercise(req.body);
    res.send(exercises)
})
module.exports = router;