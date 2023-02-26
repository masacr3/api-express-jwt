const express = require("express")
const cors = require("cors")

const jwt = require("jsonwebtoken")

const port = process.env.PORT || 3333
const secret = process.env.SECRET 
const invitado = process.env.USER //invitado
const passInvitado = process.env.USERPASS //1234

const admin = process.env.ADMINUSER // ahre
const passAdmin = process.env.ADMINPASS //doble ahre

const app = express()

app.use( cors())

app.use( express.json())

app.post("/token", (req, res) => {
    const user = req.body.email
    const {sub, name} = { sub : user !== admin ? "invitado" : admin, name : user !== admin ? invitado : admin}

    //Get user from DB
    const token = jwt.sign({
        sub,
        name,
        exp: Date.now() + 60 * 1000
    }, secret)

    res.send( {token, role:name})
    
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