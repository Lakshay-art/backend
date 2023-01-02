var express=require("Express")
//const Post= require("../models/Post")
var router =express.Router()
const Post = require("../models/Post");
//var post=require("../models/Post")
//const User=require("../models/User");
const jwt=require("jsonwebtoken");
const mongoose = require("mongoose");
const Comments = require("../models/Comments");

//verifying the user
const verify = (req, res, next) => {
   //console.log("hello");
    const authHeader = req.headers.authorization;
   
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      
      jwt.verify(token, "mysecretkey", (err, user) => {console.log( authHeader);
        if (err) {
          console.log(err);
          return res.status(403).json("Token is not valid!");
        }
  
        req.user = user;
        //console.log(user);
        next();
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
  };
  
//creating a new post
router.post('/setpost',verify,async(req,res)=>{
  
try{
 
  if(req.body.username==req.user.name){
    const text=req.body.posttext;
    const user=req.body.user;
    const username=req.body.username;
    const _id=mongoose.Types.ObjectId()
    var post=await new Post({_id,user,text,username,likes:[]})
    let currid;
    await post.save()
    res.send(_id);
  }
    else console.log("Not Allowed");

}
catch(error){
    console.log(error);
    await res.status(500).json({errors:[{msg:error.message}]});
}
});

//deleting a post
router.post('/deletepost',verify,async(req,res)=>{
  console.log(req.user.name+" "+req.body.user);

    if(req.user.name==req.body.user){
      await Comments.deleteMany({postid:req.body.id}).then(()=>{
        res.status(200);
      }).catch(err=>{
        
      })
      await Post.deleteOne({
        // _id:`ObjectId("${req.body.id}")`,
        _id:req.body.id,
      }).then(()=>{
        res.status(200).json("Post Deleted");
      }).catch(err=>{
        
      })
      
     
    
    
}
else{
  res.status(403).json("You cannot delete this post");
}})

//send all the posts
router.get('/theposts',async(req,res)=>{
    try{
    await Post.find({},null,{limit:20},function(err,successResponse){
        if(err){
            res.send("Error while accessing the data")
        } else {
            res.send(successResponse)
        }
    })}
    catch(error){
       // console.log(error)
    }
})

//add comments to posts
// router.post('/addcomment',verify,async(req,res)=>{
//   if(req.user.name==req.body.username){

//   }
// })

//add likes to posts
router.post('/addlikes',verify,async(req,res)=>{
 // console.log(req.body.username+" "+req.user.name);
  if(req.body.username==req.user.name){
    Post.findByIdAndUpdate(req.body.postid,
      {"$push":{"likes":{
        user:req.body.id,
        username:req.body.username,
      }}},
      function(err,response){
        if(err) throw err;
        console.log("--------like added to id"+req.body.postid+"-----------");
      
      }
      )
    }
  }
)

module.exports=router;