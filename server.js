const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Registeruser = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const cors = require("cors")


// Middleware to parse JSON data
app.use(express.json());


mongoose.connect("mongodb+srv://vivekpavankalyan:RSzxYRnwdySL0TU3@cluster0.w3bq9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Db connection established"))
    .catch(err => console.error("Database connection error:", err));


app.use(cors({origin:"*"}))    


app.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmpassword } = req.body;

        let exist = await Registeruser.findOne({ email });

        if (exist) {
            return res.status(400).send('User Already Exists');
        }

        if (password !== confirmpassword) {
            return res.status(400).send('Passwords are not matching');
        }

        let newUser = new Registeruser({
            username,
            email,
            password,
            confirmpassword
        });

        await newUser.save();
        res.status(200).send('Registered Successfully');

    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});



app.post('/login',async (req, res) => {
    try{
        const {email,password} = req.body;
        let exist = await Registeruser.findOne({email});
        if(!exist) {
            return res.status(400).send('User Not Found');
        }
        if(exist.password !== password) {
            return res.status(400).send('Invalid credentials');
        }
        let payload = {
            user:{
                id : exist.id
            }
        }
        jwt.sign(payload,'jwtSecret',{expiresIn:3600000},
          (err,token) =>{
              if (err) throw err;
              return res.json({token})
          }  
            )

    }
    catch(err){
        console.log(err);
        return res.status(500).send('Server Error')
    }
})




app.listen(4000, () => {
    console.log("Server running at http://localhost:4000");
});


