const express = require('express')
const router = express.Router()
const admin_token = require('../middleware/admin.middleware')
var property= require('../model/property')

const {
    login,
    addmanager,
    allmanagers,
    deletemanager,
    addcity,
    allcity,
    deletecity,
    deleteproperty,
    allproperty,
    propertystatus,
    statusupdate
} = require('../controller/admin.controller')

router.post('/login',login)
router.post('/addmanager',admin_token,addmanager)
router.get('/allmanagers',admin_token,allmanagers)
router.delete('/deletemanager/:id',admin_token,deletemanager)
router.post('/addcity',admin_token,addcity)
router.get('/allcity',admin_token,allcity)
router.delete('/deletecity/:id',admin_token,deletecity) 
router.delete('/deleteproperty/:id',admin_token,deleteproperty)
router.get('/allproperty',admin_token,allproperty)
router.get('/propertystatus/:status',admin_token,propertystatus)
router.put('/statusupdate/:status/:id',admin_token,statusupdate)


router.get('/logout',admin_token,(req,res)=>{           
    res.cookie("jwt","")
    res.clearCookie()
    res.status(200).json({message:'logout successfully'})
})
  
module.exports = router  