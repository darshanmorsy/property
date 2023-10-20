const express = require('express')
const path = require('path')
const port = 2000;
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')

app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
const morgan = require('morgan')

app.use(morgan('dev'));
const bodyParser = require("body-parser")
app.use(bodyParser.json({
    limit: "100mb"
}))

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}))

app.use(express.urlencoded({ extends: true }))
app.use(express.static(path.join(__dirname, 'images')))
app.use(flash())
app.use(cookieParser())

require('dotenv').config()
require('./config/dataBase')

app.use(session({
    saveUninitialized: true,
    secret: 'secret',
    resave: false
}))
app.use('/admin', require('./routes/admin.router'))
app.use('/manager', require('./routes/manager.router'))

const { MongoClient } = require('mongodb')
const { kStringMaxLength } = require('buffer')


// app.get('/delete', async (req, res) => {
//   try {
//     const client = new MongoClient('mongodb://127.0.0.1', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     await client.connect()

//     const db = client.db('morsyproperty')
//     const collection = db.collection('properties')

//     // Delete the collection of properties
// await collection.deleteMany({}) 

//     // Close the database connection
//     client.close()

//     res.json({ message: 'Collection of properties deleted successfully' })
//   } catch (error) {
//     console.error('Error deleting properties:', error)
//     res.status(500).json({ error: 'Internal server error' })
//   }
// })


app.use((req, res) => {

    res.json({ message: "404" })

})

app.listen(port, (error) => {
    if (error) {
        console.log(error)
    }
    console.log("Server Is Running " + port)
})