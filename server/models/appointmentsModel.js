const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const appointmentsSchema = new Schema({
    username: String,
    date: String,
    isPlanned: Boolean
}, {collection: 'appointments'})

module.exports = mongoose.model('Appointments', appointmentsSchema);

// const subsubAppointmentsSchema = new Schema({
//     index: Number,
//     title: String,
//     description: String,
//     startHour: Number,
//     startMinutes: Number,
//     endHour: Number,
//     endMinutes: Number,
//     ifTask: Boolean
// })

// const subAppointmentsSchema = new Schema ({
//     date: String,
//     isPlanned: Boolean,
//     appointments: subsubAppointmentsSchema
// })

// const appointmentsSchema = new Schema({
//     username: String,
//     dailyAppointments: [subAppointmentsSchema]
// }, {collection: 'appointments'})

// module.exports = mongoose.model('Appointments', appointmentsSchema);


// username: 
// dailyAppointments: [
//     { 
// 		date: date
// 		isPlanned: boolean
// 		appointments: {
// 			index
// 			title, 
// 			description (usually undefined), 
// 			eventType(default, focusTime, etc.), -deleted
// 			startHour,
// 			startMinutes,
// 			endHour,
// 			endMinutes
// 			ifTask: boolean (if it is a task its true)
//     }
//     { 
// 		date: date
// 		isPlanned: boolean
// 		appointments: {
// 			index
// 			title, 
// 			description (usually undefined), 
// 			eventType(default, focusTime, etc.), -deleted
// 			startHour,
// 			startMinutes,
// 			endHour,
// 			endMinutes
// 			ifTask: boolean (if it is a task its true)
//     }
// ]