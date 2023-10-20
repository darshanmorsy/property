const jwt = require('jsonwebtoken')
const admins = require('../model/admins')

const admin_token = async (req, res, next) => {

    var token = req.headers.authorization

    if (token) {
        var userdata = await jwt.verify(token, process.env.KEY, (err, data) => {
           
            if (err) {
                console.log(err)
            }
           
            return data
        })

        // console.log(userdata)

        if (userdata == undefined) {
            res.status(400).json({ message: "unauthorized token" })
        }
        else{
            console.log(userdata);
            const datas = await admins.findOne({ _id: userdata._id })

            if (datas == null) {
                res.status(400).json({ message: "no admin found" })
            }

            else {
                next();
            }
        }
    }

    else {
        res.status(400).json({ message: "token not found" })
    }
}

module.exports = admin_token

