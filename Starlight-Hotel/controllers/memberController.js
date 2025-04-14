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
    next();
};

// GET /booking - Show booking page (protected)
memberController.get('/booking', authenticateUser, async (req, res) => {
    try {
        res.sendFile('success.html', { root: config.ROOT });
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

// POST new booking
memberController.post('/addBooking', authenticateUser, async (req, res) => {
    const { fullName, email, phone, checkIn, checkOut, roomType, guests, requests } = req.body;

    if (!fullName || !email || !phone || !checkIn || !checkOut || !roomType || !guests) {
        return res.status(400).json({ error: 'Missing required booking fields' });
    }

    try {
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

        await client.connect();
        const db = client.db('hotel');
        const collection = db.collection('bookings');

        await util.insertOne(collection, booking);

        res.json({
            message: `Your booking has been successfully added for ${fullName}!`
        });
    } catch (err) {
        res.status(500).send('Failed to add booking');
    } finally {
        client.close();
    }
});

module.exports = memberController;
