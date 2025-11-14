const {getAll} = require('../model/users_M.js');
const {getUserByIdFromDB} = require("../model/users_M");

async function getAllUsers(req, res) {
    try {
        let users = await getAll();
        if(users.length == 0){
            return res.status(400).json({message: "No users found."});
        }
        res.status(200).json(users);
    }catch(err) {
        res.status(500).json({error: "Server error"});
    }
}

async function getUserById(req, res) {
   try{
       let user = await getOneUser(req.id);
       if(!user){
           return res.status(404).json({message: "No user with this ID."});
       }
       res.status(200).json(user);
   }catch (err){
       res.status(500).json({error: "Server error"});
   }
}

module.exports = {
    getAllUsers,getUserById
}