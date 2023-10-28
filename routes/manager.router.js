const express = require('express')

const router = express.Router()

const upload = require('../helper/multer')

const manager_token = require('../middleware/manager.middleware')

const {
    login,
    addproperty,
    property,
    singleproperty,
    profile,
    filter,
    pricefilter,
    updateproperty
} = require('../controller/manager.controller')

router.post('/login',login)
router.post('/addproperty',upload.array('image'),addproperty)
router.get('/property',manager_token,property)
router.get('/properties/:id',manager_token,singleproperty)
router.get('/profile',manager_token,profile)
router.post('/filter',filter) 
router.post('/price',manager_token,pricefilter)
router.put('/updateproperty/:id',manager_token,upload.array('image'),updateproperty)

router.get('/logout',manager_token,(req,res)=>{           

    res.cookie("jwt","")
    res.clearCookie()
    res.status(200).json({message:"logout successfully"}) 

})
module.exports = router 