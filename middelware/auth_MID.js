const bcrypt = require('bcrypt');
const { getUserById } = require('../model/auth_M');

function valuesToAdd(req,res,next){
    let {name,email,userName,pass} = req.body;
    if(!name || !email || !userName || !pass){
        return res.status(400).json({message:"חסרים נתונים"});
    }
    next();
}

async function encrypPass(req,res,next){
    try{
        let pass = req.body.pass;
        let hashPass = await bcrypt.hash(pass,10);
        req.body.pass = hashPass;

        next();
    }catch(err){
        res.status(500).json({message: "error"})
    }
}

module.exports = {
    valuesToAdd,
    encrypPass
};