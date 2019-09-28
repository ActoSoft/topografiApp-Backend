const User = require('../models/User')

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

const middlewares = {
    checkResponseError: responseError,
    checkAdminRole: adminCheck
}

module.exports = middlewares