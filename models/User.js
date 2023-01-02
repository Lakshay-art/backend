const mongoose =require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String ,required:true},
    email:{type:String ,required:true},
    password:{type:String ,required:true},
    avatar:{type:String ,required:false},
    isAdmin:{type:Boolean ,required:false},
   // refreshTokens:{type:String},
},{timestamps :true});

const User =mongoose.model('user',UserSchema);
module.exports=User;