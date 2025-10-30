import React, { useState, useRef } from "react";
import { Download, MapPin, Calendar, Clock, Users } from "lucide-react";

const MovieTicketBooking = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTicket, setShowTicket] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const ticketRef = useRef(null);

  const movie = {
    title: "Avengers: Infinity War",
    poster:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=400&fit=crop",
    theater: "PVR Cinemas",
    location: "Phoenix Mall, Bangalore",
    date: "July 15, 2025",
    time: "7:30 PM",
    screen: "Screen 3",
    language: "English",
    format: "IMAX 3D",
  };

  const seatRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;
  const seatPrice = 350;

  const generateQRCode = (data) => {
    // Simple QR code generation using a public API
    const qrData = encodeURIComponent(JSON.stringify(data));
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
  };

  const toggleSeat = (row, seatNumber) => {
    const seatId = `${row}${seatNumber}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const isSeatSelected = (row, seatNumber) => {
    return selectedSeats.includes(`${row}${seatNumber}`);
  };

  const isSeatBooked = (row, seatNumber) => {
    // Mock some booked seats
    const bookedSeats = ["A5", "A6", "B3", "B8", "C7", "D2", "E9", "F4"];
    return bookedSeats.includes(`${row}${seatNumber}`);
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    const booking = {
      bookingId: "BMS" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      movie: movie.title,
      theater: movie.theater,
      location: movie.location,
      date: movie.date,
      time: movie.time,
      screen: movie.screen,
      seats: selectedSeats,
      totalAmount: selectedSeats.length * seatPrice,
      bookingTime: new Date().toLocaleString(),
      language: movie.language,
      format: movie.format,
    };

    setBookingData(booking);
    setShowTicket(true);
  };

  const downloadTicket = async () => {
    const element = ticketRef.current;
    if (!element) return;

    try {
      // Method 1: Use html2canvas from CDN
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

      script.onload = async () => {
        const canvas = await window.html2canvas(element, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: element.offsetWidth,
          height: element.offsetHeight,
        });

        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `MovieTicket-${bookingData.bookingId}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          },
          "image/png",
          1.0
        );
      };

      script.onerror = () => {
        // Fallback: Create a data URL of the element
        const clone = element.cloneNode(true);
        clone.style.position = "absolute";
        clone.style.top = "-9999px";
        clone.style.left = "-9999px";
        clone.style.width = element.offsetWidth + "px";
        clone.style.height = element.offsetHeight + "px";
        document.body.appendChild(clone);

        setTimeout(() => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = element.offsetWidth * 2;
          canvas.height = element.offsetHeight * 2;
          ctx.scale(2, 2);

          // Draw white background
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, element.offsetWidth, element.offsetHeight);

          // Create image data URL and download
          const dataURL = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = dataURL;
          a.download = `MovieTicket-${bookingData.bookingId}.png`;
          a.click();

          document.body.removeChild(clone);
        }, 100);
      };

      document.head.appendChild(script);
    } catch (error) {
      console.log("Download failed, opening print dialog");
      window.print();
    }
  };

  if (showTicket && bookingData) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div
            ref={ticketRef}
            className="bg-white rounded-lg shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
              <h2 className="text-2xl font-bold text-center">Movie Ticket</h2>
              <p className="text-center text-red-100 mt-1">Booking Confirmed</p>
            </div>

            {/* Movie Details */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  {bookingData.movie}
                </h3>
                <p className="text-gray-600">
                  {bookingData.language} • {bookingData.format}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="font-semibold">{bookingData.theater}</p>
                    <p className="text-gray-600">{bookingData.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="font-semibold">{bookingData.date}</p>
                    <p className="text-gray-600">{bookingData.screen}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="font-semibold">{bookingData.time}</p>
                    <p className="text-gray-600">Show Time</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="font-semibold">
                      {bookingData.seats.join(", ")}
                    </p>
                    <p className="text-gray-600">Seat Numbers</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <img
                    src={generateQRCode(bookingData)}
                    alt="Ticket QR Code"
                    className="w-32 h-32"
                  />
                </div>
              </div>

              {/* Booking Details */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-mono font-semibold">
                    {bookingData.bookingId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-xl text-green-600">
                    ₹{bookingData.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booked on:</span>
                  <span className="text-sm">{bookingData.bookingTime}</span>
                </div>
              </div>
            </div>

            {/* Perforated Edge Effect */}
            <div className="h-4 bg-gray-100 relative">
              <div className="absolute inset-0 flex justify-between items-center px-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-xs text-gray-500">
                Please show this ticket at the theater entrance
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Terms and conditions apply
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={downloadTicket}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Ticket</span>
            </button>
            <button
              onClick={() => {
                setShowTicket(false);
                setSelectedSeats([]);
                setBookingData(null);
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Book Another Show
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-red-600 p-4">
        <h1 className="text-2xl font-bold text-center">BookMyShow</h1>
      </header>

      {/* Movie Info */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-48 h-64 object-cover rounded-lg mx-auto md:mx-0"
            />
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">{movie.title}</h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {movie.theater}, {movie.location}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {movie.date}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {movie.time} • {movie.screen}
                </p>
                <p className="text-yellow-400 font-semibold">
                  {movie.language} • {movie.format}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seat Selection */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-6 text-center">
            Select Your Seats
          </h3>

          {/* Screen */}
          <div className="mb-8">
            <div className="w-full h-4 bg-gradient-to-r from-transparent via-white to-transparent rounded-full mb-2"></div>
            <p className="text-center text-gray-400 text-sm">Screen</p>
          </div>

          {/* Seat Map */}
          <div className="space-y-3 mb-6">
            {seatRows.map((row) => (
              <div key={row} className="flex items-center justify-center gap-2">
                <span className="w-6 text-center text-gray-400">{row}</span>
                <div className="flex gap-1">
                  {[...Array(seatsPerRow)].map((_, seatIndex) => {
                    const seatNumber = seatIndex + 1;
                    const isBooked = isSeatBooked(row, seatNumber);
                    const isSelected = isSeatSelected(row, seatNumber);

                    return (
                      <button
                        key={seatNumber}
                        onClick={() => !isBooked && toggleSeat(row, seatNumber)}
                        disabled={isBooked}
                        className={`w-8 h-8 rounded-t-lg text-xs border-2 transition-all ${
                          isBooked
                            ? "bg-red-600 border-red-600 cursor-not-allowed"
                            : isSelected
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-gray-600 border-gray-500 hover:bg-gray-500"
                        }`}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 text-center text-gray-400">{row}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 border border-gray-500 rounded-t"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 border border-green-500 rounded-t"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 border border-red-600 rounded-t"></div>
              <span>Booked</span>
            </div>
          </div>

          {/* Booking Summary */}
          {selectedSeats.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Selected Seats:</span>
                <span className="font-semibold">
                  {selectedSeats.join(", ")}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span>Total Amount:</span>
                <span className="text-2xl font-bold text-green-400">
                  ₹{selectedSeats.length * seatPrice}
                </span>
              </div>
              <button
                onClick={handleBooking}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Book Tickets ({selectedSeats.length})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieTicketBooking;
