import { useState } from "react";
import axios from "axios";

function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const searchBookings = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.get(
        `http://localhost:5000/api/bookings?email=${encodeURIComponent(email)}`
      );

      setBookings(response.data);

      if (response.data.length === 0) {
        setMessage("No bookings found.");
      }

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
        "Failed to load bookings."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-bookings-page">

      <div className="bookings-header">
        <p>🎟️ EVENTBOOK</p>

        <h1>My Bookings</h1>

        <p>
          Enter your email to find your bookings.
        </p>
      </div>

      <div className="booking-search">

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={searchBookings}>
          Find Bookings
        </button>

      </div>

      {loading && (
        <p className="loading">
          Loading bookings...
        </p>
      )}

      {message && !loading && (
        <p className="booking-message">
          {message}
        </p>
      )}

      <div className="my-booking-list">

        {bookings.map((booking) => (

          <div
            className="my-booking-card"
            key={booking._id}
          >

            <div className="booking-card-top">

              <div>
                <small>EVENT</small>

                <h2>
                  {booking.eventId?.name ||
                    "Event"}
                </h2>
              </div>

              <span className="confirmed">
                ✓ Confirmed
              </span>

            </div>

            <div className="booking-card-details">

              <div>
                <span>📅 Date</span>
                <strong>
                  {booking.eventId?.date || "-"}
                </strong>
              </div>

              <div>
                <span>📍 Venue</span>
                <strong>
                  {booking.eventId?.venue || "-"}
                </strong>
              </div>

              <div>
                <span>💺 Seats</span>
                <strong>
                  {booking.seats.join(", ")}
                </strong>
              </div>

              <div>
                <span>💰 Amount</span>
                <strong>
                  ₹{booking.totalAmount}
                </strong>
              </div>

            </div>

            <div className="booking-id">
              Booking ID: {booking._id}
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyBookings;