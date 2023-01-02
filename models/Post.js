const mongoose=require ("mongoose");
const PostSchema =new mongoose.Schema({
   user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    text:{type:String,required:true},
    username:{type:String,required:true},
     likes:[
        {
            user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
            username:{type:String},
        }
    ],
    // comments:[
    //    
    // ]
},{timestamps:true});

const Post=mongoose.model('post',PostSchema);
module.exports=Post;