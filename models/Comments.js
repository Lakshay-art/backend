const mongoose =require('mongoose');
const CommentsSchema=new mongoose.Schema({
    postid:{type:mongoose.Schema.Types.ObjectId,ref:'post',required:true},
    
    user:{type:String,required:true},
    text:{type:String,required:true},
    //name:{type:String,required:true},
    date:{type:Date,default:Date.now()}
            
})
const Comments=mongoose.model('comments',CommentsSchema);
module.exports=Comments;