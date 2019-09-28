const User = require('../models/User')
const bcrypt = require('bcryptjs')

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

    async update(id, body) {
        return User.findByIdAndUpdate(id, body, {
            new: true
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

    async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.genSalt(10)
            .then(salt => {
                return bcrypt.hash(newPassword, salt)
                    .then(hash => hash)
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
        return User.findByIdAndUpdate(userId,
            { password: hashedPassword },
            { new: true }
        )
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