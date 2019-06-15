const express = require('express')
const router = express.Router()
const Article = require('../models/article')

//criação de middleware para verificar se usuario está logado
router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.roles.indexOf('admin')>=0){//se existir admin dentro de role
            return next()
        }
        else{
            //esta logado, mas não é admin
            res.redirect('/')
        }
    }
    //caso não tenha logado
    res.redirect('/login')
})

router.get('/',(req,res)=>{
    res.send('admin')
})

router.get('/noticias', async (req,res)=>{
    const articles = await Article.find()
    res.render('articles/admin',{
        articles
    })
})

module.exports = router