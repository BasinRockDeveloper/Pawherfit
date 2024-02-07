const express = require('express')
const app = express()
const db = require('./connectDB.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const UserRoute = require('./api/routes/userRoute.js')
const io = require('./server.js')
db()    

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json()) 

//Routes
app.use('/user',UserRoute)
// app.use('/uploads', express.static('uploads'));

// Api Request
app.use((req,res,next)=>{
    res.status(200).json({
        message : 'Api Is Running.'
    })
})

module.exports = app