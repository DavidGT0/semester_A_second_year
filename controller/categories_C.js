const {getAll, getById, add, remove} = require('../model/categories_M.js');


async function getAllCategories(req,res) {
    try{
        let categories = await getAll();
        if(categories.length == 0){
            return res.status(400).json({message:"אין נתונים"})
        }
        res.status(200).json(categories)
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
}
async function getCategoryById(req,res){
    try{
        let id = req.params.id;
        let category = await getById(id);

        if (!category){
            return res.status(200).json(category);
        }
    }catch (err){
        res.status(500).json({message:"Server error"})
    }
}
async function addCategory(req,res){
    try{
        let name = req.body.name;
        let userId = req.body.id;
        let categoryId = await add({name,userId});
        if(!categoryId){
            return res.status(500).json({message:"server error"});
        }
        res.status(201).json({message: "category added"});
    }catch(err){
        res.status(500).json({message:"server error"})
    }
}
async function deleteCategory(req,res) {
    try{
        let id = req.params.id;
        let affectedRows = await remove(id);
        if(!affectedRows){
            return res.status(400).json({message:"category not found"})
        }
        res.status(200).json({message:"deleted!"});
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
}

module.exports={
    getAllCategories,
    getCategoryById,
    addCategory,
    deleteCategory,
}