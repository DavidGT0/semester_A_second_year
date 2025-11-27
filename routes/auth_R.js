const express = require('express');
const router = express.Router();

const {valuesToAdd,encrypPass} = require('../middelware/auth_MID.js');
const {addUser} = require('../controller/auth_C.js');

router.post('/reg',valuesToAdd,encrypPass,addUser);

module.exports = router;