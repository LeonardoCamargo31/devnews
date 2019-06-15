const express = require('express')
const router = express.Router()
const Article = require('../models/article')

//criação de middleware para verificar se usuario está logado
router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.roles.indexOf('restrito')>=0){
            return next()
        }
        else{
            //esta logado, mas não é restrito
            res.redirect('/')
        }
    }
    //caso não tenha logado
    res.redirect('/login')
})

router.get('/',(req,res)=>{
    res.send('restrito')
})

router.get('/noticias', async (req,res)=>{
    const articles = await Article.find({category:'private'})
    res.render('articles/restricted',{
        articles
    })
})

module.exports = router