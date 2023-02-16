const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors")
const env = require("dotenv")
const sql = require("mssql");
const conn = require("./config");
const { databases } = require("./config");
const bee = require("bcrypt");

const Port = process.env.port || 3000;

env.config({

    path : "./config.env"

});

app.use(cors());
app.use(bodyParser.json({limit: "100mb"}));
app.all("*", function(res, req, next){

    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","GET, POST, DELETE, PUT")
    res.header("Access-Control-Allow-Headers","Content-Type")
    next();
});

let queriesSQL;

async function sql_run(res, req,queriesSQL) {
    
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error",err => {
        
        console.log(err);
    
    })
    try{
        await pool.connect();
        let result = await pool.request().query(queriesSQL);
        return {
            "success": result
        }
    }catch(err){
        console.log(err);

    }finally{

        pool.close();
    }
}
te
app.post('/sqlInsert',function(req,res){
        
    let cred = req.body;
    queriesSQL = `insert into users(username, pass, email) values('Pepe','Pepe123','Pepe@outlook.com')`;
    sql_run(req,res,queriesSQL);
    res.send("Inserted user successfully");
          
});

app.get('/sqlSelectUsers',function(req,res){

    let cred = req.body;
    queriesSQL = `select * from ${cred.table}`
    sql_run(req,res);
    res.send("Selected Successfully");

});

app.delete('/sqlDeleteUsers',function(req,res){

    let cred = req.body;
    queriesSQL = `delete from ${cred.table} where id = ${cred.id}`;
    sql_run(req,res);
    res.send("Deleted successfully");

});

app.put('/sqlUpdateUsers',function(req,res){

    res.send('Updated successfully');
});



//CAR TABLE
app.post('/sqlInsertCar',function(req,res){
        
    let cred = req.body;
    queriesSQL = `insert into cars(brand, model, miles, id_user) values('${cred.brand}','${cred.model}','${cred.miles}',${cred.id_user})`;
    sql_run(req,res);
    res.send("Inserted user successfully");
          
});

app.get('/sqlSelectCar',function(req,res){

    let cred = req.body;
    queriesSQL = `select brand, model, miles from ${cred.table}`
    sql_run(req,res);
    res.send("Selected Successfully");

});

app.delete('/sqlDeleteCar',function(req,res){

    let cred = req.body;
    queriesSQL = `delete from ${cred.table} where id = ${cred.id}`;
    sql_run(req,res);
    res.send("Deleted successfully");

});

app.put('/sqlUpdateCar',function(req,res){

    let cred = req.body;
    queriesSQL = `update ${cred.table} set model = ${cred.model} where brand = ${cred.brand}}`
    sql_run(req,res);
    res.send('Updated successfully');
});

app.post('/register',function(req,res){
    
    let cred = req.body;
    bee.hash(cred.pass, 10, async(function(err,hash){
        queriesSQL = `insert into users(username, pass, email) values('${cred.username}','${hash}','${cred.email}')`;
        sql_run(req, res, queriesSQL);
    }))

});  

app.post('/login',function(req,res){

    let cred = req.body;
    queriesSQL =  `select * from users where username = '${cred.username}' and password = '${cred.password}'`
    sql_run(req, res, queriesSQL);
});


const array = [
    {
        Name : "Salvador",
        LastName : "Perez",
        Number : "6142805627"
    },
    {
        Name : "Christian",
        LastName : "Lopez",
        Number : "6141234567"
    },
    {
        Name : "Karen",
        LastName : "Rodriguez",
        Number : "6145898765"
    }
]

app.get('/getuser', function(req, res){


    res.json(array)        

});

app.post('/newuser', function(req, res){

    let user = req.body;
    array.push(user);
    res.send(array);
});

app.get('/deleteuser', function(req, res){

    let user = req.body;
    array.splice(array.indexOf(user), 1);
    res.send(array)

});

app.put('/updateuser', function(req, res){
    
    let user = req.body;
    array.splice(array.indexOf(user), 1, user);
    res.send(array)
    
});

app.listen(Port, () => {
    console.log(`App is running in port: ${Port}`)
});