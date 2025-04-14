const express = require('express');
const util = require('../models/util.js');
const config = require("../server/config/config");

const homeController = express.Router();
const client = util.getMongoClient();

// User registration
homeController.post('/register', async (req, res) => {
    const { email, password, confirm } = req.body;

    if (password !== confirm) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        await client.connect();
        console.log('✅ MongoDB connected for registration');
        
        const collection = client.db('hotel').collection('Users');

        const existingUser = await collection.findOne({ username: email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const user = {
            username: email,
            password: password,
            role: "member",
            since: new Date()
        };

        await util.insertOne(collection, user);

        res.status(200).json({ message: 'Sign up successful!' });

    } catch (err) {
        console.error('❌ Registration failed:', err);
        res.status(500).json({ error: 'Registration failed' });
    } finally {
        await client.close();
    }
});

// User login
homeController.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        await client.connect();
        console.log('✅ MongoDB connected for login');
        
        const collection = client.db('hotel').collection('Users');
        
        const user = await collection.findOne({ username: email });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('❌ Login failed:', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
});

// Booking submission
homeController.post('/submitBooking', async (req, res) => {
    console.log('Received booking request:', req.body);
    try {
        const { fullName, email, phone, checkIn, checkOut, roomType, guests, requests } = req.body;

        // Validate booking fields
        if (!fullName || !email || !phone || !checkIn || !checkOut || !roomType || !guests) {
            return res.status(400).json({ error: 'All booking fields must be filled in' });
        }

        // Prepare the booking data
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
        res.redirect(`/success.html?name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&roomType=${encodeURIComponent(roomType)}&guests=${encodeURIComponent(guests)}&requests=${encodeURIComponent(requests || "None")}`);
    } catch (error) {
        console.error('❌ Error handling booking:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});


module.exports = homeController;
