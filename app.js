const express = require('express')
const app = express()
const http = require('http')
const moongose = require('mongoose')
require('dotenv').config()

const {
    DB_NAME,
    DB_USER,
    DB_PWD,
    DB_PORT,
    DB_HOST
} = process.env

moongose.connect(`mongodb://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    { useNewUrlParser: true }
)
    .then(connection => {
        console.log(`Connected to ${connection.connections[0].name} database`)
    })
    .catch(error => {
        console.log(`Error connecting to database ${error}`)
    })


const server = http.createServer(app)
server.listen(5000, () => {
    console.log('App running on port 5000')
})