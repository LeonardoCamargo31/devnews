const express = require('express')
const router = express.Router()
const Article = require('../models/article')

router.get('/', async (req, res) => {
    let conditions = {}
    //caso não esteja logado, filtro para exibir apenas as noticias publicas
    if (!('user' in req.session)) {
        conditions = { category: 'public' }
    }

    const articles = await Article.find(conditions)
    res.render('articles/index', {
        articles
    })
})

module.exports = router