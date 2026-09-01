const mongoose = require("mongoose");
require("dotenv").config();

const Event = require("./models/Event");

const events = [
  {
    name: "Music Festival 2026",
    description: "A spectacular live music festival featuring amazing artists.",
    date: "25 September 2026",
    time: "6:00 PM",
    venue: "City Arena, Delhi",
    price: 999,
    totalSeats: 50,
    bookedSeats: []
  },
  {
    name: "Tech Conference 2026",
    description: "Learn about the latest technologies, AI and software development.",
    date: "10 October 2026",
    time: "10:00 AM",
    venue: "Convention Centre, Delhi",
    price: 1499,
    totalSeats: 50,
    bookedSeats: []
  },
  {
    name: "Comedy Night",
    description: "Enjoy an evening full of laughter and entertainment.",
    date: "18 October 2026",
    time: "7:30 PM",
    venue: "Grand Theatre, Mumbai",
    price: 799,
    totalSeats: 40,
    bookedSeats: []
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected ✅");

    await Event.deleteMany({});

    await Event.insertMany(events);

    console.log("Events added successfully 🎉");

    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

seedDatabase();