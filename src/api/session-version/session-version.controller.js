const router = require('express').Router()
const sessionVersionService = require('./session-version.service')

router.get('/', async (req, res) => {
    const results = await sessionVersionService.getAll();
    res.send(results);
})

router.get('/:id', async (req, res) => {
  const session = await sessionVersionService.getById(req.params.id);
  res.send(session);
})

router.get('/version/:id', async (req, res) => {
  const session = await sessionVersionService.getByVersionId(req.params.id);
  res.send(session);
})

router.post('/', async (req, res) => {
  const session = await sessionVersionService.createSessionVersion(req.body);
  res.send(session);
})

router.put('/:id', async (req, res) => {
  const session = await sessionVersionService.updateSessionVersion(req.params.id, req.body);
  res.send(session);
})

router.get('/activity/:id', async (req, res) => {
  const activities = await sessionVersionService.getActivitiesByVersionId(req.params.id);
  res.send(activities);
})

router.get('/session/:id', async (req, res) => {
  const sessions = await sessionVersionService.getSessionsByVersionId(req.params.id);
  res.send(sessions);
})


module.exports = router;