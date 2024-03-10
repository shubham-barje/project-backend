const mongoose = require("mongoose");
//How to create a model
//step1: reqire mongoose
//step2:create schema
//step 3:crteate a model

const SongSchema = new mongoose.Schema({
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
   artist:{
    type:mongoose.Types.ObjectId,
    ref:"User",
   }
})
const Song = mongoose.model("Song",SongSchema)
module.exports= Song;