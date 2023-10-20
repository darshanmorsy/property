const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    number: {
        type: String
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('admins', adminSchema);