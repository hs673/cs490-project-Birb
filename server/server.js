require("dotenv").config({ path: "./config.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user");
const authRoute = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');
const eventsRoutes = require('./routes/events');
const appointmentsRoutes = require('./routes/appointments');
const picRoutes = require('./routes/pic');

const app = express();

app.use(cors());

app.use(express.json());

const urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json(), urlencodedParser);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  console.log(req.path, req.method);
  next();
})

app.use('/api/auth', authRoute);
app.use('/api/user', userRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/pic', picRoutes);

const port = process.env.PORT || 5000;

mongoose.connect(process.env.ATLAS_URI, {
  dbName: 'crush-it'
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Listening for requests on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

  module.exports = app
