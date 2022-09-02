const router = require('express').Router()
const authController = require('../controllers/authControllers')
const instrumentService = require('./instruments.service')

router.get('/', authController.isAuthenticated, async (req, res) => {
    const allInstruments = await instrumentService.getAllInstruments();
    res.render("all-instruments", {
        results: allInstruments
    })
})



module.exports = router;