import { useLocation, useNavigate } from "react-router-dom";

function EventDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const event = location.state?.event;

  if (!event) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Event not found</h2>
        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      <div className="details-card">
        <div className="details-icon">🎟️</div>

        <div>
          <p className="event-date">📅 {event.date}</p>

          <h1>{event.name}</h1>

          <p className="details-description">
            {event.description}
          </p>

          <p>📍 {event.venue}</p>
          <p>🕐 {event.time}</p>

          <h2>₹{event.price} / seat</h2>

          <button
            className="select-seat-button"
            onClick={() => navigate("/seats", { state: { event } })}
          >
            Select Seats →
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;