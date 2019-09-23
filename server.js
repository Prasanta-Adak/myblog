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

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/addblog',(req,res)=>{
    res.render('addblog')
})

app.get('/index',(req,res)=>{
    if( req.cookies.cookieUsername)
    {
        var cookieUsername = req.cookies.cookieUsername
    var login_getData='select * from signup where USERNAME=?'
    connection.query(login_getData,  [ cookieUsername ], (error,result)=>{
        if(error) throw error 
                var userData={
                    fname: result[0].FNAME,
                    lname: result[0].LNAME ,
                    gender: result[0].GENDER,
                    username:result[0].USERNAME,
                    password: result[0].PASSWORD,
                    photoname: result[0].PROFILEPIC}
                res.render('index' ,{userData})
        })
    }
})

// store data in database

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
    res.redirect('/login')
})

// login coding

app.post('/login_success',(req,res)=>{
    var username=req.body.username;
    var password=req.body.password;

    var login_getData='select * from signup where USERNAME=? and PASSWORD=?'
    connection.query(login_getData, [username, password], (error,result)=>{
        if(error) throw error 
        else if(result.length>0){
            if(result[0].PASSWORD == password)
            {
                res.cookie('cookieUsername',username,{maxAge: 99000000, httpOnly: true})
                var userData={
                    fname: result[0].FNAME,
                    lname: result[0].LNAME ,
                    gender: result[0].GENDER,
                    username:result[0].USERNAME,
                    password: result[0].PASSWORD,
                    photoname: result[0].PROFILEPIC,
                    blogTitle: result[0].TITLE,
                    blog: result[0].BLOG
                }
                res.render('index' ,{userData})
            }
        }
    })
})

app.post('/add_success',(req,res)=>{
var blogtitle=req.body.blogtitle;
var blog=req.body.blog;
console.log(blogtitle+" "+blog)
if(req.cookies.cookieUsername){
    var email = req.cookies.cookieUsername
    console.log(email)
    var put_blog = 'update signup set TITLE=?, BLOG=? where USERNAME = ?'
    connection.query(put_blog, [ blogtitle, blog, email ], (error, result)=>{
        if( error) throw error
    })
    res.redirect('/index')
}
})

app.post('/upload_photo', (req, res)=>{

    if( req.cookies.cookieUsername)
    {
        var cookieUsername = req.cookies.cookieUsername
        var form = new formidable.IncomingForm()
        form.parse( req, (error, fields, files)=>{
            var photoname = files.profilePic.name
            var oldPath = files.profilePic.path
            console.log(photoname)
            var newPath = 'C:/Users/Prasanta-pc/Desktop/firstProject/public/profilePic/' + photoname
            var upload_photo = 'update signup set PROFILEPIC = ? where USERNAME = ?'
            connection.query(upload_photo, [photoname, cookieUsername], (error, result)=>{
                if(error) throw error
                fs.rename(oldPath, newPath, (error)=>{
                    if(error) throw error
                })
            })
        })
        res.redirect('/index')
    }
})

