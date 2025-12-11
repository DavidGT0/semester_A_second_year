const express = require('express');
const db = require('./config/db_config');
const cookies = require('cookie-parser');
const port = process.env.PORT;
const api = process.env.HOST;
const app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.use(cookies());

app.get('/',(req,res)=>{res.sendFile(__dirname+'/public/index.html')})
app.use('/users',require('./routes/users_R'));
app.use('/auth',require('./routes/auth_R'));
app.use('/categories',require('./routes/categories_R'));

app.listen(port,()=>{console.log(`http://${api}:${port}`)})