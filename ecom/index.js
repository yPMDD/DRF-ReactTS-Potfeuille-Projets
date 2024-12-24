const express = require('express');
const ejs =  require('ejs');
const bodyparser = require('body-parser');
const mysql = require('mysql2');

const app = express();

app.use(express.static('public'));
app.set('vien engine','ejs');

app.listen(8080);
//localhost:8080
app.get('/',function(res,req){
    res.render('pages/index');
});