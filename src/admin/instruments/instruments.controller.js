const router = require('express').Router()
const authController = require('../../auth/auth.controller')
const instrumentService = require('./instruments.service')

router.get('/', authController.isAuthenticated, async (req, res) => {
    const allInstruments = await instrumentService.getAllInstruments();
    res.render("all-instruments", {
        results: allInstruments
    })
})

module.exports = router;