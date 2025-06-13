//Modulos y variables
const path = require('path')
const cors = require("cors")
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const express = require('express')
const app = express()
const multer = require('multer')
const indexRoutes = require('./admin/index')
const signinRoutes = require('./admin/signin')
const signupRoutes = require('./admin/signup')
const adminRoutes = require('./admin/admin')
const logoutRoutes = require('./auth/logout')
const loginRoutes = require('./auth/login')
const uploadRoutes = require('./admin/upload')
const getDataRoutes = require('./api/getData')
const postDataRoutes = require('./api/postData')
const excelRoutes = require('./api/excel')
const instrumentRoutes = require('./admin/instruments/instruments.controller')
const userRoutes = require('./admin/users/users.controller')
const schoolsRoutes = require('./admin/schools/schools.controller')
const momentRoutes = require('./admin/moments/moments.controller')
const coursesRoutes = require('./admin/courses/courses.controller')
const studentsRoutes = require('./admin/students/students.controller')
const rootMomentsRoutes = require('./api/moment/moment.controller')
const apiActivityRoutes = require('./api/activity/activity.controller')
const apiExerciseRoutes = require('./api/exercise/exercise.controller')
const apiSessionRoutes = require('./api/session/session.controller')
const apiStudentRoutes = require('./api/student/student.controller')
const apiCommuneRoutes = require('./api/commune/commune.controller')
const apiSchoolRoutes = require('./api/school/school.controller')
const apiSchoolAssignationRoutes = require('./api/school_assignation/school-asignation.controller')
const apiCourseRoutes = require('./api/course/course.controller')
const apiChartRoutes = require('./api/chart/chart.controller')
const errorLogRoutes = require('./api/error-log')
const sessionLoggedRoutes = require('./api/session-logged/session-logged.controller')
const sessionVersionRoutes = require('./api/session-version/session-version.controller')

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


app.set('port', process.env.APP_PORT || 3500)
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
        },
        renderAdmin: function (role) {
            return (role == "Admin") ? true : false
        },
        selectedOption: function (courses, course_id) {
            console.log(courses)
            courses.map(course => {
                if (course.id == course_id) {
                    return "selected"
                }
            })
        }
    }
})

app.set('views', path.join(__dirname,'public', 'views'))
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')
app.use(express.static(path.join(__dirname, 'public')));


//Middlewares
/* app.use(morgan('dev')) */
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors())

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
app.use('/login', loginRoutes)
app.use('/upload', uploadRoutes)
app.use('/moments', rootMomentsRoutes)
app.use(getDataRoutes)
app.use(postDataRoutes)
app.use('/excel', excelRoutes)
app.use('/admin/instruments', instrumentRoutes)
app.use('/admin/users', userRoutes)
app.use('/admin/schools', schoolsRoutes)
app.use('/admin/moments', momentRoutes) 
app.use('/admin/courses', coursesRoutes)
app.use('/admin/students', studentsRoutes)
app.use('/api/student', apiStudentRoutes)
app.use('/api/activity', apiActivityRoutes)
app.use('/api/session', apiSessionRoutes)
app.use('/api/exercise', apiExerciseRoutes)
app.use('/api/school', apiSchoolRoutes)
app.use('/api/commune', apiCommuneRoutes)
app.use('/api/course', apiCourseRoutes)
app.use('/api/chart', apiChartRoutes)
app.use('/api/school-assignation', apiSchoolAssignationRoutes)
app.use('/api/error-log', errorLogRoutes)
app.use('/api/session-logged', sessionLoggedRoutes)
app.use('/api/session-version', sessionVersionRoutes)


//Listen
app.listen(app.get('port'), () => {
    console.log(`Conectado en ${app.get("port")}`)
})
