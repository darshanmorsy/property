const mongoose = require('mongoose')
const managerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    number: {
        type: String
    },
    password: {
        type: String
    },
    home:{
        type:Boolean, 
        default:false
    },
    show:{
        type:Boolean,
        default:false
    },
    single:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('manager', managerSchema)