//Modulos y variables
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const express = require('express')
const app = express()
const multer = require('multer')
const indexRoutes = require('./routes/index')
const signinRoutes = require('./routes/signin')
const signupRoutes = require('./routes/signup')
const adminRoutes = require('./routes/admin')
const logoutRoutes = require('./routes/logout')
const testRoutes = require('./routes/test')
const loginRoutes = require('./routes/login')
const uploadRoutes = require('./routes/upload')
const getDataRoutes = require('./routes/getData')
const postDataRoutes = require('./routes/postData')
const excelRoutes = require('./routes/excel')


const fs = require('fs')
const https = require('https')

const morgan = require('morgan')
const cookieParser = require('cookie-parser')

//handlebars
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

//Settings

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
        cert:fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
    },
    app
)


app.set('port', process.env.PORT || 3500)
const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars), 
    layoutsDir: path.join(__dirname, 'public', 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'public', 'views', 'partials'),
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

app.set('views', path.join(__dirname,'public', 'views'))
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.use(express.static(path.join(__dirname, 'public')));


//Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

const storage = multer.diskStorage({
    destination:path.join(__dirname, 'public/uploads'),
    filename:(req, file, cb) => {
        cb(null, file.originalname);
    }
})

app.use(multer({
    storage:storage,
    dest: path.join(__dirname, 'public/uploads')
}).single('data'))


app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method,');
    res.header('content-type: application/json; charset=utf-8')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next()
})


//Ruteo
app.use('/', indexRoutes)
app.use('/signin', signinRoutes)
app.use('/signup', signupRoutes)
app.use('/admin', adminRoutes)
app.use('/logout', logoutRoutes)
app.use('/test', testRoutes)
app.use('/login', loginRoutes)
app.use('/upload', uploadRoutes)
app.use(getDataRoutes)
app.use(postDataRoutes)
app.use('/excel', excelRoutes)

//Listen
app.listen(app.get('port'), () => {
    console.log(`Conectado en ${app.get("port")}`)
})