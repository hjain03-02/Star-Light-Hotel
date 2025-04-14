(() => {
    const Booking = ({
        fullName,
        email,
        phone,
        checkIn,
        checkOut,
        roomType,
        guests,
        requests
    }) => {
        return {
            FullName: fullName,
            Email: email,
            Phone: phone,
            CheckIn: new Date(checkIn),
            CheckOut: new Date(checkOut),
            RoomType: roomType,
            Guests: parseInt(guests),
            SpecialRequests: requests || "None",
            BookedAt: new Date().toUTCString()
        };
    };

    module.exports = Booking;
})();
