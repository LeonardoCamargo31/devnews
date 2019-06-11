const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const mongoose = require('mongoose')
const User = require('./models/user')

mongoose.Promise = global.Promise
const mongo = process.env.MONGODB || 'mongodb://localhost/devnews'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

const createInitialUser = async () => {
    const total = await User.count({ username: 'leonardocn' })
    if (total === 0) {
        const user = new User({
            username: 'leonardocn',
            password: '123'
        })
        await user.save()
        console.log('Usuário inicial criado')
    }else{
        console.log('Criação de usuário inicial ignorada')
    }
}

mongoose.connect(mongo, { useNewUrlParser: true }).then(() => {
    app.listen(port, () => {
        createInitialUser()
        console.log(`Servidor está rodando na porta ${port}`)
    })
}).catch(err => console.log(err))