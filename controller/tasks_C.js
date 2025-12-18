const {getAll} = require('../model/tasks_M.js');

async function getAllTasks(req,res) {
    try{
        let tasks = await getAll(req.user.id);
        if(tasks.length == 0){
            return res.status(400).json({message:"אין נתונים"})
        }
        res.status(200).json(tasks)
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
}


module.exports={
    getAllTasks,
}