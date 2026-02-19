
const express = require ('express')
const app = express()
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken') //import modules
const saltRounds = 10


app.use (express.json())

//res to send data back to user, user is getting data from server, server is responding back to user
app.get('/', (req, res)=>{ 
    //return res.send('<h1>Hello World</h1>')
})

//req to get data from user, user is posting data to server, server is requesting data from user
app.post ('/signup', (req,res)=>{ 
    const username = req.body.username
    const password = req.body.password

    bcrypt.hash(password, saltRounds, function(err, hash){
        if (err) return res.sendStatus(500) //500 means internal server error
        //store in database 
        res.json ({username, hash})
    })
})

app.post ('/login', (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    const user = {name : username}

    //compare password to the hash from db
    
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json ({accessToken:accessToken}) //send back token to user for user to use later in endpoints
})

app.listen(8980, (error) => {
    if (error) return console.log (`Server failed to start ${error}`)
    console.log ("Server is listening")
})