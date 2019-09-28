const User = require('../models/User')
const bcrypt = require('bcryptjs')

responseError = (result, req, res, next) => {
    if (result.hasError)
        return res.status(400).json(res.error)
    return res.json(result)
}

adminCheck = (req, res, next) => {
    if(req.user && req.user.role === 'Manager') {
        next()
    } else {
        res.status(400).json({
            message: 'No tienes permisos para esta acción'
        })
    }
}

passwordCheck = (req, res, next) => {
    const {
        actualPassword,
        newPassword
    } = req.body
    if(!actualPassword)
        return res.status(400).json({
            message: 'Contraseña actual vacía'
        })
    User.findOne({ _id: req.user.id })
        .then(user => {
            if (!user) {
                return res.status(500)
            }
            bcrypt.compare(actualPassword, user.password)
                .then(isMatch => {
                    if (!isMatch)
                        return res.status(400).json({
                                message: 'Contraseña actual incorrecta'
                            })
                    next()
                })
        })
}

const middlewares = {
    checkResponseError: responseError,
    checkAdminRole: adminCheck,
    checkPasswordUpdate: passwordCheck
}

module.exports = middlewares