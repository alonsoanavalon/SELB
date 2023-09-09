const router = require('express').Router()
const sessionService = require('./session.service')

router.get('/', async (req, res) => {
    const results = await sessionService.getAllSession();
    res.send(results);
})

router.get('/:id', async (req, res) => {
  const session = await sessionService.getSessionById(req.params.id);
  res.send(session);
})

//con este consigo toda la estructura completa por sesion
router.get('/course/:id', async (req, res) => {
  const exercisesByStudent = await sessionService.getExercisesByCourse(req.params.id);
  res.send(exercisesByStudent) ;
})


// /sessions/course/:id
// /sessions/course/:id/session/:id/activity
// /sessions/course/:id/session/:id/activity/:id/exercises


// /exercises/course/:id
// /exercises/course/:id/session/:id/activity
// /exercises/course/:id/session/:id/activity/:id/exercises



router.get('/course/:courseId/session/:sessionId/activity', async (req, res) => {
  const exercisesBySessionAndCourse = await sessionService.getExercisesBySessionAndCourse(req.params.sessionId, req.params.courseId);
  res.send(exercisesBySessionAndCourse);
})

router.get('/course/:courseId/session/:sessionId/activity/:activityId/student/:studentId', async (req, res) => {
  const exercisesBySessionAndCourse = await sessionService.getExercisesBySessionActivityAndStudent(req.params.sessionId, req.params.courseId, req.params.activityId, req.params.studentId);
  res.send(exercisesBySessionAndCourse);
})

router.get('/course/:courseId/session/:sessionId/student/:studentId', async (req, res) => {
  const exercisesBySessionAndCourse = await sessionService.getActivitiesBySessionAndStudent(req.params.sessionId, req.params.courseId, req.params.studentId);
  res.send(exercisesBySessionAndCourse);
})


router.post('/', async (req, res) => {
  try {
    const sessions = await sessionService.createSession();
    res.status(201).send(sessions)
  } catch (err) {
    res.status(500).send({
      message:"Hubo un error al ingresar la sesión",
      error: err
    });
  }

})
module.exports = router;