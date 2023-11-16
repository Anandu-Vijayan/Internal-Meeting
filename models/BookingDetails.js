const mongoose = require("mongoose");

const BookingDetailsSchema = mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
    bookingPerson: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    cabin: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BookingData = mongoose.model("BookingDatas", BookingDetailsSchema);

module.exports = BookingData;
