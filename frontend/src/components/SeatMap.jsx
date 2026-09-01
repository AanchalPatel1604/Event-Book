import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SeatMap({ event }) {
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [message, setMessage] = useState("");

  const totalSeats = event.totalSeats;
  const bookedSeats = event.bookedSeats || [];
  const price = event.price;

  // Create seats: A1-A10, B1-B10, C1-C10...
  const seats = [];

  const rows = Math.ceil(totalSeats / 10);

  for (let row = 0; row < rows; row++) {
    const rowLetter = String.fromCharCode(65 + row);

    for (let number = 1; number <= 10; number++) {
      if (seats.length < totalSeats) {
        seats.push(`${rowLetter}${number}`);
      }
    }
  }

  // Select / unselect seat
  const toggleSeat = (seat) => {
    // Don't allow already booked seats
    if (bookedSeats.includes(seat)) {
      return;
    }

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(
        selectedSeats.filter((item) => item !== seat)
      );
    } else {
      setSelectedSeats([
        ...selectedSeats,
        seat
      ]);
    }
  };

  // Calculate total price
  const totalAmount = selectedSeats.length * price;

  // Confirm booking
  const handleBooking = async () => {
    if (!customerName || !customerEmail) {
      setMessage("Please enter your name and email.");
      return;
    }

    if (selectedSeats.length === 0) {
      setMessage("Please select at least one seat.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          eventId: event._id,
          customerName: customerName,
          customerEmail: customerEmail,
          seats: selectedSeats
        }
      );

      // Create booking data for confirmation page
      const bookingData = {
        ...response.data.booking,
        eventName: event.name
      };

      // Go to confirmation page
      navigate("/confirmation", {
        state: {
          booking: bookingData
        }
      });

    } catch (error) {
      console.error("Booking error:", error);

      setMessage(
        error.response?.data?.message ||
        "Booking failed. Please try again."
      );
    }
  };

  return (
    <div className="seat-container">

      <h2>Select Your Seats</h2>

      {/* Stage */}
      <div className="stage">
        🎤 STAGE
      </div>

      {/* Seat Map */}
      <div className="seat-map">

        {seats.map((seat) => {

          const isBooked = bookedSeats.includes(seat);
          const isSelected = selectedSeats.includes(seat);

          return (
            <button
              key={seat}
              className={`seat ${
                isBooked
                  ? "booked"
                  : isSelected
                  ? "selected"
                  : "available"
              }`}
              onClick={() => toggleSeat(seat)}
              disabled={isBooked}
            >
              {seat}
            </button>
          );
        })}

      </div>

      {/* Legend */}
      <div className="legend">

        <span>
          🟢 Available
        </span>

        <span>
          🔵 Selected
        </span>

        <span>
          🔴 Booked
        </span>

      </div>

      {/* Customer Details */}
      <div className="customer-form">

        <h3>Your Details</h3>

        <input
          type="text"
          placeholder="Your Name"
          value={customerName}
          onChange={(e) =>
            setCustomerName(e.target.value)
          }
        />

        <input
          type="email"
          placeholder="Your Email"
          value={customerEmail}
          onChange={(e) =>
            setCustomerEmail(e.target.value)
          }
        />

      </div>

      {/* Booking Summary */}
      <div className="booking-summary">

        <h3>Booking Summary</h3>

        <p>
          Selected Seats:{" "}
          {selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "None"}
        </p>

        <p>
          Number of Seats: {selectedSeats.length}
        </p>

        <h2>
          Total: ₹{totalAmount}
        </h2>

        <button
          className="confirm-button"
          onClick={handleBooking}
          disabled={
            selectedSeats.length === 0 ||
            !customerName ||
            !customerEmail
          }
        >
          Confirm Booking
        </button>

        {/* Error message */}
        {message && (
          <p className="booking-message">
            {message}
          </p>
        )}

      </div>

    </div>
  );
}

export default SeatMap;