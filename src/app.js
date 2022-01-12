//Modulos y variables
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const express = require('express')
const app = express()
const indexRoutes = require('./routes/index')
const signinRoutes = require('./routes/signin')
const signupRoutes = require('./routes/signup')
const adminRoutes = require('./routes/admin')
const logoutRoutes = require('./routes/logout')

const morgan = require('morgan')
const cookieParser = require('cookie-parser')

//handlebars
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

//Settings
app.set('port', process.env.PORT || 3000)
const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars), 
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main',
    extname: '.hbs',

    helpers: {
        loud: function (aString) {
            return aString.toUpperCase()
        },
        test:function(contador) {
            if (contador == 2){
                let txt = `Son 2`
                return txt
            }
        },
        price: function (precio, num) {
            precio = precio * num
            return precio
        },
        selectImg : function (bddImg, image) {
            return bddImg || image
        }
    }
})

app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.use(express.static(path.join(__dirname, 'public')));


//Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())



//Ruteo
app.use('/', indexRoutes)
app.use('/signin', signinRoutes)
app.use('/signup', signupRoutes)
app.use('/admin', adminRoutes)
app.use('/logout', logoutRoutes)

//Listen
app.listen(app.get('port'), () => {
    console.log(`Conectado en ${app.get("port")}`)
})