const db = require('../config/db_config');

async function getAll() {
    let sql = `SELECT * FROM categoris`;
    let [rows] = await db.query(sql);
    return rows;
}

async function getById(id) {
    let sql = `SELECT * FROM categoris WHERE id = ?`;
    let [rows] = await db.query(sql, [id]);
    return rows[0];
}

async function add({name, userId}) {
    let sql = `INSERT INTO categoris (name, user_id) VALUES (?, ?)`;
    let [result] = await db.query(sql, [name, userId]);
    return result.insertId;
}

async function remove(id) {
    let sql = `DELETE FROM categoris WHERE id = ?`;
    let [result] = await db.query(sql, [id]);
    return result.affectedRows;
}

module.exports = {
    getAll,
    getById,
    add,
    remove
}