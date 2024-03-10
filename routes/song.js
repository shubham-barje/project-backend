const express = require("express");
const passport = require("passport");
const router = express.Router();
const Song = require("../models/Song");
const User = require("../models/User")

// Create a new song
router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
        return res.status(400).json({ error: "Insufficient details to create song" });
    }
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist };

    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong)
}
)

// Get all songs published by the current user
router.get("/get/mysongs", passport.authenticate("jwt", { session: false }), async (req, res) => {
    //.populate is used to access object which is in the mongodb
    const songs = await Song.find({ artist: req.user._id }).populate("artist")
    return res.status(200).json({ data: songs })
});


//getroute to get all songs any artist has published
//I will send the artist id and I want to see all songs that artist has published.
//create link search song
router.get("/get/artist/:artistId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { artistId } = req.params;
        
    
        const artist = await User.findOne({ _id: artistId })
        console.log(artist)
        //![]=false
        //!null = true
        //undefined = true
        if (!artist) {
            return res.status(301).json({ err: "Artist does ot exist" })
        }
        const songs = await Song.find({ artist: artistId });
        return res.status(200).json({ data: songs })
    })


//Get route to get a single song by name
router.get("/get/songname/:songName",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { songName } = req.params;
        
        //name:songName ==> exact name matching
        //pattern matching insted of direct name matching
        const songs = await Song.find({ name: songName}).populate("artist");
        return res.status(200).json({ data: songs })
    })
module.exports = router;