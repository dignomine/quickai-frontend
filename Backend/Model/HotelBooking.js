const mongoose = require("mongoose");
const validator = require("validator");

const hotelBookingSchema = new mongoose.Schema(
  {
    Status: Number,
    HotelBookingStatus: String,
    ConfirmationNo: {
      type: String,
      required: true,
      unique: true,
    },
    BookingRefNo: {
      type: String,
      required: true,
      unique: true,
    },
    BookingId: Number,
    // Owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    TravellerDetails: {
      firstname: {
        type: String,
        default: "",
      },
      middlename: {
        type: String,
        default: null,
      },
      lastname: {
        type: String,
        default: null,
      },
      email: {
        type: String,
        default: "",
      },
      phoneNumber: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

const HotelBooking = mongoose.model("Hotelbooking", hotelBookingSchema);

module.exports = HotelBooking;
