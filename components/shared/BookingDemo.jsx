// pages/BookingDemo.js
import useBookingStore from "@/store/bookingStore";
import { useState, useEffect } from "react";

const BookingDemo = () => {
  const {
    bookingDetails,
    setBookingDetails,
    removeBooking,
    clearBookingDetails,
    getBookingById,
  } = useBookingStore();

  const [newBooking, setNewBooking] = useState({
    id: "",
    name: "",
    date: "",
    service: "",
  });

  const [searchId, setSearchId] = useState("");
  const [searchedBooking, setSearchedBooking] = useState(null);

  // Ensure we always work with an array
  const safeBookingDetails = Array.isArray(bookingDetails)
    ? bookingDetails
    : [];

  // Sample demo data
  const demoBookings = [
    {
      id: "1",
      name: "John Doe",
      date: "2023-06-15",
      service: "Haircut",
    },
    {
      id: "2",
      name: "Jane Smith",
      date: "2023-06-16",
      service: "Manicure",
    },
    {
      id: "3",
      name: "Bob Johnson",
      date: "2023-06-17",
      service: "Massage",
    },
  ];

  // Load demo data
  const handleAddDemoData = () => {
    demoBookings.forEach((booking) => {
      setBookingDetails(booking);
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new booking
  const handleAddBooking = (e) => {
    e.preventDefault();
    if (
      !newBooking.id ||
      !newBooking.name ||
      !newBooking.date ||
      !newBooking.service
    ) {
      alert("Please fill all fields");
      return;
    }

    // Check if ID already exists
    if (safeBookingDetails.some((booking) => booking.id === newBooking.id)) {
      alert("Booking with this ID already exists");
      return;
    }

    setBookingDetails(newBooking);
    setNewBooking({
      id: "",
      name: "",
      date: "",
      service: "",
    });
  };

  // Search booking by ID
  const handleSearch = () => {
    if (!searchId) {
      alert("Please enter an ID to search");
      return;
    }
    const booking = getBookingById(searchId);
    setSearchedBooking(booking || null);
  };

  // Debug current state
  const logCurrentState = () => {
    console.log("Current bookings:", safeBookingDetails);
    console.log("LocalStorage:", localStorage.getItem("booking-storage"));
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#333" }}>Booking Store Demo</h1>

      {/* Debug Section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
        }}
      >
        <button onClick={logCurrentState} style={buttonStyle}>
          Debug State
        </button>
      </div>

      {/* Load Demo Data */}
      <section style={sectionStyle}>
        <h2>Demo Data</h2>
        <button
          onClick={handleAddDemoData}
          style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
        >
          Load Demo Bookings
        </button>
      </section>

      {/* Add New Booking */}
      <section style={sectionStyle}>
        <h2>Add New Booking</h2>
        <form
          onSubmit={handleAddBooking}
          style={{ display: "grid", gap: "15px" }}
        >
          <FormField
            label="ID"
            name="id"
            value={newBooking.id}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Name"
            name="name"
            value={newBooking.name}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Date"
            type="date"
            name="date"
            value={newBooking.date}
            onChange={handleInputChange}
            required
          />
          <FormField
            label="Service"
            name="service"
            value={newBooking.service}
            onChange={handleInputChange}
            required
          />
          <button
            type="submit"
            style={{ ...buttonStyle, backgroundColor: "#2196F3" }}
          >
            Add Booking
          </button>
        </form>
      </section>

      {/* Search Booking */}
      <section style={sectionStyle}>
        <h2>Search Booking</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Enter booking ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={handleSearch}
            style={{ ...buttonStyle, backgroundColor: "#FF9800" }}
          >
            Search
          </button>
        </div>
        {searchedBooking && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#fffde7",
              borderRadius: "5px",
            }}
          >
            <h3>Search Result:</h3>
            <BookingCard booking={searchedBooking} />
            <button
              onClick={() => {
                removeBooking(searchedBooking.id);
                setSearchedBooking(null);
              }}
              style={{
                ...buttonStyle,
                backgroundColor: "#f44336",
                marginTop: "10px",
              }}
            >
              Remove This Booking
            </button>
          </div>
        )}
      </section>

      {/* Current Bookings */}
      <section style={sectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Current Bookings ({safeBookingDetails.length})</h2>
          <button
            onClick={clearBookingDetails}
            style={{ ...buttonStyle, backgroundColor: "#f44336" }}
            disabled={safeBookingDetails.length === 0}
          >
            Clear All
          </button>
        </div>

        {safeBookingDetails.length === 0 ? (
          <p style={{ color: "#666" }}>
            No bookings yet. Add some using the form or load demo data.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {safeBookingDetails.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onRemove={() => removeBooking(booking.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Reusable components
const FormField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required,
}) => (
  <div>
    <label
      style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}
    >
      {label}:
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      style={inputStyle}
    />
  </div>
);

const BookingCard = ({ booking, onRemove }) => (
  <div
    style={{
      padding: "15px",
      backgroundColor: "#f5f5f5",
      borderRadius: "5px",
      borderLeft: "4px solid #2196F3",
    }}
  >
    <p>
      <strong>ID:</strong> {booking.id}
    </p>
    <p>
      <strong>Name:</strong> {booking.name}
    </p>
    <p>
      <strong>Date:</strong> {booking.date}
    </p>
    <p>
      <strong>Service:</strong> {booking.service}
    </p>
    {onRemove && (
      <button
        onClick={onRemove}
        style={{
          ...buttonStyle,
          backgroundColor: "#f44336",
          marginTop: "10px",
        }}
      >
        Remove
      </button>
    )}
  </div>
);

// Style constants
const sectionStyle = {
  marginBottom: "30px",
  padding: "20px",
  backgroundColor: "#fff",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const buttonStyle = {
  padding: "8px 16px",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "14px",
};

const inputStyle = {
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  width: "100%",
  boxSizing: "border-box",
};

export default BookingDemo;
