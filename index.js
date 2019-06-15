const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')

const User = require('./models/user')
const Article = require('./models/article')
const articlesRoutes = require('./routes/articles')
const restrictedRoutes = require('./routes/restricted')
const authRoutes = require('./routes/auth')
const pagesRoutes = require('./routes/pages')

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


app.use('/', authRoutes)
app.use('/',pagesRoutes)

app.use('/restrito', restrictedRoutes)
app.use('/noticias', articlesRoutes)


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

const createArticle = async () => {
    const article = new Article({
        title:"Noticias publica "+new Date().getTime(),
        content:'Content',
        category:'public'
    })
    await article.save()

    const articlePrivate = new Article({
        title:"Noticias privada "+new Date().getTime(),
        content:'Content',
        category:'private'
    })
    await articlePrivate.save()
}


//createArticle()

//conectando com o banco de dados
mongoose.connect(mongo, { useNewUrlParser: true }).then(() => {
    app.listen(port, () => {
        createInitialUser()
        console.log(`Servidor está rodando na porta ${port}`)
    })
}).catch(err => console.log(err))