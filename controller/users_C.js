const {getAllFromDB} = require('../model/users_M.js');
const {deleteUserFromDB} = require("../model/users_M.js");
const {getOneUserFromDB} = require("../model/users_M.js");

async function getAllUsers(req, res) {
    try {
        let users = await getAllFromDB();
        if(users.length == 0){
            res.status(400).json({message: "No users found."});
        }else {
            res.status(200).json({message: "ok", users});
        }
    }catch(err) {
        res.status(500).json({error: "Server error"});
    }
}

async function getUserById(req, res) {
   try{
       let user = await getOneUserFromDB(req.id);
       if(!user){
           return res.status(404).json({message: "No user with this ID."});
       }
       res.status(200).json(user);
   }catch (err){
       res.status(500).json({error: "Server error"});
   }
}

async function deleteUser(req, res) {
    try {
        const users = await deleteUserFromDB(req.params.id);
        res.status(200).json({message: "User deleted successfully."});
    }catch(err) {
        res.status(500).json({error: "Server error"});
    }
}

module.exports = {
    getAllUsers,getUserById,deleteUser
}