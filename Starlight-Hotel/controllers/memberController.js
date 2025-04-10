const util = require('../models/util.js')
const config = require("../server/config/config")
const Post = require("../models/post")
const client = util.getMongoClient()
const express = require('express')
const memberController = express.Router()
// Authentication & Authorization Middleware
const authenticateUser = (req, res, next) => {
    if (req.user == null){
        res.status(403)
        return res.send('You need to be logged in')
    } else{
        console.log(req.user)
    }
    next()
}
const authenticateRole = (role, req, res, next) => {
    return (req,res,next) => {
        if(req.user.role == role){
            res.status(401)
            return res.send('Not authorized')
    }
    
}
}
memberController.get('/member', authenticateUser,  async (req, res, next) => {
    console.info('Inside member.html')
    let collection = calient.db().collection('Posts')
    let post = Post('Security','AAA is a key concept in security','Pentester')
    util.insertOne(collection, post)
    res.sendFile('member.html',{ root: config.ROOT})
})
// HTTP GET
memberController.get('/posts',  async (req, res, next) => {
    let collection = client.db().collection('Posts')
    let posts = await util.findAll(collection, {})
    //Utils.saveJson(__dirname + '/../data/topics.json', JSON.stringify(topics))
    res.status(200).json(posts)
    
})
memberController.get('/post/:ID', async (request, response, next) => {
    // extract the querystring from url
    let id = request.params.ID
    console.info(`Post Id ${id}`)
    let collection = client.db().collection('Posts')
    let post = await util.findOne(collection, id)
    //const data = Utils.readJson(__dirname + '/../data/posts.json')
    //util.insertMany(posts, data[id])
    console.log('Post', post)
    response.status(200).json({post: post})
})
memberController.get('/postMessage',  async (req, res, next) => {
    res.sendFile('postMessage.html',{ root: config.ROOT})
       
})
// HTTP POST
memberController.post('/addPost', async (req, res, next) => {
    const bookingDetails = req.body;

    // Get collection
    let collection = client.db().collection('Bookings'); // You can name this whatever you like

    // Create a document to insert
    const booking = {
        fullName: bookingDetails.fullName,
        email: bookingDetails.email,
        phone: bookingDetails.phone,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        roomType: bookingDetails.roomType,
        guests: bookingDetails.guests,
        requests: bookingDetails.requests || "None",
        createdAt: new Date()
    };

    // Save booking in database
    await util.insertOne(collection, booking);

    // Redirect to success page
    res.redirect(`/success.html?name=${encodeURIComponent(booking.fullName)}&email=${encodeURIComponent(booking.email)}&phone=${encodeURIComponent(booking.phone)}&checkIn=${encodeURIComponent(booking.checkIn)}&checkOut=${encodeURIComponent(booking.checkOut)}&roomType=${encodeURIComponent(booking.roomType)}&guests=${encodeURIComponent(booking.guests)}&requests=${encodeURIComponent(booking.requests)}`);
});


module.exports = memberController