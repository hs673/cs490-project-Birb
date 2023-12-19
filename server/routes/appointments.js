const express = require("express");
 
const {
    getAppointments,
    createAppointments,
    updateAppointments,
} = require('../controllers/appointmentsController');

const appointmentsRoutes = express.Router();

appointmentsRoutes.get('/:id', getAppointments);
appointmentsRoutes.post('/', createAppointments);
appointmentsRoutes.put('/:id', updateAppointments);
 
module.exports = appointmentsRoutes;