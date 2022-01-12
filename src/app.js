const express = require('express')
const app = express()
const indexRoutes = require('./routes/index')


app.set('port', process.env.PORT || 3000)

app.use('/', indexRoutes)
app.get("/test", (req, res) => {
    res.send("ok")
})



app.listen(app.get('port'), () => {
    console.log(`Conectado en ${app.get("port")}`)
})