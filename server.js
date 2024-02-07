const http = require('http')
const app = require('./index.js')
const server = http.createServer(app)

server.listen (3000, ()=>{
    console.log("server is running");
})