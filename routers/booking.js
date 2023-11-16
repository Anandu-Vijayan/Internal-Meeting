const express = require('express')

const {CreateBooking, UpdateBooking, deleteBooking, getAllBooking} = require("../controllers/bookingController")
const router = express.Router();

router.post('/createBooking',CreateBooking)
router.post('/updateBooking/:id',UpdateBooking)
router.delete('/deleteBooking/:id',deleteBooking)
router.get('/getAllBookings',getAllBooking)







module.exports = router;