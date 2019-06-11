const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')

const User = require('./models/user')
const articlesRoutes = require('./routes/articles')
const restrictedRoutes = require('./routes/restricted')

//para o mongose usar as promise padrão do node
mongoose.Promise = global.Promise
//Host do meu banco de dados mongo
const mongo = process.env.MONGODB || 'mongodb://localhost/devnews'

app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, 'views'))
//define o view engine - ejs
app.set('view engine', 'ejs')
//middleware para definir para o express onde fica os arquivos publicos (css/js/img/etc)
app.use(express.static(__dirname + '/public'))

app.use(session({ secret: 'devnews' }))

app.get('/', (req, res) => {
    res.render('index')
})

//criação de middleware para verificar se usuario está logado
app.use('/restrito', (req, res, next) => {
    if ('user' in req.session) {//caso tenha user na minha session
        return next()
    }
    //caso não tenha logado
    res.redirect('/login')
})
app.use('/restrito', restrictedRoutes)
app.use('/noticias', articlesRoutes)

app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    console.log(user)
    const isValid = await user.checkPassword(password)
    if(isValid){
        req.session.user = user
        res.redirect('/restrito/noticias')
    }else{
        res.redirect('/login')
    }
})

//criação do usuario inicial
const createInitialUser = async () => {
    const total = await User.count({ username: 'leonardocn' })
    if (total === 0) {
        const user = new User({
            username: 'leonardocn',
            password: '123'
        })
        await user.save()
        console.log('Usuário inicial criado')
    } else {
        console.log('Criação de usuário inicial ignorada')
    }
}

//conectando com o banco de dados
mongoose.connect(mongo, { useNewUrlParser: true }).then(() => {
    app.listen(port, () => {
        createInitialUser()
        console.log(`Servidor está rodando na porta ${port}`)
    })
}).catch(err => console.log(err))