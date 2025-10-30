import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import api from "../../api";
import Alert from "../Alerts/Alert";
import ConfirmationDialog from "../Alerts/ConfirmationDialog";
import EditNamePopup from "./EditNamePopup";

const gradeOptions = ["O", "E", "A", "B", "C", "D", "P", "F"];

const IntershipDetailTable = () => {
  const navigate = useNavigate();
  const { internship_id } = useParams();
  const [searchParams] = useSearchParams();
  const [editMode, setEditMode] = useState(false);
  const [allDomainCohorts, setAllDomainCohorts] = useState({
    domains: [],
    cohorts: [],
  });
  const { user_id } = useParams();
  const [alert, setAlert] = useState({ message: "", color: "" });
  const [confirmOpenDialoge, setConfirmOpenDialoge] = useState(false);
  const [titleConfirm, setTitleConfirm] = useState("");
  const [messageConfirm, setMessageConfirm] = useState("");
  const [functionConfirm, setFunctionConfirm] = useState(() => () => {});
  const [editName, setEditName] = useState(false);
  // const [emailData, setEmaildata] = useState({})
  const [nameRes, setNameRes] = useState({});

  const tab = searchParams.get("tab") || "profile";
  const query_user_id = searchParams.get("user_id");

  const [data, setData] = useState({
    domain_id: "",
    domainName: "",
    cohort: "",
    cohort_id: "",
    internshipApproval: "",
    internshipAccess: "",
    url: "",
    certUploadProgress: "",
    certVerification: "",
    finalCertIssue: "",
    grade: "",
  });
  const [issuedcert, setIssuedcert] = useState("");

  const curDomainRef = useRef();
  const curCohortRef = useRef();
  const urlRef = useRef();
  const gradeRef = useRef();

  // Fetch interships
  const fetch_details = async (internship_id) => {
    try {
      const [internshipRes, certificateRes, nameres] = await Promise.all([
        api.get("/supports_students/get_intership_details", {
          params: { internship_id },
        }),
        api.get(`/supports_students/certificate_issue_status/${internship_id}`),
        api.get(`/supports_students/get_student/${internship_id}`),
      ]);

      setData(internshipRes.data);
      setIssuedcert(certificateRes.data.buttons);
      setNameRes(nameres.data || {});
    } catch (err) {
      console.error("Error fetching data: " + err);
    }
  };

  useEffect(() => {
    if (internship_id) {
      fetch_details(internship_id);
    }
  }, [internship_id]);

  // Sync refs after fetching new data
  useEffect(() => {
    if (data) {
      if (curDomainRef.current)
        curDomainRef.current.value = data.domain_id || "";
      if (curCohortRef.current)
        curCohortRef.current.value = data.cohort_id || "";
      if (urlRef.current) urlRef.current.value = data.url || "";
      if (gradeRef.current) gradeRef.current.value = data.grade || "";
    }
  }, [data]);

  const handleSave = async () => {
    const updatedData = {
      domain_id: curDomainRef.current.value,
      cohort_id: curCohortRef.current.value,
      url: urlRef.current.value,
      grade: gradeRef.current.value,
    };

    try {
      const res = await api.put(
        "/supports_students/update_internship",
        updatedData,
        {
          params: { internship_id: internship_id },
        }
      );
      setAlert({ message: res.data.message, color: res.data.color || "green" });
      setTimeout(() => setAlert({ message: "", color: "" }), 3000);
    } catch (err) {
      console.error("Error updating internship details: " + err);
    }
    fetch_details(internship_id);
    setEditMode(false);
  };

  // Handler to save new name from popup
  const handleOnSave = async ({ firstName, lastName }) => {
    // setUserName({ firstName, lastName });

    // Api integration here
    try {
      const res = await api.put("/supports_students/edit_student_name", null, {
        params: {
          email: nameRes.email,
          eventId: nameRes.eventid,
          firstname: firstName,
          lastname: lastName,
        },
      });
      setAlert({ message: res.data.message, color: res.data.color || "green" });
      setTimeout(() => setAlert({ message: "", color: "" }), 3000);
      fetch_details(internship_id);
    } catch (err) {
      console.error("Error updating internship details: " + err);
    }
    setEditName(false);
    return;
  };

  useEffect(() => {
    const fetch_domains_cohots = async () => {
      try {
        const res = await api.get("/supports_students/get_all_domains_cohorts");
        setAllDomainCohorts(res.data);
      } catch (err) {
        console.error("Error fetching intership detail :" + err);
      }
    };

    fetch_domains_cohots();
  }, [internship_id]);

  const approve_interships = async (internship_id) => {
    try {
      const res = await api.put("/supports_students/approve-internship", null, {
        params: { internship_id: internship_id },
      });
      setConfirmOpenDialoge(false);
      setAlert({ message: res.data.message, color: res.data.color || "green" });
      setTimeout(() => setAlert({ message: "", color: "" }), 3000);
      // Refresh
      fetch_details(internship_id);
    } catch (err) {
      console.error("Approved intership :" + err);
    }
  };

  const handleCertificateIssue = async (internship_id) => {
    try {
      const res = await api.post(
        `/supports_students/issue_certificate/${internship_id}`
      );
      setConfirmOpenDialoge(false);
      setAlert({ message: res.data.message, color: res.data.color || "green" });
      setTimeout(() => setAlert({ message: "", color: "" }), 3000);
      // Refresh
      fetch_details(internship_id);
    } catch (err) {
      console.error(err);
    }
  };

  const give_intership_access = async (internship_id) => {
    try {
      const res = await api.put("/supports_students/internship-access", null, {
        params: { internship_id: internship_id },
      });
      setConfirmOpenDialoge(false);
      setAlert({ message: res.data.message, color: res.data.color || "green" });
      setTimeout(() => setAlert({ message: "", color: "" }), 3000);
      // Refresh
      fetch_details(internship_id);
    } catch (err) {
      console.error("Error intership access given :" + err);
    }
  };

  const verifyCertificate = async (internship_id) => {
    try {
      const res = await api.put(
        "/supports_students/verify-course-completion_2",
        null,
        { params: { internship_id } }
      );
      setConfirmOpenDialoge(false);
      setAlert({ message: res.data.message, color: res.data.color || "green" });
      setTimeout(() => setAlert({ message: "", color: "" }), 3000);
      fetch_details(internship_id);
    } catch (err) {
      console.error("Error All certificate verification :" + err);
    }
  };

  const [detailsData, setDetailsData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [intershipId, setInternshipId] = useState({
    internship_id: null,
    course_completion_id: null,
  });

  const handleShowDetails = async (internship_id) => {
    try {
      const res = await api.get("/supports_students/course-completions_2", {
        params: { internship_id },
      });

      setDetailsData(res.data);
      setShowDetails(true);
    } catch (err) {
      console.error("Error fetching course details: " + err);
    }
  };

  const handleCancel = () => {
    fetch_details(internship_id); // reload original values
    setEditMode(false);
  };

  // Handler to open confirmation dialog on cancel button click
  const handleCancelClick = () => {
    setConfirmOpenDialoge(false);
  };

  //  Confirm popup for Verify
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleVerifyClick = (internship_id, cc_id) => {
    setConfirmOpen(true);
    setInternshipId({
      internship_id: internship_id,
      course_completion_id: cc_id,
    });
  };
  const handleConfirmYes = async () => {
    try {
      const res = await api.put(
        "/supports_students/verify-course-completion",
        null,
        {
          params: {
            internship_id: intershipId.internship_id,
            course_completion_id: intershipId.course_completion_id,
          },
        }
      );

      setConfirmOpen(false);
      setAlert({ message: res.data.message, color: res.data.color || "green" });
      setTimeout(() => setAlert({ message: "", color: "" }), 3000);
      // Refetch
      handleShowDetails(internship_id);
      fetch_details(internship_id);
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };
  const handleConfirmNo = () => setConfirmOpen(false);

  const ConfirmPopup = ({ open, onYes, onNo }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
        <div className="bg-white p-6 rounded shadow-md w-[320px]">
          <h3 className="text-lg font-semibold mb-4">
            Are you sure you want to verify this certificate?
          </h3>
          <div className="flex justify-end gap-3">
            <button
              onClick={onNo}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onYes}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    );
  };

  // View Details popup component:
  const DetailsPopup = ({ open, onClose, details }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded shadow p-6 min-w-[450px] max-w-[90vw] relative">
          <h3 className="text-lg font-semibold mb-3">Certificates Details</h3>
          {showDetails && alert.message && (
            <Alert message={alert.message} color={alert.color} />
          )}
          <table className="w-full border border-gray-300 mb-3">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Course Name</th>
                <th className="border p-2 text-left">Uploaded URL</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Reason</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {details.map((course, idx) => (
                <tr key={course.course_id || idx}>
                  <td className="border p-2 max-w-xs break-words whitespace-normal">
                    {course.course_name}
                  </td>

                  <td className="border p-2 max-w-xs break-words whitespace-normal">
                    <a
                      href={course.uploaded_url}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {course.uploaded_url}
                    </a>
                  </td>
                  <td className="border p-2">{course.status}</td>
                  <td className="border p-2">{course.reason}</td>
                  <td className="border p-2">
                    {(course.status === "uploaded not verified" ||
                      course.status === "uploaded but rejected") && (
                      <button
                        onClick={() =>
                          handleVerifyClick(internship_id, course.id)
                        }
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-gray-500 hover:text-blue-600 text-3xl rounded focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Confirm Popup */}
      <ConfirmPopup
        open={confirmOpen}
        onYes={handleConfirmYes}
        onNo={handleConfirmNo}
      />

      <DetailsPopup
        open={showDetails}
        onClose={() => setShowDetails(false)}
        details={detailsData}
      />
      <button
        onClick={() => navigate(`/student/${query_user_id}?tab=${tab}`)}
        className="flex items-center gap-2 mb-4 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition"
      >
        <ArrowLeft size={18} />
      </button>
      {!showDetails
        ? alert.message && <Alert message={alert.message} color={alert.color} />
        : ""}
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Internship Status Table</h2>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
        ) : (
          <div>
            <button
              onClick={handleSave}
              className="mr-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Field</th>
            <th className="border p-3 text-left">Value</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Domain Name */}
          <tr>
            <td className="border p-3 font-semibold">Domain Name</td>
            <td className="border p-3">{data.domainName}</td>
            <td className="border p-3">
              {editMode ? (
                <select
                  defaultValue={data?.domain_id || ""}
                  ref={curDomainRef}
                  className="border rounded p-1 w-full"
                >
                  <option value="">Select Domains</option>
                  {allDomainCohorts.domains.map((s) => (
                    <option key={s.domain_id} value={s.domain_id}>
                      {s.domain_name}
                    </option>
                  ))}
                </select>
              ) : (
                <em>---</em>
              )}
            </td>
          </tr>

          {/* Cohort */}
          <tr>
            <td className="border p-3 font-semibold">Cohort</td>
            <td className="border p-3">{data.cohort}</td>
            <td className="border p-3">
              {editMode ? (
                <select
                  defaultValue={data?.cohort_id || ""}
                  ref={curCohortRef}
                  className="border rounded p-1 w-full"
                >
                  <option value="">Select Domains</option>
                  {allDomainCohorts.cohorts.map((s) => (
                    <option key={s.cohort_id} value={s.cohort_id}>
                      {s.cohort_name}
                    </option>
                  ))}
                </select>
              ) : (
                <em>---</em>
              )}
            </td>
          </tr>

          {/* URL (Google) */}
          <tr>
            <td className="border p-3 font-semibold">URL (Google)</td>
            <td className="border p-3">
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {data.url}
              </a>
            </td>
            <td className="border p-3">
              {editMode ? (
                <input
                  type="url"
                  defaultValue={data.url || ""}
                  ref={urlRef}
                  className="border p-1 rounded w-full"
                />
              ) : (
                <em>---</em>
              )}
            </td>
          </tr>

          {/* Grade */}
          <tr>
            <td className="border p-3 font-semibold">Grade</td>
            <td className="border p-3">{data.grade}</td>
            <td className="border p-3">
              {editMode ? (
                <select
                  key={data.grade} // Force re-render when data.grade changes
                  defaultValue={data.grade || ""}
                  ref={gradeRef}
                  className="border p-1 rounded"
                >
                  <option value="">Select Grade</option>
                  {gradeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <em>---</em>
              )}
            </td>
          </tr>

          {/* Internship Approval */}
          <tr>
            <td className="border p-3 font-semibold">Internship Approval</td>
            <td className="border p-3">{data.internshipApproval}</td>
            <td className="border p-3">
              {editMode ? (
                <em>---</em>
              ) : data.internshipApproval === "Approved" ? (
                <button
                  onClick={() => {
                    setTitleConfirm("Refuse Internship Approval");
                    setMessageConfirm(
                      "Are you sure you want to refuse this internship approval?"
                    );
                    setFunctionConfirm(
                      () => () => approve_interships(internship_id)
                    );
                    setConfirmOpenDialoge(true);
                  }}
                  className="px-1 py-1 bg-red-400 text-white rounded hover:bg-red-700 transition"
                >
                  Refuse
                </button>
              ) : (
                <button
                  onClick={() => {
                    setTitleConfirm("Internship Approval");
                    setMessageConfirm(
                      "Are you sure you want to approve this internship?"
                    );
                    setFunctionConfirm(
                      () => () => approve_interships(internship_id)
                    );
                    setConfirmOpenDialoge(true);
                  }}
                  className="px-1 py-1 bg-green-400 text-white rounded hover:bg-green-700 transition"
                >
                  Approve
                </button>
              )}

              {}
            </td>
          </tr>

          {/* Internship Access */}
          <tr>
            <td className="border p-3 font-semibold">Internship Access</td>
            <td className="border p-3">{data.internshipAccess}</td>
            <td className="border p-3">
              {editMode ? (
                <em>---</em>
              ) : data.internshipAccess === "Given" ? (
                <button
                  onClick={() => {
                    setTitleConfirm("Deny Internship Access");
                    setMessageConfirm("Are you sure you want to deny access?");
                    setFunctionConfirm(
                      () => () => give_intership_access(internship_id)
                    );
                    setConfirmOpenDialoge(true);
                  }}
                  className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-700 transition"
                >
                  Deny
                </button>
              ) : (
                <button
                  onClick={() => {
                    setTitleConfirm("Give Internship Access");
                    setMessageConfirm("Are you sure you want to give access?");
                    setFunctionConfirm(
                      () => () => give_intership_access(internship_id)
                    );
                    setConfirmOpenDialoge(true);
                  }}
                  className="px-2 py-1 bg-green-400 text-white rounded hover:bg-green-700 transition"
                >
                  Give
                </button>
              )}
            </td>
          </tr>

          {/* Certificate Upload Progress */}
          <tr>
            <td className="border p-3 font-semibold">
              Certificate Upload Progress
            </td>
            <td className="border p-3">{data.certUploadProgress}</td>
            <td className="border p-3">
              {editMode ? (
                <em>---</em>
              ) : (
                <em>
                  <button
                    onClick={() => handleShowDetails(internship_id)}
                    className="px-2 py-1 bg-cyan-400 text-white rounded hover:bg-cyan-700 transition"
                  >
                    view
                  </button>
                </em>
              )}
            </td>
          </tr>

          {/* Certificate Verification */}
          <tr>
            <td className="border p-3 font-semibold">
              Certificate Verification
            </td>
            <td className="border p-3">{data.certVerification}</td>
            <td className="border p-3">
              {editMode ? (
                <em>---</em>
              ) : (
                <div className="flex gap-4">
                  {data.certVerification === "Not Verified" ? (
                    <button
                      onClick={() => {
                        setTitleConfirm("Verify All Certificates");
                        setMessageConfirm(
                          "Are you sure you want to verify All?"
                        );
                        setFunctionConfirm(
                          () => () => verifyCertificate(internship_id)
                        );
                        setConfirmOpenDialoge(true);
                      }}
                      className="px-2 py-1 bg-green-400 text-white rounded hover:bg-green-700 transition"
                    >
                      Verify
                    </button>
                  ) : (
                    <em>---</em>
                  )}
                </div>
              )}
            </td>
          </tr>

          {/* Issue Certificates */}
          <tr>
            <td className="border p-3 font-semibold">Certificate Issue</td>
            <td className="border p-3">
              {issuedcert === "show_issue"
                ? "Not issued"
                : issuedcert === "hide_issue"
                ? "Failed"
                : issuedcert === "edit_name"
                ? `Issued name : ${nameRes.firstname} ${nameRes.lastname}`
                : issuedcert === "hide_all"
                ? "Internship not completed"
                : ""}
            </td>
            <td className="border p-3">
              {editMode ? (
                <em>---</em>
              ) : issuedcert === "show_issue" ? (
                <button
                  onClick={() => {
                    setTitleConfirm("Issue certificate");
                    setMessageConfirm(
                      "Are you sure you want to issue certificate?"
                    );
                    setFunctionConfirm(
                      () => () => handleCertificateIssue(internship_id)
                    );
                    setConfirmOpenDialoge(true);
                  }}
                  className="px-2 py-1 bg-green-400 text-white rounded hover:bg-green-700 transition"
                >
                  Issue
                </button>
              ) : issuedcert === "hide_issue" ? (
                <em>---</em>
              ) : issuedcert === "edit_name" ? (
                <>
                  <button
                    onClick={() => {
                      setEditName(true);
                    }}
                    className="px-2 py-1 bg-blue-400 text-white rounded hover:bg-blue-700 transition"
                  >
                    Edit name
                  </button>
                </>
              ) : (
                <em>---</em>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <EditNamePopup
        editName={editName} // controls popup visibility
        defaultFirstName={nameRes.firstname} // default input values
        defaultLastName={nameRes.lastname}
        onSave={handleOnSave} // callback when save button clicked
        onClose={() => setEditName(false)} // callback on cancel
      />

      <ConfirmationDialog
        isOpen={confirmOpenDialoge}
        title={titleConfirm}
        message={messageConfirm}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={functionConfirm}
        onCancel={handleCancelClick}
      />
    </div>
  );
};

export default IntershipDetailTable;
