const express=require('Express');
const router=express.Router();
const jwt=require('jsonwebtoken');
const Comments=require('../models/Comments');
const mongoose=require('mongoose');

const verify=(req,res,next)=>{
    let authheaders=req.headers.authorization;
    if(authheaders){
        authheaders=authheaders.split(" ")[1];
        jwt.verify(authheaders,"mysecretkey",(err,user)=>{
            if(err){
                return res.status(400).send("Token Expired");
            }
            req.user=user;
            next();
        })
    }
    else{
        return res.status(500).send("Please re-login");
    }

}


router.post('/addcomment',verify,async(req,res)=>{
    try{
  if(req.user.name==req.body.username){
      const user=req.body.username;
      const postid=req.body.postid;
      const text=req.body.text;
      console.log(text+" "+postid+" "+user);
      const _id=mongoose.Types.ObjectId();
     var comment=await new Comments({_id,user,postid,text});
     await comment.save();
     res.send(_id);
    
  }
  else{
      console.log("555");
      res.status(403).send("You are Oversmart😏");
  }
}
catch(err){
    console.log(err);
}
})

router.get("/getcomments",async(req,res)=>{
    try{
        await Comments.find({postid:req.query.id},null,{limit:20},function(err,successResponse){
            if(err){
                res.send("Error while accessing the comments")
                console.log(err);
            } else {
                res.send(successResponse)
            }
        })
    }
    catch(err){
    console.log(err);
    }
})

router.delete("/deletecomment",verify,async(req,res)=>{
   if(req.user.name==req.body.username){
       await Comments.deleteOne({_id:req.body.postid}).then(()=>{
           res.status(200).send("Deleted")
           console.log("comment deleted")
       },(err)=>{
           res.status(500).send(err)
           console.log(err);
       })

   }
   else{
       console.log(req.body);
   }
})
module.exports=router;