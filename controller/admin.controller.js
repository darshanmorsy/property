const admin = require("../model/admins");
const manager = require('../model/manager')
const property = require('../model/property')
const city = require('../model/city')
const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path")
const nodemailer = require('nodemailer');
const fs = require('fs')
const linkpath = "http://192.168.0.102:2000/" 
 



// login admin post method

exports.login = async (req, res, next) => {
  try {
    const { number, password } = req.body;
    console.log(req.body);

    console.log(req.body);
    const emailData = await admin.findOne({ number })

    if (emailData == null) {

      res.status(404).json({ message: "number not found" });

    } else {

      if (password != emailData.password) {

        res.status(404).json({ message: "password not match" })

      } else {

        const token = await jwt.sign({ _id: emailData._id }, process.env.KEY);
        res.cookie("jwt", token, {

          expires: new Date(Date.now() + 5 * 1000 * 1000 * 1000),
          httpOnly: true

        })

        res.status(200).json({ token, message: "login successfully", token });

      }
    }

  } catch (error) {
    console.log("admin Loginadmin Error", error);
    res.status(500).json({
      message: "SOMETHING WENT WRONG",
      status: 500
    })
  }
}

// add manager post method

exports.addmanager = async (req, res) => {

  const { name, number, password, single, home, show } = req.body
  console.log(req.body);

  if (name == null || number == null || password == null || show == null || single == null || home == null) {

    return res.status(404).json({ message: 'some filed is empty' });

  }

  var unique = await manager.findOne({ number });

  if (unique == null) {

    var data = await manager.create({
      name,
      number,
      password,
      single,
      home,
      show,
    })

    if (data) {

      res.status(200).json({ message: "manager added successfully" });

    }
    else {

      res.status(400).json({ message: "manager not added" });

    }

  } else {

    res.status(400).json({ message: "manager already exist" });
  }
}

// all manager get method

exports.allmanagers = async (req, res) => {

  var data = await manager.find();
  if (data) {
    res.status(200).json(data);
  }
  else {
    res.status(400).json({ message: "manager not found" });
  }
}

// delete managers delete method 

exports.deletemanager = async (req, res) => {

  if (req.params.id == null || req.params.id == undefined) {
    res.status(400).json({ message: "manager id not found" });
  }
  var data = await manager.findByIdAndDelete(req.params.id);

  if (data) {
    res.status(200).json({ message: "data deleted successfully" });
  }
  else {
    res.status(400).json({ message: "data not deleted" });
  }
}

// addcity post method

exports.addcity = async (req, res) => {

  if (req.body.city) {

    var data = await city.create({ city: req.body.city })
    if (data) {
      res.status(200).json({ message: "city added successfully" });
    }
  } else {
    console.log(req.body);
    res.status(400).json({ message: "empty fields" });
  }
}

// show city get method

exports.allcity = async (req, res) => {

  var data = await city.find()
  if (data) {
    res.status(200).json(data);
  }
  else {
    res.status(400).json({ message: "city not found" })
  }

}

// delete city delete method

exports.deletecity = async (req, res) => {

  if (req.params.id) {
    var data = await city.findByIdAndDelete(req.params.id);
    if (data) {
      res.status(200).json(data);
    }
    else {
      res.status(400).json({ message: "city not found" })
    }
  }
  else {
    res.status(400).json({ message: "id not found" })
  }

}

// delete property delete method 

exports.deleteproperty = async (req, res) => {
  var data = await property.findOne({ _id: req.params.id });
  if (data) {

    for (var i = 0; i < data.images.length; i++) {
      const filePath = path.join(__dirname,'../images/',data.images[i].replace(linkpath, ''))
      if(fs.existsSync(filePath))
      fs.unlinkSync(path.join(filePath), () => {
        console.log("deleted successfully");
      })

    }

    var data = await property.findByIdAndDelete(req.params.id);
    if (data) {
      res.status(200).json({ message: "Property deleted successfully " });

      // console.log(data)
    } else {
      res.status(200).json({ message: "Property not found " });

    }
  }
}

// all property get method 

exports.allproperty = async (req, res) => {
  var data = await property.find();

  if (data) {
    res.status(200).json(data);
  }
  else {
    res.status(400).json({ message: "property not found" });
  }
}

// status wise property get method

exports.propertystatus = async(req,res)=>{

  if(req.params.status){
    req.params.status= Number(req.params.status)
    var data = await property.find({status:req.params.status});
    if(data){
      res.status(200).json(data)
    }
  }

}

// status update method put

exports.statusupdate = async(req,res)=>{

  console.log(req.params);
  // if(req.params.id && req.params.status){
    req.params.status= Number(req.params.status)
    var data = await property.findByIdAndUpdate(req.params.id,{status:req.params.status});
    if(data){
      res.status(200).json({message:"data updated successfully"});
    }
  }

// }