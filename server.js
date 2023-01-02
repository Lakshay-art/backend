const express = require("express");
const app=express();
const http=require("http");
const server=http.createServer(app);
const {Server}=require("socket.io");

const cors =require("cors");
const mongoose = require("mongoose");
const path =require("path");
//const bodyParser = require('body-parser')
//const dotEnv = require("dotenv");

 
 app.use(cors());
 const io=new Server(server,{
     cors:{
         origin:"hybridKb.vercel.app"
     }
 })

const port=8000;

 let users=new Map();
    let sockets=new Map();
io.on("connection",function(socket){
   
    console.log("hybrid keyboard connected");
    
    io.emit("welcome","socket server");
    io.emit("mm","aaaaaaaaaaaa");
    socket.on("addUserInstance",({userid})=>{
        
        let ids=[];
        ids=users.get(userid)||[];
        if(!ids.includes(socket.id))
        ids=[...ids,socket.id]
        users.set(userid,ids)
        sockets.set(socket.id,userid)
        console.log(users)
        console.log(sockets)
    })

    socket.on("keyboardInput",({userid,input})=>{
        console.log(input)
          users.has(userid) && users.get(userid).forEach(socketss => {
              io.to(socketss).emit("print",{
                  input
              })
          });
    })

    socket.on("mousexy",({userid,x,y})=>{
        console.log(x+" "+y)
        users.has(userid) && users.get(userid).forEach(socketss => {
            io.to(socketss).emit("copiedXY",{
                x,y
            })
        });
        //socket.off("mousexy")
    })

    socket.on("caretpos",({userid,start,end})=>{
        console.log(start+" "+end);
        users.has(userid) && users.get(userid).forEach(socketss => {
            io.to(socketss).emit("updatecaret",{
                start,end
            })
        });
    })

    socket.on("mouseclick",({userid,x,y})=>{
        console.log(x);
        users.has(userid) && users.get(userid).forEach(socketss => {
            (socketss!=socket) &&
            io.to(socketss).emit("click",{
                x:x,
                y:y
            })
        });
    })

    socket.on("disconnect",()=>{
        console.log("hybrid keyboard disconnected")
        let userid=sockets.get(socket.id)
        let ids=users.get(userid)||[];
        ids.splice(ids.indexOf(socket.id),1)
        if(ids.length==0)
        users.delete(userid)
        else
        users.set(userid,ids)
        sockets.delete(socket.id)
        console.log(users)
        console.log(sockets)
    })
})


// mongoose.connect("mongodb+srv://Lakshay:lakshaymongo1@cluster0.4fz4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
// {
//     useUnifiedTopology:true,
//     useNewUrlParser:true,
    
// }).then((response)=>{
//     console.log("Connected to Mongo");
// }).catch((error)=>{
//     console.error(error);
//     process.exit(1);
// });

// // if(process.env.NODE_ENV === "production"){

// // }

// app.use('/api/users',User);
// //app.use("/api/profiles",require("./router/profileRouter"));
// app.use('/api/posts',Post);
// app.use('/api/comments',Comments);

server.listen(port,()=>{
    console.log(`Express Server is started at : ${port}`);
});

// import express from "express";
// const app = express() ;
// const port = 9000;
app.use("/",
(req, res) => {res.json({ message: "Hello From Express App" });
});
// app. listen(9000, () = {
// console. log('Starting Server on Port $(port]*');
// 3);