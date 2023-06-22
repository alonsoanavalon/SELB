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

router.get('/course/:id', async (req, res) => {
  const exercises = await exerciseService.getExercisesByCourse(req.params.id);
  res.send(exercises);
})

router.post('/', async (req, res) => {
  try {
    const exercises = await exerciseService.createExercise(req.body);
    res.status(201).send(exercises)
  } catch (err) {
    res.status(500).send({
      message:"Hubo un error al ingresar el ejercicio",
      error: err
    });
  }
 
})
module.exports = router;