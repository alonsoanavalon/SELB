const router = require('express').Router()
const instrumentControllers = require('../controllers/instrumentControllers')

router.post('/newevaluation', async (req, res) => {
    
    let allInstruments = req.body

/*     allInstruments.forEach( instrument => {
        let [infoObject, choicesObject] = instrument
        instrumentControllers.saveInstrumentData(infoObject, choicesObject)
        
    }) */

    for (instrument of allInstruments) {

        let [infoObject, choicesObject] = instrument
        await instrumentControllers.saveInstrumentData(infoObject, choicesObject)

 
    }

})

module.exports = router;