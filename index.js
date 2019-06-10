const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
const mongo = process.env.MONGODB || 'mongodb://localhost/devnews'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index')
})

mongoose.connect(mongo, { useNewUrlParser: true }).then(()=>{
    app.listen(port, () => {
        console.log(`Servidor está rodando na porta ${port}`)
    })
}).catch(err => console.log(err))


const User = require('./models/user')
const user  = new User({
    username:'leonardocn',
    password:'123'
})
user.save(()=>console.log('save'))