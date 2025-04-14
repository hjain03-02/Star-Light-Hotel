const path = require("path");
const express = require("express");
const server = express();

const config = require("./config/config");
const util = require("../models/util.js");
const homeController = require("../controllers/homeController");

const client = util.getMongoClient();
client.connect().catch(() => process.exit(1));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use((req, res, next) => {
  util.logRequest(req, res);
  next();
});

homeController.get('/', (req, res) => {
  res.sendFile('login.html', { root: config.ROOT });
});
server.use(homeController);

server.use(express.static(config.ROOT));

server.get('/success.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'success.html'));
});

server.use((req, res) => {
  res.status(404).sendFile('404.html', { root: config.ROOT });
});

server.listen(config.PORT, "localhost");
