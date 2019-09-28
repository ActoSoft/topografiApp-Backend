const User = require('../models/User')
const bcrypt = require('bcryptjs')
const moment = require('moment')

class UserController {
    async findAll() {
        return User.find({
            deletedAt: null
        }, { password: 0 })
        .then(users => users)
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
            .then(user => user)
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
            .then(user => user)
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
        return User.findByIdAndUpdate(userId, {
            password: hashedPassword
        }, {
            new: true
        })
            .then(user => user)
            .catch(error => {
                return {
                    hasError: true,
                    error
                }
            })
    }

    async delete(id) {
        const now = moment().format('YYYY-MM-DD hh:mm:ss')
        return User.updateOne({_id: id}, {
            deletedAt: now
        })
            .then(result => {
                return result
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