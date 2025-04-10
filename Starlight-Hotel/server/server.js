/*
 Loading built-in modules
*/
const fs = require("fs")
const path = require("path")
/*
  Loading external modules
*/
const express = require("express")
const server = express()

/*
  Loading internal modules
*/
const config = require("./config/config")
const util = require('../models/util.js')
const homeController = require('../controllers/homeController')
const memberController = require('../controllers/memberController')

//----------------------------------------------------------------
// middleware
//----------------------------------------------------------------
server.use(express.static(config.ROOT))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use((request, response, next) => {
  util.logRequest(request,response)
  next()
})
homeController.get('/', (req,res) => {
  res.sendFile('index.html')
})
server.use(homeController)
server.use(memberController)


server.post('/addPost', async (req, res) => {
  try {
      // Extract form data from the request body
      const { fullName, email, phone, checkIn, checkOut, roomType, guests, requests } = req.body;

      // Create the booking object
      const booking = {
          fullName,
          email,
          phone,
          checkIn,
          checkOut,
          roomType,
          guests,
          requests: requests || "None", // Default to "None" if no special requests
          timestamp: new Date()
      };

      // Get MongoDB client and insert the booking data
      const client = util.getMongoClient(); // Get MongoDB client
      await client.connect(); // Connect to the database
      const db = client.db('hotel'); // Connect to your database
      const collection = db.collection('bookings'); // Connect to your collection

      // Insert the booking into the 'bookings' collection
      await util.insertOne(collection, booking);

      // Redirect to success.html after the form submission
      res.redirect(`/success.html?name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&roomType=${encodeURIComponent(roomType)}&guests=${encodeURIComponent(guests)}&requests=${encodeURIComponent(requests || "None")}`);
  } catch (error) {
      console.error('Error inserting data into the database:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Serve the success page (success.html) when user visits /success route
server.get('/success.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'success.html'));
});

// catch all middleware
server.use((req, res, next) => {
  //res.status(404).sendFile('404.html',{root:config.ROOT})
  res.status(404).sendFile('404.html', { root: config.ROOT})
})
server.listen(config.PORT, "localhost", () => {
  console.log(`\t|Server listening on ${config.PORT}`)
})

