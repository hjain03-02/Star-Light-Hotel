const express = require('express');
const util = require('../models/util.js');
const config = require("../server/config/config");
const client = util.getMongoClient();
const memberController = express.Router();

// Authentication Middleware
const authenticateUser = (req, res, next) => {
    if (!req.user) {
        res.status(403);
        return res.send('You need to be logged in');
    }
    console.log('Authenticated User:', req.user);
    next();
};

// GET /booking - Show booking page (protected)
memberController.get('/booking', authenticateUser, async (req, res) => {
    console.info('Inside /booking');

    try {
        // Serve booking page (you can replace 'booking.html' with your actual page file)
        res.sendFile('success.html', { root: config.ROOT });
    } catch (err) {
        console.error('Error in /booking:', err.message);
        res.status(500).send('Internal server error');
    }
});

// POST new booking
memberController.post('/addBooking', authenticateUser, async (req, res) => {
    const { fullName, email, phone, checkIn, checkOut, roomType, guests, requests } = req.body;

    // Ensure all required fields are provided
    if (!fullName || !email || !phone || !checkIn || !checkOut || !roomType || !guests) {
        return res.status(400).json({ error: 'Missing required booking fields' });
    }

    try {
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
        await client.connect();
        const db = client.db('hotel'); // Connect to the 'hotel' database
        const collection = db.collection('bookings'); // Collection for bookings

        // Insert the booking into the 'bookings' collection
        await util.insertOne(collection, booking);

        // Respond with a success message
        res.json({
            message: `Your booking has been successfully added for ${fullName}!`
        });
    } catch (err) {
        console.error('Error adding booking:', err.message);
        res.status(500).send('Failed to add booking');
    } finally {
        client.close();
    }
});

module.exports = memberController;
