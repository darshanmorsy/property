const mongoose = require('mongoose')
const citySchema = new mongoose.Schema({
    city: {
        type: String
    }
})
module.exports = mongoose.model('city',citySchema)