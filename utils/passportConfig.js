const { Strategy, ExtractJwt } = require('passport-jwt')
const secret = process.env.JWT_SECRET || 'defaultSecret' //Get Secret from .env
const User = require('../models/User')

const opts = { //Object with the way how the JWT is sent to backend and the Secret Key
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
    secretOrKey: secret
}

module.exports = passport => {
    passport.use(
        /* Strategy gets a callback with the payload and done method */
        new Strategy(opts, (payload, done) => { //Passing as params the opts
            User.findById(payload.id) //Getting User in the DB via ID
                .then(user => {
                    if (user) {
                        const { name, email } = user
                        return done(null, { //Method done finalizes the Strategy and allow the auth
                            id: user._id,
                            name,
                            email
                        })
                    }
                    return done(null, false) //If somethind failed, passing false as 2do param.
                })
                .catch(error => {
                    console.log(error)
                })
        })
    )
}