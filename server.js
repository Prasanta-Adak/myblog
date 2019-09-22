var express=require('express')

var bodyParser=require('body-parser')
var mysql = require('mysql')
var cookieParser=require('cookie-parser')
var formidable = require('formidable')
var fs = require('fs')
var app=express()
app.use(express.static('./public'))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.listen(3050,function(req,res){
    console.log("server is started...")
})

var connection =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database : 'myblog'
})
app.get('/',(req,res)=>{
    res.render('signup')
})
app.get('/index',(req,res)=>{
    res.render('index')
})
app.post('/register_successful',(req,res)=>{
    var fname=req.body.fname;
    var lname=req.body.lname;
    var gender=req.body.gender;
    var username=req.body.username;
    var password=req.body.password;
    console.log(fname+" "+lname+" "+gender+" "+username+" "+password)

    var signup_putData='insert into signup(FNAME, LNAME, GENDER, USERNAME, PASSWORD) values(?,?,?,?,?)'
    connection.query(signup_putData,[fname, lname, gender, username, password],(error,result)=>{
if(error) throw error
    })
    res.redirect('/index')
})