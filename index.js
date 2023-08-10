const express = require('express');
const app = express();

const port = 3000;

// rewrite for sendFile
function Logger(req, res, next){
    const method = req.method;
    const path = req.path;
    const ip = req.ip;

    const time = Date.now()
    const date = new Date(time).toLocaleDateString('en-US');

    const string = `${date} - ${method} ~ ${path} ~ ${ip}\x1b[0m`;

    const originalSend = res.send;

    res.send = function(data){
        const statusCode = res.statusCode;
        if (statusCode < 300){
            console.log(`\x1b[32m${statusCode}: ${string}`)
        } else if( statusCode < 400){
            console.log(`\x1b[34m${statusCode}: ${string}`)
        } else{
            console.log(`\x1b[31m${statusCode}: ${string}`)
        }
        originalSend.call(this, data)
    }

    next()
}

app.use(Logger);

app.get('/', (req, res)=>{
    res.status(400).send("Hello");
})

app.get('/test', (req, res)=>{
    res.send("Tester")
})

const ipAddr = '192.168.1.62';
app.listen(port, host='0.0.0.0', ()=>{console.log(`http://127.0.0.1:${port}`)});