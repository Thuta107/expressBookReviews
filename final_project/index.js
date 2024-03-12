const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const JWT_SECRET = 'jwtSecretKey'

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    let token = req.header('Authorization');
    if(!token) return req.statusCode(401).send('No Token')
    if(token.startsWith('Bearer')) {
        token = token.slice(7, token.length).trimStart();
    }
    const verificationStatus = jwt.verify(token, JWT_SECRET)
    if(verificationStatus.username == req.username) {
        next()
    }
    return res
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
