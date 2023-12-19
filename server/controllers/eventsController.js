const Event = require('../models/eventsModel');
const mongoose = require('mongoose');
const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);


// gets user's access token from database
const getAccessToken = async (req, res) => {
    const username = req.params.id;

    Event.findOne({username: username}) 
    .then(dbUser => res.json({
        username: dbUser.username,
        access_token: dbUser.access_token
    }))
    .catch(err => res.json({
        username: "User Not Found",
    }))
};

const createTokens = async (req, res) => {
    const username = req.body.username;
    const access_token = req.body.access_token;

    // const {response} = await oauth2Client.getToken(code)

    try {
        const event = await Event.findOneAndUpdate(
            {username: username},
            {$set: {username: username, access_token:access_token}},
            {upsert: true, new: true}
        )
        res.status(200).json(event)
    } catch (error) {
        console.error('Error updating or creating access_token', error);
        res.status(500).json({error: 'Internal Server Error'})
    }
};

const getEvents = async (req, res) => {
    const username = req.params.id;
    const start = new Date(req.body.start);
    const end = new Date(req.body.end);
    console.log(start)
    console.log(end)
    var access_token = ''
    //access_token=dbUser.access_token
    try {
        const eventData = await Event.findOne({username: username}).exec()
        access_token = eventData.access_token
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'User not found'})
        return;
    }
    
    try {
        oauth2Client.setCredentials({access_token:access_token});
        const calendar = google.calendar({version:'v3', auth: oauth2Client});
        const response = await calendar.events.list({
            calendarId: 'primary',
            maxResults: 100,
            singleEvents: 'true',
            timeMin: start,
            timeMax: end,
            timeZone: 'America/New_York'
        })
        res.json(response.data)

    } catch(error) {
        console.error('Error fetching Google Calendar events:', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }

}

module.exports = {
    createTokens,
    getAccessToken,
    getEvents
};