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