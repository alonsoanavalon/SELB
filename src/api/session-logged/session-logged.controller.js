const router = require("express").Router()
const { createSessionLogged, getAllSessionLogged } = require("./session-logged.service")

router.post("/", createSessionLogged)
router.get("/", getAllSessionLogged)

module.exports = router