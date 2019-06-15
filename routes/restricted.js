const express = require('express')
const router = express.Router()
const Article = require('../models/article')

//criação de middleware para verificar se usuario está logado
router.use((req, res, next) => {
    if ('user' in req.session) {//caso tenha user na minha session
        return next()
    }
    //caso não tenha logado
    res.redirect('/login')
})

router.get('/',(req,res)=>{
    res.send('restrito')
})

router.get('/noticias', async (req,res)=>{
    const articles = await Article.find({category:'private'})
    res.render('articles/index',{
        articles
    })
})

module.exports = router