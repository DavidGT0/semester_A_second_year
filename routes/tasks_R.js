const express = require('express');
const router = express.Router();
const {getAllTasks} = require('../controller/tasks_C');
const {isLoggedIn} = require('../middelware/auth_MID');


router.get('/',isLoggedIn,getAllTasks);


module.exports = router;