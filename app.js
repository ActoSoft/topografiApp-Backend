const express = require('express') //Express backend framework
const app = express() //App is a object instance of express
const http = require('http') //Http allow us start a server
const moongose = require('mongoose') //Moongose allow the DB connection
const passport = require('passport') //Passport help us with Auth Control

const path = require('path') //Path is a native library of Node to facilitate work with paths
require('dotenv').config() //Get environment variables in the .env file
require('./utils/passportConfig')(passport) //Initialize passport config
const cors = require('cors')
/* **** Import routers files */
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const {
    DB_NAME,
    DB_USER,
    DB_PWD,
    DB_PORT,
    DB_HOST
} = process.env //Getting all the DB connection variables

moongose.connect(`mongodb://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    { useNewUrlParser: true } //This line ALWAYS is required
)
    .then(connection => {
        console.log(`Connected to ${connection.connections[0].name} database`)
    })
    .catch(error => {
        console.log(`Error connecting to database ${error}`)
    })

moongose.set('useFindAndModify', false) //Allow use findIdAndModify and other methods
app.use('/public', express.static(path.join(__dirname, './public'))) //Expose the files into this file
app.use(express.json()) //Allow read the requests sent as application/json content-type
app.use(express.urlencoded({ extended:true }))
app.use(passport.initialize())
app.use(cors())

//app.use('/path', router)
app.use('/auth', authRouter)

app.use('/users',
    passport.authenticate('jwt', { session: false }),
    userRouter)

const server = http.createServer(app) //Create server
server.listen(5000, () => {
    console.log('App running on port 5000')
})