const router = require('express').Router()
const {
    checkResponseError,
    checkAdminRole,
    checkPasswordUpdate
} = require('../utils/middlewares')

const userController = require('../controllers/userController')

router.get('/', (req, res, next) => {
    userController.findAll()
        .then(result => next(result))
        .catch(error => res.status(400).json(error))
})

router.get('/:id', (req, res, next) => {
    userController.findOne(req.params.id)
        .then(result => next(result))
        .catch(error => res.status(400).json(error))
})

router.put('/changePassword', checkPasswordUpdate, (req, res, next) => {
    userController.updatePassword(req.user.id, req.body.newPassword)
        .then(result => next(result))
        .catch(error => res.status(400).json(error))
})

router.put('/:id', checkAdminRole, (req, res, next) => {
    userController.update(req.params.id, req.body)
        .then(result => {
            next(result)
        })
        .catch(error => {
            res.status(400).json(error)
        })
})

router.use(checkResponseError)

module.exports = router