const express = require('express');
const util = require('../models/util.js');
const config = require("../server/config/config");
const User = require("../models/user");

const homeController = express.Router();
const client = util.getMongoClient();

// User registration
homeController.post('/register', util.logRequest, async (req, res) => {
  console.log('Registering user...');
  const { email, password, confirm } = req.body;
  const collection = client.db().collection('Users');

  if (password !== confirm) {
    console.log('❌ Passwords do not match');
    return res.status(400).send('Passwords do not match');
  } else {
    const user = User(email, password);
    console.log('✅ New user:', user);
    await util.insertOne(collection, user);
  }

  res.redirect('/member.html'); // After registration, redirect to the member page
});

// Booking submission
homeController.post('/submitBooking', async (req, res) => {
  try {
    const { fullName, email, phone, checkIn, checkOut, roomType, guests, requests } = req.body;

    // Validate booking fields
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
      requests: requests || "None", // Default to "None" if no special requests
      timestamp: new Date()
    };

    const db = client.db('hotel');
    const collection = db.collection('bookings');
    await util.insertOne(collection, booking);

    // Redirect to success page with booking details
    res.redirect(`/success.html?name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&roomType=${encodeURIComponent(roomType)}&guests=${encodeURIComponent(guests)}&requests=${encodeURIComponent(requests || "None")}`);
  } catch (error) {
    console.error('❌ Error handling booking:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = homeController;
