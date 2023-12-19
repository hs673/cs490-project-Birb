const Appointment = require('../models/appointmentsModel');
const mongoose = require('mongoose');


const createAppointments = async (req, res) => {
    const username = req.body.username;
    const date = req.body.date;

    try {
        const appointments = await Appointment.create({ username:username, date:'10-10-2010', isPlanned:false });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

// Update appointments for a specific username and date
const updateAppointments = async (req, res) => {
    const username = req.params.id;
    const date = req.body.date;
    const isPlanned = req.body.isPlanned;

    try {
        const userAppointments = await Appointment.findOne({ username: username });
        if (!userAppointments) {
            return res.status(404).json({ error: 'User not found' });
        }
        userAppointments = {
            username: username,
            date: date,
            isPlanned: isPlanned,
        }
        await userAppointments.save();
        return res.json(userAppointments);
        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getAppointments = async (req, res) => {
    const username = req.params.id;
    try {
        const appointmentData = await Appointment.findOne({username: username}).exec()
        res.json(appointmentData)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'User not found'})
    }
}

module.exports = {
    createAppointments,
    updateAppointments,
    getAppointments
};