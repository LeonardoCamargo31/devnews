const express = require('express')
const router  = express.Router()
const Article = require('../models/article')

router.get('/',async(req,res)=>{
    //const articles = await Article.findAll()
    res.send('noticias publicas')
})

module.exports = router