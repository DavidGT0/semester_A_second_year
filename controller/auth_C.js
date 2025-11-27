const { addUserToDB } = require('../model/auth_M.js');

async function addUser(req,res) {
    try{
        const user = await addUserToDB(req.body);
        res.status(200).json({message: "user added", user});
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
}

module.exports ={
    addUser
};