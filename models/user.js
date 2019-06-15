const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    roles: {
        type: [String],
        enum: ['restrito', 'admin']
    },
    facebookId:String,
    googleId:String,
    name:String
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

//methods podemos adicionar alguns metodos adicionais
UserSchema.methods.checkPassword = function (password) {//como vamos usar o contexto, não podemos usar arrow function
    return new Promise((resolve, reject) => {
        //comparar a senha informada com a do usuario
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) {
                reject(err)
            } else {
                resolve(isMatch)//isMatch retorna true ou false
            }
        })
    })
}

const User = mongoose.model('User', UserSchema)
module.exports = User