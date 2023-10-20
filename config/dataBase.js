const { log } = require('console');
const mongoose = require('mongoose')
const db = mongoose.connection

mongoose.connect('mongodb+srv://morsypropertydealer:propertymorsy@cluster0.p6ub5kn.mongodb.net/morsyproperty')
// mongoose.connect('mongodb://127.0.0.1/morsyproperty')

db.once('open',(err)=>{
    if(err)
    {
        console.log('DataBase Not Connected: '+err)
    }
    console.log("DataBase MongoDb Connected")
})   