import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Navigation,
  Camera,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
} from "lucide-react";

const EastBournePineForestResort = () => {
  const [activeImage, setActiveImage] = useState(0);

  // Resort images showcasing different aspects of the property
  const resortImages = [
    {
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Pine Forest Resort Exterior",
      title: "Resort Amidst Pine Forest",
    },
    {
      url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Deluxe Room Interior",
      title: "Deluxe Room with Mountain View",
    },
    {
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Indoor Swimming Pool",
      title: "Indoor Heated Pool & Jacuzzi",
    },
    {
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Vertigo Restaurant",
      title: "Vertigo Multi-Cuisine Restaurant",
    },
    {
      url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Himalayan Mountain Views",
      title: "Stunning Himalayan Views",
    },
    {
      url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Spa and Wellness Center",
      title: "Spa & Wellness Center",
    },
  ];

  const resortInfo = {
    name: "East Bourne-A Pine Forest Resort",
    location: "Khalini, Shimla, Himachal Pradesh",
    address:
      "E Bourne Hotel Rd, Nigam Vihar, Khalini, Shimla, Himachal Pradesh 171002",
    phone: "+91 177 2613333",
    email: "ebourne@rediffmail.com",
    website: "www.eastbourneshimla.com",
    rating: 4.1,
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    // Coordinates for Khalini area, Shimla
    coordinates: {
      lat: 31.0927,
      lng: 77.1773,
    },
  };

  const amenities = [
    { icon: Wifi, text: "Free Wi-Fi", color: "text-blue-500" },
    { icon: Car, text: "Free Parking", color: "text-green-500" },
    { icon: Waves, text: "Indoor Pool & Jacuzzi", color: "text-cyan-500" },
    {
      icon: Utensils,
      text: "Multi-Cuisine Restaurant",
      color: "text-orange-500",
    },
    { icon: Dumbbell, text: "Fitness Center & Spa", color: "text-purple-500" },
    { icon: Phone, text: "24/7 Front Desk", color: "text-red-500" },
  ];

  const nearbyAttractions = [
    { name: "Mall Road", distance: "5 km" },
    { name: "The Ridge", distance: "5 km" },
    { name: "Christ Church", distance: "5 km" },
    { name: "Bishop Cotton School", distance: "Near by" },
    { name: "Kufri", distance: "16 km" },
    { name: "Shimla Railway Station", distance: "6 km" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-3xl  text-gray-800 mb-2 flex items-center justify-center gap-3 flex-wrap">
            <MapPin className="text-emerald-600" size={40} />
            {resortInfo.name}
          </h1>
          <p className="text-xl text-gray-600 mb-2">{resortInfo.location}</p>
          <p className="text-sm text-gray-500 italic">
            A Pine Forest Retreat in the Queen of Hills
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Navigation size={28} />
                Location & Directions
              </h2>
              <p className="mt-2 opacity-90">
                Located in the serene Khalini area, near Bishop Cotton School
              </p>
            </div>

            <div className="p-6">
              {/* Google Maps Embed for the specific location */}
              <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg mb-6">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3416.741407964694!2d77.1748376!3d31.089119300000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390578b9b1a37f3d%3A0x104cdd7da0063365!2sHotel%20East%20Bourne!5e0!3m2!1sen!2sin!4v1755169971323!5m2!1sen!2sin`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="East Bourne-A Pine Forest Resort Location"
                ></iframe>
              </div>

              {/* Contact Information */}
              {/* <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin
                    className="text-emerald-600 mt-1 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Complete Address
                    </p>
                    <p className="text-gray-600 text-sm">
                      {resortInfo.address}
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Nearby Attractions */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Nearby Attractions
            </h3>
            <div className="space-y-3">
              {nearbyAttractions.map((attraction, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                >
                  <span className="text-gray-700 font-medium">
                    {attraction.name}
                  </span>
                  <span className="text-blue-600 font-semibold bg-white px-2 py-1 rounded-full text-sm">
                    {attraction.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EastBournePineForestResort;
