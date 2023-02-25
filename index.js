const express = require("express")
const cors = require("cors")

const jwt = require("jsonwebtoken")

const port = process.env.PORT || 3333
const secret = process.env.SECRET 

const app = express()

app.use( cors())

app.post("/token", (req, res) => {
    //Get user from DB
    const { id: sub, name} = { id : "masacr3", name :"leo"} 
    const token = jwt.sign({
        sub,
        name,
        exp: Date.now() + 60 * 1000
    }, secret)

    res.send( {token })
})

app.get("/public", (req, res) =>{
    res.send("I m public")
})

app.get("/private", (req, res) =>{
    try {
        // Bearer ....
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)

        if(Date.now() > payload.exp){
            return res.status(401).send({error: "token expired"})
        }

        res.send({messaje : "i m private"})
    } catch (error) {
        res.status(401).send({ error: error.message})
    }
})

app.listen(port, () =>{
    console.log("secreto ", process.env.SECRET)
    console.log("Server actived")
})