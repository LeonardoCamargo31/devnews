const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

//antes de salvar
UserSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password')) {//caso não tenha modificado
        return next()
    }
    bcrypt.genSalt((error, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash//modifico a senha
            next()
        })
    })
})

const User = mongoose.model('User', UserSchema)
module.exports = User