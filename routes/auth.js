const express = require('express')
const router = express.Router()
const User = require('../models/user')


//middleware vai ser usado em toda requisição
router.use((req, res, next) => {
    if ('user' in req.session) {//caso tenha user na minha session
        //definindo minhas locals
        res.locals.user = req.session.user
        res.locals.role = req.session.role
    }
    next()
})


router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

router.get('/change-role/:role', (req, res) => {
    //primeiro checamos se ele está logado
    if ('user' in req.session) {
        const role = req.params.role
        //checar se usuario tem essa role, que esta mandando
        if (req.session.user.roles.indexOf(role) >= 0) {
            //setamos essa role como ativa
            req.session.role = role
        }
    }
    res.redirect('/')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (user) {//se usuario existir
        const isValid = await user.checkPassword(password)
        if (isValid) {
            req.session.user = user
            req.session.role = user.roles[0]//pegamos a primeira role
            res.redirect('/restrito/noticias')
        } else {
            res.redirect('/login')
        }
    }
    res.redirect('/login')
})

module.exports = router