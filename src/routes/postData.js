const router = require('express').Router()
const instrumentControllers = require('../controllers/instrumentControllers')

router.post('/newevaluation', async (req, res) => {
    
    let allInstruments = req.body

/*     allInstruments.forEach( instrument => {
        let [infoObject, choicesObject] = instrument
        instrumentControllers.saveInstrumentData(infoObject, choicesObject)
        
    }) */

    console.log(`[                       INGRESARON ${allInstruments.length} test                        ]`)
    let instrumentIndex = 1;
    for (const instrument of allInstruments) {
        console.log(`TEST N° ${instrumentIndex} ---------------------------------------------`)
        let [infoObject, choicesObject] = instrument
        await instrumentControllers.saveInstrumentData(infoObject, choicesObject, instrumentIndex)
        console.log(`FIN  N° ${instrumentIndex} ---------------------------------------------`)
        instrumentIndex++
 
    }
    console.log(`[                         FIN                                                           ]`)
    

})

module.exports = router;