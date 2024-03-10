const express = require("express");
const passport = require("passport")
const Playlist = require("../models/Playlist")
const router = express.Router()
const User = require("../models/User")
const song = require("../models/Song");
const Song = require("../models/Song");

//Route1: Create a playlist
router.post("/create",passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const currentUser = req.body;
    const{name,thumbnail,songs} = req.body;
    if(!name || !thumbnail || !songs){
        return res.status(301).json({err:"insufficent data"})
    }
    const playlistData = {
        name,
        thumbnail,
        songs,
        owner:currentUser._id,
        collaborators:[]
    };
    const playlist =await Playlist.create(playlistData);
    return res.status(200).json(playlist)
})

//Router2:Get a playlist by ID
//We will get the palylist ID as a route parameter and we will return the playlist having that ID
//If we are doing /playlist/get/:playlistId {focus on the :}->this means that playlistId is now a variable to which we can assign ay value
//if you call anything of the format /playlist/get/abhvaj -> (abhvaj it can be anything)
//if you called /playlist/get/abhvaj the playlist variable gets assigned to the value abhvaj
router.get("/get/playlist/:playlistId",passport.authenticate("jwt",{session:false}),
async(req,res)=>{
    const playlistId = req.params.playlistId;//params for :playlistId variable
    //I nees to find a playlist with the ._id -> playlistId

    const playlist = await Playlist.findOne({_id:playlistId});
    if(!playlist){
        return res.status(301).json({err:"inavalid ID"})
    }
    return res.status(200).json(playlist)

});

//get all playlist made by me
router.get("/get/me",passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const artistId = req.user._id;
    const playlists = await Playlist.find({owner:artistId}).populate("owner").populate("songs");
    return res.status(200).json({data:playlists})
});

//get all playlists made by an artist
router.get("/get/artist/:artistId",passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const artistId = req.params.artistId;

    //check if artist with given artist ID exsits
    const artist = await User.findOne({_id:artistId})
    
    if(!artist){
        return res.status(301).json({err:"inavalid ID"})
    }
    const playlists = await Playlist.find({owner:artistId});
    return res.status(200).json({data:playlists})
});

//add a song to the playlist from user side
router.post("/add/song",passport.authenticate("jwt",{session:false}),async(req,res)=>{
    const currentUser = req.user;
    const {playlistId,songId} = req.body;
    const playlist = await Playlist.findOne({_id:playlistId});

    // Check if the song exists
    const songExists = await Song.exists({ _id: songId });
    if (!songExists) {
        return res.status(400).json({ error: 'Song not found' });
    }

    if(!playlist){
        return res.status(304).json({err:"playlist does not exist"});
    }

   //video 16 
    //step 1: check if currentUser owns the playlist or is a collaborator
    if(playlist.owner !=currentUser._id && !playlist.collaborators.includes(currentUser._id)){
        return res.status(400).json({err:"Not allowed"})
    }
    //step 2:check if the song is a valid song
    const song = await Song.findOne({_id:songId});
    if(!song){
        return res.status(304).json({err:"song does not exist"});
    }
    //now simply add the songs to the playlist
    playlist.songs.push(songId)
    await playlist.save();//save changes to the database

    return res.status(200).json({playlist})
})

module.exports = router;
