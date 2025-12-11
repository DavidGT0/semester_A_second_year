const express = require('express');
const router = express.Router();
const {getAllCategories,getCategoryById,addCategory,deleteCategory} = require('../controller/categories_C.js');
const {valuesToAdd} = require('../middelware/categories_MID')
const {isLoggedIn} = require('../middelware/auth_MID');

router.get('/',isLoggedIn,getAllCategories);
router.get('/:id',isLoggedIn,getCategoryById);
router.post('/reg',isLoggedIn,valuesToAdd,addCategory);
router.delete('/:id',isLoggedIn,deleteCategory);

module.exports = router;
