const db = require('../config/db_config');

async function getAll(userId){
    let sql = `SELECT * FROM tasks WHERE user_id = ?`;
    let [rows] = await db.query(sql,[userId]);    
    return rows;
}

module.exports ={
    getAll,

}