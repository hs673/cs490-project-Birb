const Pic = require('../models/picModel');
const mongoose = require("mongoose");


const createPic = async (req, res) => {
    const username = req.body.username;
    try {
        const image = await Pic.create({
            username: username,
            picture: null
        })
       // console.log("creating user")
        res.status(200).json(image);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// Update appointments for a specific username and date
const updatePic = async (req, res) => {
    const username = req.params.id;
    const imageName = req.body.selectedFile;
    console.log(imageName)
    console.log(String(imageName))
    const image = {
        username: username,
        picture: String(imageName)
    }
    try {
        const userPic = await Pic.findOneAndUpdate({username: username}, image);
        if (!userPic) {
            return res.status(404).json({ error: 'User not found' });
        }
        // If the picture exists
       // console.log("Found user updated and returning img", userPic)
        return res.json(image);
    } catch (error) {
       // console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
  

const getPic = async (req, res) => {
    const username = req.params.id;
    try {
        const picData = await Pic.findOne({username: username}).exec()
        res.json(picData)
        //console.log("found user returning img", picData)
    } catch (error) {
        //console.log(error)
        res.status(500).json({error: 'User not found'})
    }
}

module.exports = {
    createPic,
    updatePic,
    getPic
};