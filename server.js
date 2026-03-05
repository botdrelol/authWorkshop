require ('dotenv').config()

const express = require ('express')
const app = express()
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken') //import modules
const saltRounds = 10
const testHash = "$2b$10$VqqJYKM8WLLFDGKMDrrkzO9aR0GKQ4gadBX3hJYUC1gMET1nK3JN6"

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
    async function comparePassword (user, password){
        const match = bcrypt.compare(password, testHash)
        if (match){
            const accessToken = generateAccessToken(user)
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) //async = wait for part of function to complete
            return res.json({accessToken: accessToken , refreshToken: refreshToken})
            }
        return res.sendStatus(403)
    }
    return comparePassword(user,password)
})

app.post ('/token', (req,res)=>{
    const refreshToken = req.body.token

    if (refreshToken === null) return res.sendStatus(401)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,user) => {
        if (err) return res.status(403).send("Failed to verify")
        const accessToken = generateAccessToken({name : user.name})
        res.json({accessToken : accessToken})
    })
})
app.listen(8980, (error) => {
    if (error) return console.log (`Server failed to start ${error}`)
    console.log ("Server is listening")
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'5m'})
}