const express = require('express');
const session=require('express-session')
const querystring = require('querystring'); 
const app = express();
let engine = require('ejs-locals');

app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');


let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true
}))



var mysql = require("mysql2");
var conn = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database:'users'
});


app.get('/', function(req, res){
    res.render('index');
});

app.get('/error', function(req, res){
    res.render('error');
});

app.get('/member', function(req, res){
    if(req.session.myname == "")
    {
        res.render("member");
    }
    else
    {
        res.render('member',{name:req.session.myname})
    }
   
});


app.post('/signup', function(req, res){
    let useraccount =req.body.useraccount;
    let userpassword = req.body.userpassword;
    let username = req.body.username;
    let sql = "insert into tb_user(user_id,password,name) values (?,?,?)";
    let val = [useraccount,userpassword,username];
    conn.query(sql,val, function(err, results, fields)
    {
       if (err) throw err;
       if(results.affectedRows == 1)
       {
         res.redirect('/');
       }
    }); 
 
});

app.post('/signin', function(req, res){
    let useraccount =req.body.useraccount;
    let userpassword = req.body.userpassword;
    let sql = "select * from tb_user where user_id = ? and password = ? ";
    let val = [useraccount,userpassword];
    conn.query(sql,val, function(err, results, fields)
    {
       if (err) throw err;
       if(results != null)
       {
         req.session.myname=results[0].name;
         res.redirect('/member');
       }
    }); 
 
});

app.get('/signout', function(req, res){
    delete req.session.myname;
    req.session.myname = "未登入";
    res.redirect('/');
});


app.get('/api/users', function(req, res){
    var userid = req.query.username;; 
    let sql = "select * from tb_user where user_id = ? ";
    let val = [userid];
    var user_name="";
    conn.query(sql,val, function(err, results, fields)
    {
       if (err) throw err;
       if(results != null)
       {
          user_name = results[0].name;   
          user_ID= results[0].user_id;   
       }
            console.log(user_name)
            var response = {
                status  : 200,
                name : user_name,
                ID : user_ID
            }
            
            res.end(JSON.stringify(response));


    }); 
    console.log("@@",user_name)
    console.log("~~~~~~~~~~~~~~")
});



app.listen(3000, function(){
  console.log('Example app listening at http://localhost:3000')
});