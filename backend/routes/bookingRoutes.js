const express = require("express");

const Booking = require("../models/Booking");
const Event = require("../models/Event");

const router = express.Router();

router.post("/", async (req, res) => {
  const session = await Event.startSession();

  try {
    const {
      eventId,
      customerName,
      customerEmail,
      seats
    } = req.body;

    if (
      !eventId ||
      !customerName ||
      !customerEmail ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      await session.endSession();

      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const uniqueSeats = [...new Set(seats)];

    session.startTransaction();

    // Atomically reserve seats
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        bookedSeats: {
          $nin: uniqueSeats
        }
      },
      {
        $addToSet: {
          bookedSeats: {
            $each: uniqueSeats
          }
        }
      },
      {
        new: true,
        session
      }
    );

    if (!event) {
      const existingEvent = await Event.findById(
        eventId
      ).session(session);

      await session.abortTransaction();
      await session.endSession();

      if (!existingEvent) {
        return res.status(404).json({
          message: "Event not found"
        });
      }

      const alreadyBooked = uniqueSeats.filter((seat) =>
        existingEvent.bookedSeats.includes(seat)
      );

      return res.status(409).json({
        message: "Some seats are already booked",
        seats: alreadyBooked
      });
    }

    const totalAmount =
      uniqueSeats.length * event.price;

    // Create booking inside the same transaction
    const booking = await Booking.create(
      [
        {
          eventId: event._id,
          customerName,
          customerEmail,
          seats: uniqueSeats,
          totalAmount,
          bookingStatus: "confirmed"
        }
      ],
      { session }
    );

    // Commit both operations
    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      message: "Booking successful 🎉",
      booking: booking[0]
    });

  } catch (error) {
    console.error("Booking transaction error:", error);

    try {
      await session.abortTransaction();
      await session.endSession();
    } catch (sessionError) {
      console.error("Session error:", sessionError);
    }

    res.status(500).json({
      message: "Booking failed",
      error: error.message
    });
  }
});
// Get bookings by customer email
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const bookings = await Booking.find({
      customerEmail: email
    })
      .populate("eventId")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    console.error("Fetch bookings error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message
    });
  }
});

module.exports = router;