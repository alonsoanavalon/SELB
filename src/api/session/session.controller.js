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
    const sessions = await sessionService.createSession(req.body);
    res.send(sessions)
})
module.exports = router;