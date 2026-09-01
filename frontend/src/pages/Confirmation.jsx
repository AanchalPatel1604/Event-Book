import { useLocation, useNavigate } from "react-router-dom";

function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="confirmation-page">
        <h2>Booking not found</h2>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="ticket">

        <div className="success-icon">
          ✓
        </div>

        <h1>Booking Confirmed!</h1>

        <p className="success-text">
          Your seats have been successfully reserved.
        </p>

        <div className="ticket-details">

          <div>
            <span>Event</span>
            <strong>{booking.eventName}</strong>
          </div>

          <div>
            <span>Customer</span>
            <strong>{booking.customerName}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{booking.customerEmail}</strong>
          </div>

          <div>
            <span>Seats</span>
            <strong>{booking.seats.join(", ")}</strong>
          </div>

          <div>
            <span>Total Amount</span>
            <strong>₹{booking.totalAmount}</strong>
          </div>

          <div>
            <span>Booking ID</span>
            <strong>{booking._id}</strong>
          </div>

        </div>

        <button
          className="home-button"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>

      </div>
    </div>
  );
}

export default Confirmation;