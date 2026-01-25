const {getAll,add,getOne,remove,update} = require('../model/tasks_M.js');

async function getAllTasks(req,res) {
    try{
        let tasks = await getAll(req.user.id);
        res.status(200).json(tasks)
    }catch(err){
        console.error('Error in getAllTasks:', err);
        res.status(500).json({message:"Server error"})
    }
}

async function addTask(req,res) {
    try{
        console.log("Adding task - Body received:", req.body); // לוג 1: מה קיבלנו מהלקוח?
        console.log("Adding task - User:", req.user); // לוג 2: מי המשתמש?
        
        let text = req.body.text;
        let userId = req.user.id;
        let catId = req.body.catId || null;

        console.log(`Trying to add task: text='${text}', userId=${userId}, catId=${catId}`); // לוג 3: מה אנחנו שולחים ל-Model?

        let taskId = await add({text,userId,catId});

        console.log("Task added successfully with ID:", taskId); // לוג 4: הצלחה
        
        if(!taskId){
            return res.status(500).json({message:"Server error"});
        }
        res.status(201).json({message:"נוסף בהצלחה"});
    }catch(err){
        console.error('CRITICAL Error in addTask:', err); // לוג 5: השגיאה האמיתית!
        // נחזיר את הודעת השגיאה המקורית ללקוח כדי שתראה אותה ב-Alert
        res.status(500).json({message: "Server error: " + err.message});
    }
}

async function getTask(req,res) {
    try{
        let task = await getOne(req.id,req.user.id);
        if(!task){
            return res.status(400).json({message:`task is not found!`})
        }
        res.status(200).json(task);
    }catch(err){
        console.error('Error in getTask:', err);
        res.status(500).json({message:"Server error"})
    }
}

async function deleteTask(req,res) {
    try{
        let affectedRows = await remove(req.id,req.user.id);
        if(!affectedRows){
            return res.status(400).json({message:`task ${req.id} not found!`})
        }
        res.status(200).json({message:"deleted!"});
    }catch(err){
        console.error('Error in deleteTask:', err);
        res.status(500).json({message:"Server error"})
    }
}

async function editTask(req,res) {
    try{
        let taskId = req.id;
        let userId = req.user.id;
        let newTask = req.body.newTask; // ודא שאתה לוקח את זה נכון מה-body

        let affectedRows = await update(taskId,userId,newTask);
        if(!affectedRows){
            return res.status(400).json({message:`Task ${req.id} not found!`})
        }
        res.status(200).json({message:"updated!"});
    }catch(err){
        console.error('Error in editTask:', err);
        res.status(500).json({message:"Server error"})
    }
}

module.exports={
    getAllTasks,
    addTask,
    getTask,
    deleteTask,
    editTask,
}