const util = require('../models/util.js');
const config = require("../server/config/config");
const User = require("../models/user");
const client = util.getMongoClient();
const express = require('express');
const homeController = express.Router();

// Handle user registration
homeController.post('/register', util.logRequest, async (req, res, next) => {
    console.log('Registering user...');
    let collection = client.db().collection('Users');
    let email = req.body.email;
    let password = req.body.password;
    let confirm = req.body.confirm;

    if (password !== confirm) {
        console.log('\t| Password does not match');
    } else {
        let user = User(email, password);
        console.info(user);
        await util.insertOne(collection, user);
    }
    res.redirect('/member.html');
});

// Handle booking form submission
homeController.post('/submit_booking', (req, res) => {
    const bookingDetails = req.body;

    console.log("New booking received:", bookingDetails);

    // Redirect to success page with booking details in the URL
    res.redirect(`/success.html?name=${encodeURIComponent(bookingDetails.fullName)}&email=${encodeURIComponent(bookingDetails.email)}&phone=${encodeURIComponent(bookingDetails.phone)}&checkIn=${encodeURIComponent(bookingDetails.checkIn)}&checkOut=${encodeURIComponent(bookingDetails.checkOut)}&roomType=${encodeURIComponent(bookingDetails.roomType)}&guests=${encodeURIComponent(bookingDetails.guests)}&requests=${encodeURIComponent(bookingDetails.requests || "None")}`);
});

module.exports = homeController;
