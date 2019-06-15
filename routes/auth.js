const express = require('express')
const router = express.Router()
const User = require('../models/user')

const passaport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy

//inicializar o passaport
router.use(passaport.initialize())
//ele ira usar session
router.use(passaport.session())

passaport.serializeUser((user, done) => {
    done(null, user)
})
passaport.deserializeUser((user, done) => {
    done(null, user)
})

//definindo a estrategia para login local
passaport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username })
    if (user) {//se usuario existir
        const isValid = await user.checkPassword(password)
        if (isValid) {
            return done(null, user)//retornamos o callback
        } else {
            return done(null, false)
        }
    } else {
        return done(null, false)
    }
}))

//definindo a estrategia para login com facebook
passaport.use(new FacebookStrategy({
    clientID: '358323758202060',
    clientSecret: '2cb1a88ca74b7ec2b145d084c6428d9d',
    callbackURL: 'http://localhost:3000/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
}, async (accessToken, refreshToken, profile, done) => {//quando ele logar chama esse callback
    //checar se temos esse usuario
    const userDB = await User.findOne({ facebookId: profile.id })
    if (!userDB) {//caso não exista esse usuario,iremos criar
        const user = new User({
            name: profile.displayName,
            facebookId: profile.id,
            roles: ['restrito']
        })
        await user.save()//salvo esse novo usuario
        done(null, user)//retorno o usuario
    } else {
        done(null, userDB)
    }
}))


//middleware vai ser usado em toda requisição
router.use((req, res, next) => {
    //caso esteja autenticado
    if (req.isAuthenticated()) {
        //definindo minhas locals
        res.locals.user = req.user
        //caso não tenha setado a session role
        if (!req.session.role) {
            req.session.role = req.user.roles[0]
        }
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
    if (req.isAuthenticated()) {
        const role = req.params.role
        //checar se usuario tem essa role, que esta mandando
        if (req.user.roles.indexOf(role) >= 0) {
            //setamos essa role como ativa
            req.session.role = role
        }
    }
    res.redirect('/')
})

//setando para usar nossa strategy local
router.post('/login', passaport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}))

//setando para usar nossa strategy facebook
router.get('/facebook', passaport.authenticate('facebook'))
//quando logar com facebook, vai para facebook, depois de logar ele nos devolve os dados do usuario
router.get('/facebook/callback',passaport.authenticate('facebook',{
    failureRedirect:'/'
}),(req,res)=>{
    res.redirect('/')
})

module.exports = router