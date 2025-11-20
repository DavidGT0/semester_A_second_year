const db = require('../config/db_config');

async function getAllFromDB(){
    let sql = `SELECT id,name,email FROM users`;
    console.log(sql);
    let [rows] = await db.query(sql);
    console.log(rows);

    return rows;
}

async function getOneUserFromDB(id) {
    let sql = `SELECT id, name, email FROM users WHERE id = ?`;
    let [result] = await db.query(sql, [id]);
    return result;
}

async function deleteUserFromDB(id) {
    let sql = `DELETE FROM users WHERE id = ?`;
    let [result] = await db.query(sql, [id]);
    return result;
}

module.exports = {
    getAllFromDB,getOneUserFromDB,deleteUserFromDB
}