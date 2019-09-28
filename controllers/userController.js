const User = require('../models/User')

class UserController {
    async findAll() {
        return User.find({
            deletedAt: null
        }, { password: 0 })
        .then(users => {
            return users
        })
        .catch(error => {
            return {
                hasError: true,
                error
            }
        })
    }

    async findOne(id) {
        return User.findOne({
            _id: id
        })
            .then(user => {
                return user
            })
            .catch(error => {
                return {
                    hasError: true,
                    error
                }
            })
    }
}

module.exports = new UserController()