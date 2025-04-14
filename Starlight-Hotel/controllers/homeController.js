const express = require('express');
const util = require('../models/util.js');
const config = require("../server/config/config");
const User = require("../models/user");

const homeController = express.Router();
const client = util.getMongoClient();

// User registration
// User registration
homeController.post('/register', async (req, res) => {
    console.log('Registering user...');
    const { email, password, confirm } = req.body;

    if (password !== confirm) {
        console.log('❌ Passwords do not match');
        return res.status(400).json({ error: 'Passwords do not match' }); // Send error message as JSON
    }

    try {
        await client.connect(); // Ensure MongoDB client is connected
        const collection = client.db('hotel').collection('Users'); // Use 'hotel' DB and 'Users' collection

        // Check if the email already exists in the database (email is stored as 'username')
        const existingUser = await collection.findOne({ username: email });
        if (existingUser) {
            console.log('❌ Email already exists');
            return res.status(400).json({ error: 'Email already exists' }); // Send error message as JSON
        }

        // Create the user object, where email is stored as 'username'
        const user = {
            username: email,
            password: password,
            role: "member", // Assuming you want to set a default role
            since: new Date() // Set current date/time as registration date
        };
        console.log('✅ New user:', user);

        // Insert the user into the Users collection
        await util.insertOne(collection, user);

        // Send a success response instead of redirecting
        res.status(200).json({ message: 'Sign up successful!' });

    } catch (err) {
        console.error('❌ Registration failed:', err);
        res.status(500).json({ error: 'Registration failed' }); // Send error message as JSON
    } finally {
        await client.close(); // Ensure we close the connection after the operation
    }
});

  
  

// User login
// User login
homeController.post('/login', async (req, res) => {
    console.log("Login request received!");
    const { email, password } = req.body; // 'username' is the email in this case
    console.log(`Received credentials: email: ${email}, password: ${password}`);

    try {
        await client.connect(); // Ensure MongoDB client is connected
        const collection = client.db('hotel').collection('Users');
        
        // Find user by email (stored as 'username')
        const user = await collection.findOne({ username: email }); // Find by email (stored in 'username')
        console.log("User found in DB:", user);

        if (!user || user.password !== password) {
            console.log('❌ Invalid login credentials');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log('✅ Login successful:', email);
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('❌ Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close(); // Ensure we close the connection after the operation
    }
});




// Booking submission (unchanged)
homeController.post('/submitBooking', async (req, res) => {
  try {
    const { fullName, email, phone, checkIn, checkOut, roomType, guests, requests } = req.body;

    if (!fullName || !email || !phone || !checkIn || !checkOut || !roomType || !guests) {
      return res.status(400).json({ error: 'All booking fields must be filled in' });
    }

    const booking = {
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      roomType,
      guests,
      requests: requests || "None",
      timestamp: new Date()
    };

    const db = client.db('hotel');
    const collection = db.collection('bookings');
    await util.insertOne(collection, booking);

    res.redirect(`/success.html?name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&roomType=${encodeURIComponent(roomType)}&guests=${encodeURIComponent(guests)}&requests=${encodeURIComponent(requests || "None")}`);
  } catch (error) {
    console.error('❌ Error handling booking:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = homeController;
