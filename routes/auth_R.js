const express = require('express');
const router = express.Router();

const {valuesToAdd,encrypPass,valuesToLogin} = require('../middelware/auth_MID.js');
const {register,login,createJwt} = require('../controller/auth_C.js');

router.post('/reg',valuesToAdd,encrypPass,register);
router.post('/login',valuesToLogin,login,createJwt);
router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // מחיקת ה-Cookie מהשרת
    res.status(200).json({message: "התנתקת בהצלחה"});
});

module.exports = router;