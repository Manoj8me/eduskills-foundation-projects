// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api";

// const SearchStudent = () => {
//   const [query, setQuery] = useState("");
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);

//   const navigate = useNavigate();

//   const fetchStudents = async (email) => {
//     setLoading(true);
//     try {
//       const response = await api.get("/supports_students/search_students", {
//         params: { email },
//       });
//       setStudents(response.data);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     setHasSearched(true);
//     if (query.trim()) {
//       fetchStudents(query);
//     } else {
//       setStudents([]);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-6 w-full max-w-md mx-auto">
//       <div className="w-full mb-4 flex">
//         <input
//           type = "email"
//           placeholder="Search student by email..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="w-full px-4 py-2 border rounded-2xl shadow-sm 
//                      focus:outline-none focus:ring-2 focus:ring-blue-500" required
//         />
//         <button
//           type="button"
//           onClick={handleSearch}
//           className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-2xl shadow-sm hover:bg-blue-600 transition-colors"
//         >
//           Search
//         </button>
//       </div>

//       <div className="w-full bg-white rounded-2xl shadow-md divide-y divide-gray-200">
//         {loading ? (
//           <p className="px-4 py-2 text-gray-500 animate-pulse">Loading...</p>
//         ) : hasSearched ? (
//           students.length > 0 ? (
//             students.map((student) => (
//               <div
//                 key={student.user_id}
//                 className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
//                 onClick={() => navigate(`/student/${student.user_id}`)}
//               >
//                 {student.email}
//               </div>
//             ))
//           ) : (
//             <p className="px-4 py-2 text-gray-500">No students found</p>
//           )
//         ) : null}
//       </div>
//     </div>
//   );
// };

// export default SearchStudent;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const SearchStudent = () => {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchStudents = async (email) => {
    setLoading(true);
    try {
      const response = await api.get("/supports_students/search_students", {
        params: { email },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
      setError("Error fetching students.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    // Simple email regex pattern for validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSearch = () => {
  setHasSearched(true);
  if (!query.trim()) {
    setError("Please enter an email.");
    setTimeout(() => setError(""), 3000);
    setStudents([]);
    return; // Prevent further execution
  }
  if (!validateEmail(query.trim())) {
    setError("Please enter a valid email address.");
    setTimeout(() => setError(""), 3000);
    setStudents([]);
    return; // Prevent further execution so fetchStudents is NOT called
  }
  fetchStudents(query.trim());
};


  return (
    <div className="flex flex-col items-center p-6 w-full max-w-md mx-auto">
        {error && (
        <p className="text-red-500 mb-2">{error}</p>
      )}
      <div className="w-full mb-4 flex">
        <input
          type="email"
          placeholder="Search student by email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-2xl shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="button"
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-2xl shadow-sm hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>

      

      <div className="w-full bg-white rounded-2xl shadow-md divide-y divide-gray-200">
        {loading ? (
          <p className="px-4 py-2 text-gray-500 animate-pulse">Loading...</p>
        ) : hasSearched ? (
          students.length > 0 ? (
            students.map((student) => (
              <div
                key={student.user_id}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/student/${student.user_id}`)}
              >
                {student.email}
              </div>
            ))
          ) : (
            <p className="px-4 py-2 text-gray-500">No students found</p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default SearchStudent;
