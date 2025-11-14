const express = require('express');
const router = express.Router();
const {getAllUsers} = require('../controller/users_C.js');
const {isValidId} = require('../middelware/users_MID.js');
const {getUserById} = require('../controller/users_C.js');

router.get('/', getAllUsers);

router.get('/:id',isValidId, getUserById);

module.exports = router;