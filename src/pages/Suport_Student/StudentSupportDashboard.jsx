import React, { useState, useEffect } from "react";
import StudentProfile from "./StudentProfile";
import InternshipSection from "./StudentIntership";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function StudentDashboard() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from search params, default to 'profile'
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Whenever activeTab changes, sync it to query params
  useEffect(() => {
    if (searchParams.get("tab") !== activeTab) {
      setSearchParams({ tab: activeTab });
    }
    // eslint-disable-next-line
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 shadow-2xl rounded-2xl bg-gray-50">
      <button
        onClick={() => navigate("/get-student")}
        className="flex items-center gap-2 mb-4 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition"
      >
        <ArrowLeft size={18} />
      </button>
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-5 py-2 font-semibold border-b-2 ${
            activeTab === "profile"
              ? "border-blue-700 text-blue-700"
              : "border-transparent text-gray-600"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("internships")}
          className={`px-5 py-2 font-semibold border-b-2 ${
            activeTab === "internships"
              ? "border-blue-700 text-blue-700"
              : "border-transparent text-gray-600"
          }`}
        >
          Internships
        </button>
      </div>
      <div>
        {activeTab === "profile" && <StudentProfile />}
        {activeTab === "internships" && <InternshipSection />}
      </div>
    </div>
  );
}
