const BookingData = require("../models/BookingDetails");
const moment = require("moment");

const CreateBooking = async (req, res) => {
  try {
    const {
      department,
      bookingPerson,
      startTime,
      endTime,
      date,
      cabin,
      description,
    } = req.body;

    // ******Check if there are any existing bookings for the same date and overlapping time and cabin//*
    const existingBookings = await BookingData.find({
      date,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } },
            { cabin },
          ],
        },
      ],
    });

    if (existingBookings.length > 0) {
      const conflictingBooking = existingBookings[0];
      const {
        department: conflictingDepartment,
        bookingPerson: conflictingBookingPerson,
        cabin: conflictingCabin,
      } = conflictingBooking;
      return res.status(400).json({
        error: `Sorry, Meeting Room Occupied by ${conflictingDepartment} Department booked by ${conflictingBookingPerson} in cabin ${conflictingCabin}`,
      });
    }

    const payload = {
      department,
      bookingPerson,
      startTime,
      endTime,
      date,
      cabin,
      description,
    };
    const Booking = await BookingData.create(payload);

    res.status(200).json({ message: "Meeting Room Booked Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const UpdateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { department, bookingPerson, startTime, endTime, date, cabin,description } =
      req.body;

    // Check if the updated time range and cabin conflicts with any other bookings
    const conflictingBookings = await BookingData.find({
      _id: { $ne: id }, // Exclude the current booking being updated
      date,
      $or: [
        {
          $and: [
            { startTime: { $lt: endTime } },
            { endTime: { $gt: startTime } },
            { cabin },
          ],
        },
      ],
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        error:
          "This booking Time or Cabin is not available. Please change the time or cabin.",
      });
    }

    // Use the findByIdAndUpdate method to update the document
    const updatedBooking = await BookingData.findByIdAndUpdate(id, {
      department,
      bookingPerson,
      startTime,
      endTime,
      date,
      cabin,
      description
    });

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBookingDetails = await BookingData.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking Removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllBooking = async (req, res) => {
  try {
    const allBooking = await BookingData.find();

    const currentTime = moment(); // Get the current time using moment.js

    const allBokkingDetails = allBooking.map((booking) => {
      const bookingStartTime = moment(
        `${booking.date} ${booking.startTime}`,
        "DD/MM/YYYY hh:mm A"
      );
      const bookingEndTime = moment(
        `${booking.date} ${booking.endTime}`,
        "DD/MM/YYYY hh:mm A"
      );

      if (currentTime.isBetween(bookingStartTime, bookingEndTime, null, "[]")) {
        return { ...booking.toObject(), status: "Meeting ongoing" };
      } else if (currentTime.isBefore(bookingStartTime)) {
        return { ...booking.toObject(), status: "Meeting coming soon" };
      } else {
        return { ...booking.toObject(), status: "Meeting over" };
      }
    });

    res.status(200).json({ allBokkingDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { CreateBooking, UpdateBooking, deleteBooking, getAllBooking };
