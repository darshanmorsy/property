const mongoose = require('mongoose');

const propertyschema = new mongoose.Schema({
  propertydetails: {
    type: Object,
  },
  images: {
    type: Array,
  },
  status:{
    type:Number,
    default:1
  }
},{
  timestamps:true,            
})
module.exports = mongoose.model('Property', propertyschema);
