//Modulos y variables
console.log("ntramos")
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
const instrumentRoutes = require('./instruments/instruments.controller')
const userRoutes = require('./users/users.controller')
const schoolsRoutes = require('./schools/schools.controller')
const momentRoutes = require('./moments/moments.controller')
const coursesRoutes = require('./courses/courses.controller')
const studentsRoutes = require('./students/students.controller')
const rootMomentsRoutes = require('./routes/moments')
const apiActivityRoutes = require('./api/activity/activity.controller')
const apiExerciseRoutes = require('./api/exercise/exercise.controller')
const apiSessionRoutes = require('./api/session/session.controller')
const apiStudentRoutes = require('./api/student/student.controller')
const apiCommuneRoutes = require('./api/commune/commune.controller')
const apiSchoolRoutes = require('./api/school/school.controller')
const apiCourseRoutes = require('./api/course/course.controller')
const apiChartRoutes = require('./api/chart/chart.controller')
const errorLogRoutes = require('./routes/error-log')
const uploadStudentsService = require('./services/uploadStudents.service')

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
app.use('/api/error-log', errorLogRoutes)

uploadStudentsService.processCSVFile('./src/public/uploads/data.csv')

//Listen
app.listen(app.get('port'), () => {
    console.log(`Conectado en ${app.get("port")}`)
})
