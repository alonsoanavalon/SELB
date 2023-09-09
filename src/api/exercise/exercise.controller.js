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

router.get('/course/:courseId/session', async (req, res) => {
  const getExercisesBySessionsAndCourse = await exerciseService.getExercisesBySessionsAndCourse(req.params.courseId);
  res.send(getExercisesBySessionsAndCourse);
})

router.get('/course/:courseId/session/:sessionId', async (req, res) => {
  const getExercisesBySessionAndCourse = await exerciseService.getExercisesBySessionAndCourse(req.params.courseId, req.params.sessionId);
  res.send(getExercisesBySessionAndCourse);
})

router.get('/course/:courseId/student/:studentId/session', async (req, res) => {
  const getExercisesBySessionAndStudent = await exerciseService.evaluateExercisesBySessionAndStudent(req.params.courseId, req.params.studentId);
  res.send(getExercisesBySessionAndStudent);
})
module.exports = router;