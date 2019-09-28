const router = require('express').Router()

// console.log(require('../utils/passportConfig'))
const { checkResponseError, checkAdminRole } = require('../utils/middlewares')

const userController = require('../controllers/userController')

router.get('/', checkAdminRole, (req, res, next) => {
    userController.findAll()
        .then(result => {
            next(result)
        })
        .catch(error => res.status(400).json(error))
})

router.get('/:id', (req, res, next) => {
    userController.findOne(req.params.id)
        .then(result => {
            next(result)
        })
        .catch(error => res.status(400).json(error))
})

router.use(checkResponseError)

module.exports = router