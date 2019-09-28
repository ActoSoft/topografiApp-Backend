const express = require('express')
const router = express.Router() //Creating a instance object of Router class of Express
const User = require('../models/User')
const bcrypt = require('bcryptjs') //Library to encrypt passwords
const jwt = require('jsonwebtoken') //JWT library
require('dotenv').config()
const secret = process.env.JWT_SECRET || 'defaultSecret'

console.log(secret)

router.post('/register',
    (req, res) => {
        User.findOne({ email: req.body. email }) //Search a User with the email sent in the request
            .then(user => {
                //As email is unique, if user exist, response with a 400 status
                if (user) return res.status(400).json({
                    message: 'El email ya está siendo utilizado'
                })
                else {
                    const newUser = new User(req.body)
                    const rawPassword = newUser.password
                    bcrypt.genSalt(10, (err, salt) => { //Salt add random data to the password to be more secure
                        if (err) throw err
                        if(!newUser.password) res.status(400).json({ //If the password in the request is empty, return 400
                            mesage: 'No se especificó contraseña'
                        })
                        //Hash is a encrypt method to secure passwords
                        bcrypt.hash(rawPassword, salt, (err, hash) => {
                            if (err) throw err
                            //Now we're going to store the hashed password in the DB
                            //Instead of store the raw password (VERY BAD IDEA)
                            newUser.password = hash
                            //Saving the user into the DB
                            newUser.save()
                                //Response with user recently created
                                .then(user => {
                                    res.json(user)
                                })
                                .catch(error => {
                                    res.status(400).json(error)
                                })
                        })
                    })
                }
            })
    })

router.post('/login', (req, res) => {
    //Deconstruct the email and the password for the request body
    const { email, password } = req.body
    //Try to find the user in the DB via email
    User.findOne({ email })
        .then(user => {
            if(!user) { //User with that email doesn't exists
                return res.status(400)
                    .json({
                        message: 'El usuario no existe'
                    })
            }
            /*Compare the password in the request with password on the DB
            We use bcrypt.compare method because we have in the DB
            The hashed password, so we don't compare easily */
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    //Password are equal
                    if(isMatch) {
                        //Payload object with the Id and the username of the user
                        const payload = {
                            id: user._id,
                            username: user.username
                        }
                        //Using sign method of jwt library to generate token
                        jwt.sign(
                            payload,
                            secret,
                            { expiresIn: 36000 }, //Lifetime of the token (in second)
                            (err, token) => {
                                if(err) res.status(500) //If error, 500 response
                                /* Response with a ok message, the token in the
                                form Bearer token (JWT convention) and the
                                info of the user in the DB */
                                console.log(token)
                                res.json({
                                    message: 'ok',
                                    token: `Bearer ${token}`,
                                    user
                                })
                            })
                    }
                    else {
                        //Passwords don't match
                        res.status(400).json({
                            message: 'Claves inválidas de acceso'
                        })
                    }
                })
        })
})

module.exports = router //Always export the router object, it contains all the routes