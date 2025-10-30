import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";
import TrainerCalendarView from "./CalendarView";

const StaffTrainerAvailability = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainerSlots, setTrainerSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add token interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    fetchAllTrainers();
  }, []);

  const fetchAllTrainers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BASE_URL}/event/all-trainers-availability`);
      setTrainers(response.data);

      // Update slots if a trainer is already selected
      if (selectedTrainer) {
        const updatedTrainer = response.data.find(
          (t) => t.trainer_id === selectedTrainer.trainer_id
        );
        if (updatedTrainer) {
          setTrainerSlots(updatedTrainer.slots || []);
        }
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
      alert("Failed to fetch trainers availability");
    } finally {
      setLoading(false);
    }
  };

  const handleTrainerSelect = (e) => {
    const trainerId = parseInt(e.target.value);
    if (!trainerId) {
      setSelectedTrainer(null);
      setTrainerSlots([]);
      return;
    }

    const trainer = trainers.find((t) => t.trainer_id === trainerId);
    setSelectedTrainer(trainer);
    setTrainerSlots(trainer.slots || []);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Trainer Availability Management
          </h1>

          {/* Trainer Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Trainer
            </label>
            <select
              onChange={handleTrainerSelect}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
            >
              <option value="">Choose Trainer</option>
              {trainers.map((trainer) => (
                <option key={trainer.trainer_id} value={trainer.trainer_id}>
                  {trainer.fullname} - {trainer.email}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Trainer Details */}
          {selectedTrainer && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Selected Trainer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">
                    {selectedTrainer.fullname}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">
                    {selectedTrainer.email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Mobile:</span>
                  <span className="ml-2 font-medium">
                    {selectedTrainer.mobile_number}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Section */}
        {selectedTrainer ? (
          <TrainerCalendarView
            trainerSlots={trainerSlots}
            trainerId={selectedTrainer.trainer_id}
            fetchAllTrainers={fetchAllTrainers}
          />
        ) : !loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-20 h-20 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg">
              Please select a trainer to view their availability calendar
            </p>
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-6 text-center py-4 text-sm text-slate-600">
          © {new Date().getFullYear()} Eduskills Foundation. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default StaffTrainerAvailability;






// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BASE_URL } from "../../../services/configUrls";
// import BookedDetailsList from "./BookedDetailedList";
// import TrainerCalendarView from "./CalendarView";

// // Main Admin Component
// const StaffTrainerAvailability = () => {
//   const [trainers, setTrainers] = useState([]);
//   const [selectedTrainer, setSelectedTrainer] = useState(null);
//   const [trainerSlots, setTrainerSlots] = useState([]);
//   const [bookedDetails, setBookedDetails] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("calendar");

//   const api = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   api.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("accessToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   useEffect(() => {
//     fetchAllTrainers();
//   }, []);

//   const fetchAllTrainers = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(
//         `${BASE_URL}/event/all-trainers-availability`
//       );
//       setTrainers(response.data);

//       // Update selected trainer's slots if one is selected
//       if (selectedTrainer) {
//         const updatedTrainer = response.data.find(
//           (t) => t.trainer_id === selectedTrainer.trainer_id
//         );
//         if (updatedTrainer) {
//           setTrainerSlots(updatedTrainer.slots || []);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching trainers:", error);
//       alert("Failed to fetch trainers availability");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTrainerBookings = async (trainerId) => {
//     try {
//       const response = await api.get(
//         `${BASE_URL}/event/trainer-booked-details/${trainerId}`
//       );
//       setBookedDetails(response.data.booked_details || []);
//     } catch (error) {
//       console.error("Error fetching trainer bookings:", error);
//       setBookedDetails([]);
//     }
//   };

//   const handleTrainerSelect = (e) => {
//     const trainerId = parseInt(e.target.value);
//     if (!trainerId) {
//       setSelectedTrainer(null);
//       setTrainerSlots([]);
//       setBookedDetails([]);
//       return;
//     }

//     const trainer = trainers.find((t) => t.trainer_id === trainerId);
//     setSelectedTrainer(trainer);
//     setTrainerSlots(trainer.slots || []);
//     fetchTrainerBookings(trainerId);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">
//             Trainer Availability Management
//           </h1>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Trainer
//             </label>
//             <select
//               onChange={handleTrainerSelect}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               disabled={loading}
//             >
//               <option value="">Choose Trainer</option>
//               {trainers.map((trainer) => (
//                 <option key={trainer.trainer_id} value={trainer.trainer_id}>
//                   {trainer.fullname} - {trainer.email}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {selectedTrainer && (
//             <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <h3 className="font-semibold text-gray-800 mb-2">
//                 Selected Trainer Details
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Name:</span>
//                   <span className="ml-2 font-medium">
//                     {selectedTrainer.fullname}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Email:</span>
//                   <span className="ml-2 font-medium">
//                     {selectedTrainer.email}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Mobile:</span>
//                   <span className="ml-2 font-medium">
//                     {selectedTrainer.mobile_number}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {selectedTrainer && (
//           <>
//             <div className="mb-6">
//               <div className="bg-white rounded-xl shadow-lg p-2 inline-flex gap-2">
//                 <button
//                   onClick={() => setActiveTab("calendar")}
//                   className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === "calendar"
//                       ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
//                       : "text-slate-600 hover:bg-slate-100"
//                     }`}
//                 >
//                   Availability Calendar
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("bookings")}
//                   className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === "bookings"
//                       ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
//                       : "text-slate-600 hover:bg-slate-100"
//                     }`}
//                 >
//                   Booking Details
//                 </button>
//               </div>
//             </div>

//             <div>
//               {activeTab === "calendar" ? (
//                 <TrainerCalendarView
//                   trainerSlots={trainerSlots}
//                   bookedDetails={bookedDetails}
//                   trainerId={selectedTrainer.trainer_id}
//                   fetchAllTrainers={fetchAllTrainers}
//                   fetchTrainerBookings={fetchTrainerBookings}
//                 />
//               ) : (
//                 <BookedDetailsList bookedDetails={bookedDetails} />
//               )}
//             </div>
//           </>
//         )}

//         {!selectedTrainer && !loading && (
//           <div className="bg-white rounded-lg shadow-md p-12 text-center">
//             <svg
//               className="w-20 h-20 mx-auto text-gray-300 mb-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//               />
//             </svg>
//             <p className="text-gray-500 text-lg">
//               Please select a trainer to view their availability and bookings
//             </p>
//           </div>
//         )}

//         <div className="mt-6 text-center py-4 text-sm text-slate-600">
//           © {new Date().getFullYear()} Eduskills Foundation. All rights
//           reserved.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StaffTrainerAvailability;
