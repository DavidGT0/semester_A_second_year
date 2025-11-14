const db = require('../config/db_config');

async function getAll(){
    let sql = `SELECT id,name,email FROM users`;
    console.log(sql);
    let [rows] = await db.query(sql);
    console.log(rows);

    return rows;
}

async function getOneUser(id) {
    let sql = `SELECT id, name, email FROM users WHERE id = ?`;
    let [result] = await db.query(sql, [id]);
    return result;
}

module.exports = {
    getAll,getOneUser
}