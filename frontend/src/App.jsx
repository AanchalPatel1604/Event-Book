import { useEffect, useState } from "react";
import axios from "axios";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import EventDetails from "./pages/EventDetails";
import SeatSelection from "./pages/SeatSelection";
import Confirmation from "./pages/Confirmation";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/login";

import "./App.css";


function App() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");


  // ==============================
  // GET EVENTS
  // ==============================

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);


  // ==============================
  // SEARCH EVENTS
  // ==============================

  const filteredEvents = events.filter((event) => {
    const search = searchText.toLowerCase();

    return (
      event.name.toLowerCase().includes(search) ||
      event.description.toLowerCase().includes(search) ||
      event.venue.toLowerCase().includes(search)
    );
  });


  // ==============================
  // GO TO EVENTS
  // ==============================

  const goToEvents = () => {
    const eventsSection = document.getElementById("events");

    if (eventsSection) {
      eventsSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };


  return (
    <div className="app">


      {/* ==============================
          NAVBAR
      ============================== */}

      <nav className="navbar">

        {/* LOGO */}

        <button
          className="logo-button"
          onClick={() => navigate("/")}
        >
          🎟️ EventBook
        </button>


        {/* NAVIGATION */}

        <div className="nav-links">

          <button
            className="nav-link-button"
            onClick={() => navigate("/")}
          >
            Home
          </button>


          <button
            className="nav-link-button"
            onClick={goToEvents}
          >
            Events
          </button>


          <button
            className="nav-link-button"
            onClick={() => navigate("/bookings")}
          >
            My Bookings
          </button>


          <button
            className="login-button"
            onClick={() =>
              navigate("/login")}
            
          >
            Login
          </button>

        </div>

      </nav>



      {/* ==============================
          HERO
      ============================== */}

      <section className="hero">

        <div>

          <p className="hero-small">
            YOUR NEXT EXPERIENCE STARTS HERE
          </p>


          <h1>
            Book Your
            <br />
            <span>Experience 🎉</span>
          </h1>


          <p className="hero-text">
            Discover amazing events and reserve
            your favorite seats before they're gone.
          </p>


          <button
            className="hero-button"
            onClick={goToEvents}
          >
            Explore Events
          </button>

        </div>

      </section>



      {/* ==============================
          EVENTS
      ============================== */}

      <section
        className="events-section"
        id="events"
      >

        <div className="section-header">

          <div>

            <p className="section-small">
              DISCOVER
            </p>

            <h2>
              Upcoming Events
            </h2>

          </div>


          {/* SEARCH */}

          <input
            type="text"
            placeholder="🔍 Search events..."
            className="search"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
          />

        </div>



        {/* LOADING */}

        {loading && (
          <p className="loading">
            Loading events...
          </p>
        )}



        {/* EVENT GRID */}

        {!loading && (

          <div className="event-grid">

            {filteredEvents.length > 0 ? (

              filteredEvents.map((event) => (

                <div
                  className="event-card"
                  key={event._id}
                >

                  {/* IMAGE */}

                  <div className="event-image">
                    🎟️
                  </div>


                  {/* CONTENT */}

                  <div className="event-content">

                    <p className="event-date">
                      📅 {event.date}
                    </p>


                    <h3>
                      {event.name}
                    </h3>


                    <p className="description">
                      {event.description}
                    </p>


                    <div className="event-info">

                      <span>
                        📍 {event.venue}
                      </span>

                      <span>
                        🕐 {event.time}
                      </span>

                    </div>


                    <div className="event-bottom">

                      <div>

                        <small>
                          Starting from
                        </small>

                        <strong>
                          ₹{event.price}
                        </strong>

                      </div>


                      {/* BOOK NOW */}

                      <button
                        onClick={() =>
                          navigate("/event", {
                            state: {
                              event: event,
                            },
                          })
                        }
                      >
                        Book Now →
                      </button>

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <p className="loading">
                No events found.
              </p>

            )}

          </div>

        )}

      </section>

    </div>
  );
}



/* ======================================
   ROUTER
====================================== */

function AppWithRouter() {

  return (

    <BrowserRouter>

      <Routes>


        {/* HOME */}

        <Route
          path="/"
          element={<App />}
        />


        {/* EVENT DETAILS */}

        <Route
          path="/event"
          element={<EventDetails />}
        />


        {/* SEAT SELECTION */}

        <Route
          path="/seats"
          element={<SeatSelection />}
        />
<Route
  path="/login"
  element={<Login />}
/>

        {/* CONFIRMATION */}

        <Route
          path="/confirmation"
          element={<Confirmation />}
        />


        {/* MY BOOKINGS */}

        <Route
          path="/bookings"
          element={<MyBookings />}
        />


      </Routes>

    </BrowserRouter>
  );
}


export default AppWithRouter;