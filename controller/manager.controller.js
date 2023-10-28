const admin = require("../model/admins");
const manager = require("../model/manager");
const property = require('../model/property')
const express = require("express");
const jwt = require("jsonwebtoken");
const path = require("path")
const nodemailer = require('nodemailer');
const { log } = require("console");
var fs = require("fs");
const { deepStrictEqual } = require("assert");
const { fstat } = require("fs");
// const linkpath = "http://154.41.254.204:2000/"
const linkpath = "http://192.168.0.110:2000/"


exports.login = async (req, res, next) => {
  try {
    const { number, password } = req.body
    log
    const emailData = await manager.findOne({ number })

    if (emailData == null) {

      res.status(404).json({ message: "number not found" })

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

exports.addproperty = async (req, res) => {
  try {

    console.log("oo", req.files)

    function stringToJson(string) {
      try {
        const jsonData = JSON.parse(string);
        return jsonData;
      } catch (error) {
        console.log(`Error: ${error}`);
        return null;
      }
    }

    var ss = stringToJson(req.body.data)

    function convertDataToLowerCase(data) {
      return JSON.parse(JSON.stringify(data).toLowerCase());
    }
    var ds = convertDataToLowerCase(ss)


    const files2 = req.files;
    const files = [];
    for (const file of files2) {

      const filepath = linkpath + file.filename;
      files.push(filepath);

    }

    var data = await property.find()
    if (data.length == 0) {
      var ids = 1
    } else {
      data = data.slice(-1)
      console.log(data);
      ids = data[0].ids + 1
    }
    console.log(ids);
    const newProperty = await property.create(
      {
        propertydetails: {
          data: ds
        },
        images: files,
        ids
      })

    res.status(201).json({
      message: 'Property added successfully',
      data: newProperty,
    });

  } catch (error) {
    console.error('Error adding property:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.property = async (req, res) => {

  var data = await property.find();
  console.log(data.length);
  return res.status(200).json(data)

}

exports.singleproperty = async (req, res) => {

  var data = await property.findById(req.params.id)
  if (data) {
    res.status(200).json(data)
  } else {
    res.status(404).json({ message: "property not found" })
  }

}

exports.updateproperty = async (req, res) => {

  try {
    console.log(req.params);
    console.log(req.body);
    function stringToJson(string) {
      try {
        const jsonData = JSON.parse(string);
        return jsonData;
      } catch (error) {
        console.log(`Error: ${error}`);
        return null;
      }
    }

    var ss = stringToJson(req.body.data)
    if (req.params.id) {
      
      if (req.files.length == 0) {
        var ss = ss.propertydetails.data
        var dataupdate = await property.findByIdAndUpdate(req.params.id, {
          propertydetails: {
            data: ss
          }
        })
        if (dataupdate) {
          res.status(200).json({ message: "property updated successfully" })
        } else {
          res.status(404).json({ message: "property not found" })
        }
      } else {

        var data = await property.findById(req.params.id);
        if (data) {
          // res.status(200).json(data.images)
          for (var i = 0; i < data.images.length; i++) {
            var arraypathdata = data.images[i]
            var paths = arraypathdata.replace(linkpath, "")
            console.log(paths, "5");
            if (fs.existsSync(path.join(__dirname, '../images/', paths))) {
              fs.unlinkSync(path.join(__dirname, '../images/', paths))
            }
          }

          const files2 = req.files;
          const files = [];
          for (const file of files2) {

            const filepath = linkpath + file.filename;
            files.push(filepath);

          }
          console.log(ss);
          var ss = ss.propertydetails.data

          console.log(ss,files);
          var dataupdate = await property.findByIdAndUpdate(req.params.id, {
            propertydetails: {
              data: ss
            },
            images: files,
          })
          if (dataupdate) {
            res.status(200).json({ message: "property updated successfully" })
          } else {
            res.status(404).json({ message: "property not found" })
          }

        } else {
          res.json({ message: "property not found" })
        }

      }
    } else { 
      res.json({ message: "property id not found" })
    }
  } catch (err) {
    if (err) {
      console.log(err)
    }
  }
}

exports.profile = async (req, res) => {

  console.log(req.user, "profile")
  res.json(req.user)

}

exports.filter = async (req, res) => {
  
  function convertDataToLowerCase(data) {
    return JSON.parse(JSON.stringify(data).toLowerCase());
  }

  var data = await property.find()
  data = convertDataToLowerCase(data)

  function findTotalPrice(obj) {
    let totalPrice = null;
    if (Array.isArray(obj)) {
      for (const item of obj) {
        totalPrice = findTotalPrice(item);
        if (totalPrice !== null) {
          break;
        }
      }
    } else if (obj !== null && typeof obj === 'object') {
      for (const key in obj) {
        if (key === 'totalprice' && !isNaN(parseFloat(obj[key]))) {
          return parseFloat(obj[key]);
        } else {
          totalPrice = findTotalPrice(obj[key]);
          if (totalPrice !== null) {
            break; // Break if the totalPrice is found
          }
        }
      }
    } return totalPrice;
  } const maxPrice = req.body.price;
  const filterData = data.filter(item => {
    const totalPrice = findTotalPrice(item.propertydetails.data);
    return totalPrice !== null && totalPrice <= maxPrice;
  });
  console.log(filterData.length, "price")
  // res.status(200).json(filteredData)
  var searchTerms = convertDataToLowerCase(req.body.filters)
  let filteredData = convertDataToLowerCase(filterData);
  // console.log(searchTerms, 'filteredData', filteredData);
  for (const term of searchTerms) {
    filteredData = deepSearchObjects(filteredData, [term]);
  }
  console.log(filteredData.length, "pp");
  res.json(filteredData)
  // console.log(filteredData); 
  function deepSearchObjects(objects, searchTerms) {
    return objects.filter(obj => {
      const containsSearchTerm = searchInObject(obj, searchTerms, 0);
      return containsSearchTerm;
    })
  }
  function searchInObject(obj, searchTerms, depth) {
    if (depth > 10) {
      return false;
    }
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        if (searchInObject(obj[key], searchTerms, depth + 1)) {
          return true;
        }
      } else if (typeof obj[key] === 'string') {
        if (searchTerms.some(term => obj[key].includes(term))) {
          return true;
        }
      } 
    }
    return false;
  }
}

exports.pricefilter = async (req, res) => {

  var main = (b) => {
    return b.filter(item => {
      const totalPrice = findTotalPrice(item.propertydetails.data);
      return totalPrice !== null && totalPrice <= req.body.price;
    })
  }
}
