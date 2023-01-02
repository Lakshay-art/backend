const express=require("express");
const router=express.Router();
const {body,validationResult}=require("express-validator");
const User=require("../models/User");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
//const authenticate =require("../middlewares/authenticate");
//const { response } = require("express");
//const {config} = require('../config')
//router.post("/refresh")

router.post("/refresh", (req, res) => {
  //take the refresh token from the user
   
   const refreshToken = req.body.token;
 //console.log(refreshToken);
  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  // if (!refreshTokens.includes(refreshToken)) {
  //   return res.status(403).json("Refresh token is not valid!");
  // }
  jwt.verify(refreshToken, 'myrefreshsecretkey', (err, user) => {
   // console.log(user);
    err && console.log(err);
    //refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
 
    
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //if everything is ok, create new access token, refresh token and send to user
});

const generateAccessToken=(user)=>{
  // console.log(user);
  // console.log(user.name);
  //console.log(user);
  return jwt.sign({name:user.name,  isAdmin: user.isAdmin},"mysecretkey",{
    expiresIn:"100s",
  })
}

const generateRefreshToken=(user)=>{
  //console.log(user);
  return jwt.sign({name:user.name,isAdmin : user.isAdmin},"myrefreshsecretkey",{
    expiresIn:"10000s",
  })
}


router.post('/register',
    [
        body("name").notEmpty().withMessage("Name is Required"),
        body("email").notEmpty().withMessage("Email is Required"),
        body("password").notEmpty().withMessage("Password is Required"),
    ],
    async(request,response)=>{
        let errors =validationResult(request);
        if(!errors.isEmpty()){
            return response.status(400).json({errors:errors.array()});
        }
try{
let{name,email,password}=request.body;
//console.log(name,email,password);
let user=await User.findOne({email:email});
if(user){
    return response.status(401).json({errors:[{
        msg:"User Already Exists"
    }]});
}

let salt=await bcrypt.genSalt(10);
password=await bcrypt.hash(password,salt);

 user=await new User({name,email,password});
await user.save();
await response.status(200).json({ msg:"Registered"});


} catch(error){
    console.log(error);
    await response.status(500).json({errors:[{msg:error.message}]});
}
}
);

router.post('/login',
    [
        
        body("email").notEmpty().withMessage("Email is Required"),
        body("password").notEmpty().withMessage("Password is Required"),
    ],
    async(request,response)=>{
        let errors =validationResult(request);
        if(!errors.isEmpty()){
            return response.status(400).json({errors:errors.array()});
        }
try{
let{email,password}=request.body;
//console.log(email,password);
let user=await User.findOne({email:email});
if(!user){
  return response.status(404).send("This email is not registered")
}

let correctPassword=await bcrypt.compare(password,user.password);
if(!correctPassword){
    return response.status(401).send("Incorrect password or email id")
}
else{
  //console.log(user);
  const accessToken=generateAccessToken(user);
  const refreshToken=generateRefreshToken(user);

  // User.updateOne({email:user.email},{
  //   refreshToken:refreshToken,
  // })
  
  response.json({
    id:user._id,
    name:user.name,
    isAdmin:user.isAdmin,
    accessToken,
    refreshToken,
  });
  
  }
} catch(error){
    console.log(error);
    await response.status(500).json({errors:[{msg:error.message}]});
}
}
);

module.exports=router;

// const express = require('express')
// const {MongoClient,ObjectId} = require('mongodb')
// const route = express.Router()
// const url ="mongodb+srv://lakshay:lakshaymongo1@test.ak2ca.mongodb.net/Test?retryWrites=true&w=majority"
// const dbname= 'firstdb'


// route.get('/a',function(req,res){
//    // const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
//     MongoClient.connect(url,function(err,cluster){
//            if(err){
//                res.send("Connection with DB Failed")
//                console.log(err);
//            } else {
//                const dbRef=cluster.db(dbname)
//             const collectionRef=   dbRef.collection('firstcoll')
//             collectionRef.find().toArray(function(err,successResponse){
//                      if(err){
//                          res.send("Error while accessing the data")
//                      } else {
//                          res.send(successResponse)
//                      }
//             })
//            }
//     })
// })

// route.post('/userdata',function(req,res){
//            var name = req.body.uname
//            var password = req.body.upassword

//            var userData = {
//                name:name,
//                password:password
//            }

//             MongoClient.connect(url,function(err,cluster){
//                 if(err){
//                     res.send("error while connecting with DB")
//                     console.log(err)
//                 } else {
//                    const dbRef = cluster.db(dbname)
//                     const collectionRef=  dbRef.collection('firstcoll')

//                     collectionRef.insertOne(userData,function(err,successMsg){
//                                   if(err){
//                                       res.send("Error while inserting data")
//                                   } else {
//                                       res.send("Data Inserted Successfully")
//                                   }
//                     })
//                 }
//             })

         
            
// })

// route.post('/posts',function(req,res){
//     var name = req.body.postdata
//     // var password = req.body.upassword

//     var userData = {
//         name:name
//     }

//      MongoClient.connect(url,function(err,cluster){
//          if(err){
//              res.send("error while connecting with DB")
//              console.log(err)
//          } else {
//             const dbRef = cluster.db(dbname)
//              const collectionRef=  dbRef.collection('firstcoll')

//              collectionRef.insertOne(userData,function(err,successMsg){
//                            if(err){
//                                res.send("Error while inserting data")
//                            } else {
//                                res.send("Data Inserted Successfully")
//                            }
//              })
//          }
//      })

  
     
// })




// module.exports = route