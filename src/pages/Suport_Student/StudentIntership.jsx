import { useState, useEffect } from "react";
import { CheckCircle, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
// import ConfirmationDialog from "../Alerts/ConfirmationDialog";
// import Alert from "../Alerts/Alert";
import api from "../../api";
import Loader from "../Alerts/Loader";

export default function InternshipSection() {
  const [activeTab, setActiveTab] = useState("completed");
  const [completedInternships, setCompletedInternships] = useState([]);
  const [inProgressInternships, setInProgressInternships] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for confirmation dialog
  // const [confirmOpen, setConfirmOpen] = useState(false);
  // const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  // const [alert, setAlert] = useState({ message: "", color: "" });
  const navigate = useNavigate();
  const { user_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/supports_students/get_internship`, {
          params: { user_id },
        });

        setCompletedInternships(response.data.completed || []);
        setInProgressInternships(response.data.in_progress || []);
      } catch (error) {
        console.error("Error fetching student:", error);
        setCompletedInternships([]);
        setInProgressInternships([]);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchData();
    }
  }, [user_id]);

  // Handler to open confirmation dialog on delete button click
  // const handleDeleteClick = (id) => {
  //   setSelectedDeleteId(id);
  //   setConfirmOpen(true);
  // };

  // Confirm delete action
  // const handleConfirmDelete = async () => {
  //   if (!selectedDeleteId) return;
  //   try {
  //     const response = await api.delete(
  //       `/supports_students/delete_internship`,
  //       {
  //         params: { selectedDeleteId },
  //       }
  //     );
  //     // Assume backend response is { message, color }
  //     setAlert({
  //       message: response.data.message,
  //       color: response.data.color || "green",
  //     });
  //     // Optionally, auto-hide the alert after 3 seconds
  //     setTimeout(() => setAlert({ message: "", color: "" }), 3000);
  //   } catch (error) {
  //     setAlert({ message: "Error deleting internship.", color: "red" });
  //     setTimeout(() => setAlert({ message: "", color: "" }), 3000);
  //     console.error("Error deleting internship:", error);
  //   }
  //   setConfirmOpen(false);
  //   setSelectedDeleteId(null);
  // };

  // Cancel delete action
  // const handleCancelDelete = () => {
  //   setConfirmOpen(false);
  //   setSelectedDeleteId(null);
  // };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 mt-6">
      {/* {alert.message && <Alert message={alert.message} color={alert.color} />} */}
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("inProgress")}
          className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 ${
            activeTab === "inProgress"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
        >
          <BookOpen size={18} />
          Incomplete ({inProgressInternships.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex items-center gap-2 px-4 py-2 font-medium border-b-2 ${
            activeTab === "completed"
              ? "border-green-600 text-green-600"
              : "border-transparent text-gray-500"
          }`}
        >
          <CheckCircle size={18} />
          Completed ({completedInternships.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "completed" && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Completed Internships</h2>
          {loading ? <Loader /> : null}
          {completedInternships.map((intern) => (
            <div
              key={intern.id}
              onClick={() =>
                navigate(
                  `/internship_details/${intern.id}?user_id=${user_id}&tab=internships`
                )
              }
              className="flex items-center gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition mb-3 bg-gray-50 hover:cursor-pointer"
            >
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  {intern.title}
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium">{intern.cohort}</span>
                </p>
                <p className="text-gray-600">
                  Grade: <span className="font-medium">{intern.grade}</span>
                </p>
              </div>
              {/* <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation triggered by parent div
                  handleDeleteClick(intern.id);
                }}
                className="p-2 rounded-full hover:bg-red-600 transition flex items-center justify-center"
                title="Delete"
              >
                <Trash2 className="text-red-600 hover:text-white" size={18} />
              </button> */}
            </div>
          ))}
        </div>
      )}

      {activeTab === "inProgress" && (
        <div>
          <h2 className="text-lg font-semibold mb-3">
            In Progress Internships
          </h2>
          {loading ? <Loader /> : null}
          {inProgressInternships.map((intern) => (
            <div
              key={intern.id}
              onClick={() =>
                navigate(
                  `/internship_details/${intern.id}?user_id=${user_id}&tab=internships`
                )
              }
              className="flex items-center gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition mb-3 bg-gray-50 hover:cursor-pointer"
            >
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <BookOpen className="text-blue-500" size={16} />
                  {intern.title}
                </h3>
                <p className="text-gray-600">
                  <span className="font-medium">{intern.cohort}</span>
                </p>
                <p className="text-gray-600">
                  Grade: <span className="font-medium">{intern.grade}</span>
                </p>
              </div>
              {/* <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation triggered by parent div
                  handleDeleteClick(intern.id);
                }}
                className="p-2 rounded-full hover:bg-red-600 transition flex items-center justify-center"
                title="Delete"
              >
                <Trash2 className="text-red-600 hover:text-white" size={18} />
              </button> */}
            </div>
          ))}
        </div>
      )}

      {/* ConfirmationDialog usage */}
      {/* <ConfirmationDialog
        isOpen={confirmOpen}
        title="Delete Confirmation"
        message="Are you sure you want to delete this internship?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      /> */}
    </div>
  );
}
