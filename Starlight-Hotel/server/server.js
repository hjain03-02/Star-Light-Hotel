const path = require("path");
const express = require("express");
const server = express();

const config = require("./config/config");
const util = require("../models/util.js");
const homeController = require("../controllers/homeController");

// Connect to MongoDB
const client = util.getMongoClient();
client.connect()
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Log requests
server.use((req, res, next) => {
  util.logRequest(req, res);
  next();
});

// Routes
homeController.get('/', (req, res) => {
  res.sendFile('login.html', { root: config.ROOT });
});
server.use(homeController);

server.use(express.static(config.ROOT));


// Serve success page
server.get('/success.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'success.html'));
});

// 404 fallback
server.use((req, res) => {
  res.status(404).sendFile('404.html', { root: config.ROOT });
});

// Start server
server.listen(config.PORT, "localhost", () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
});
