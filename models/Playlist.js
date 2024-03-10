const mongoose = require("mongoose");
//How to create a model
//step1: reqire mongoose
//step2:create schema
//step 3:crteate a model

const Playlist = new mongoose.Schema({
   name:{
    type:String,
    require:true,
   },
   thumbnail:{
    type:String,
    require:true,
   },
   track:{
    type:String,
    require:true,
   },
   owner:{
    type : mongoose.Types.ObjectId,
    ref:"User",
   },
   //1.playslist main audiobook konse hai
   //2.playlist collabrators

   songs:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Song",
        },
    ],
    collaborators:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User",
        },
    ],
   
})
const PlaylistModel = mongoose.model("Playlist",Playlist)
module.exports= PlaylistModel;