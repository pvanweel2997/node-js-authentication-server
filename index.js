// Main Starting Point of the application
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// db setup
// mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true });

mongoose.connect('mongodb://localhost:27017/auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('listening on: ' + port);
