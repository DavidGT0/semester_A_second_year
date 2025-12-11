function valuesToAdd(req,res,next){
    let {name} = req.body.name;
    if(!name){
        return res.status(400).json({message:"חסרים נתונים"});
    }
    next();
}

module.exports =
    {
    valuesToAdd,
}