const jwt = require('jsonwebtoken')
const manager = require('../model/manager')

const manager_token=async(req,res,next)=>{

    var token = req.headers.authorization
    console.log(req.headers);
    if(token)
    {
         console.log("token generated");
         var managerdata = await jwt.verify(token,process.env.KEY,(err,data)=>{
            if(err)
            {
                console.log(err);
                res.json({message:"server error"})
            }
            return data;
         })
         if(managerdata==undefined)
         { 
            res.json({message:"manager unauthorized"})
        }
        else
        {
            const datas = await manager.findOne({_id:managerdata._id})
            if(datas==null)
            {
                res.json({message:"manager not found"})
            }
            else
            {
                req.user=datas
                next();
            }
         }
    }
    else
    {
        res.json({message:"manager token not found"})
    }
}

module.exports = manager_token