import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SeatMap from "../components/SeatMap";

function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEvent = location.state?.event;

  const [event, setEvent] = useState(initialEvent);

  useEffect(() => {
    if (!initialEvent?._id) {
      return;
    }

    axios
      .get(`http://localhost:5000/api/events/${initialEvent._id}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Error loading event:", error);
      });
  }, [initialEvent?._id]);

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
    <div className="seat-page">

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="seat-header">

        <p>🎟️ {event.name}</p>

        <h1>Select Your Seats</h1>

        <p>
          📅 {event.date} | 📍 {event.venue}
        </p>

      </div>

      <SeatMap event={event} />

    </div>
  );
}

export default SeatSelection;