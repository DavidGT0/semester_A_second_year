const db = require('../config/db_config');

async function addUserToDB({name, email, userName, pass}){
    const sql = 'INSERT INTO users (name, email, userName ,pass) VALUES (?,?,?,?)';
    const [result] = await db.query(sql, [name, email, userName, pass]);
    return { id: result.insertId, name, email, userName };
}
module.exports = {
    addUserToDB
};