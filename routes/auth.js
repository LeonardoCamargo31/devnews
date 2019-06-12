const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    const isValid = await user.checkPassword(password)
    if (isValid) {
        req.session.user = user
        res.redirect('/restrito/noticias')
    } else {
        res.redirect('/login')
    }
})

module.exports = router