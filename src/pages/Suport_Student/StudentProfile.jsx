import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Save, X } from "lucide-react";
import api from "../../api";
import Alert from "../Alerts/Alert";
import Loader from "../Alerts/Loader";

const years = Array.from({ length: 30 }, (_, i) => 2000 + i);

const StudentProfile = () => {
  const { user_id } = useParams();
  const [data, setData] = useState({
    tenth: {},
    twelfth: {},
    ug: {},
    pg: {},
    permanent_address: {},
    current_address: {},
  });
  const [editingSection, setEditingSection] = useState(null);
  const [alert, setAlert] = useState({ message: "", color: "" });
  const [loading, setLoading] = useState(false);

  const [statesList, setStatesList] = useState([]);
  const [ugInstitutesList, setUgInstitutesList] = useState([]);
  const [pgInstitutesList, setPgInstitutesList] = useState([]);
  const [ugCoursesList, setUgCoursesList] = useState([]);
  const [pgCoursesList, setPgCoursesList] = useState([]);
  const [ugBranchesList, setUgBranchesList] = useState([]);
  const [pgBranchesList, setPgBranchesList] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/supports_students/get_profile`, {
        params: { user_id },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching student:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user_id) fetchData();
  }, [user_id]);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await api.get(
          "/supports_students/profile/distinct_info"
        );
        const { res } = response.data;
        const states = res.states.sort((a, b) => a.name.localeCompare(b.name));
        const uginstituteList = res.ug_institutes.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const pginstituteList = res.pg_institutes.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const ugcourses = res.ug_courses.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const pgcourses = res.pg_courses.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const ugbranches = res.ug_branches.sort();
        const pgbranches = res.pg_branches.sort();

        setStatesList(states || []);
        setUgInstitutesList(uginstituteList || []);
        setPgInstitutesList(pginstituteList || []);
        setUgCoursesList(ugcourses || []);
        setPgCoursesList(pgcourses || []);
        setUgBranchesList(ugbranches || []);
        setPgBranchesList(pgbranches || []);
      } catch (err) {
        console.error("Error fetching lists: " + err);
      }
    };
    fetchList();
  }, [user_id]);

  // Refs
  const firstnameRef = useRef();
  const middlenameRef = useRef();
  const lastnameRef = useRef();
  const aicteIdRef = useRef();
  const emailRef = useRef();
  const contactRef = useRef();
  const whatsappRef = useRef();
  const dobRef = useRef();
  const genderRef = useRef();
  const categoryRef = useRef();
  const disabilityRef = useRef();

  // Permanent Address Refs
  const permLine1Ref = useRef();
  const permLine2Ref = useRef();
  const permLandmarkRef = useRef();
  const permPincodeRef = useRef();
  const permStateRef = useRef();

  // Current Address Refs
  const currLine1Ref = useRef();
  const currLine2Ref = useRef();
  const currLandmarkRef = useRef();
  const currPincodeRef = useRef();
  const currStateRef = useRef();

  const isPgRef = useRef();

  const roleRef = useRef();
  const companyRef = useRef();
  const githubRef = useRef();
  const linkedinRef = useRef();
  const facebookRef = useRef();
  const instagramRef = useRef();
  const twitterRef = useRef();
  const mediumRef = useRef();
  const redditRef = useRef();
  const slackRef = useRef();
  const dribbbleRef = useRef();
  const behanceRef = useRef();
  const codepenRef = useRef();
  const figmaRef = useRef();
  const othersRef = useRef();

  const eduRefs = {
    tenth: { institute: useRef(), marks: useRef(), passout: useRef() },
    twelfth: { institute: useRef(), percentage: useRef(), passout: useRef() },
    ug: {
      institute_id: useRef(),
      course_id: useRef(),
      branch: useRef(),
      regNo: useRef(),
      mark: useRef(),
      passout: useRef(),
    },
    pg: {
      institute_id: useRef(),
      course_id: useRef(),
      branch: useRef(),
      regNo: useRef(),
      mark: useRef(),
      passout: useRef(),
    },
  };

  const handleSave = () => {
    // Create a deep copy of current data
    let updatedData = JSON.parse(JSON.stringify(data));

    // Helper: safely update nested objects
    const safeUpdate = (obj, key, value) => {
      if (value !== undefined && value !== null) obj[key] = value;
    };

    switch (editingSection) {
      case "profile":
        safeUpdate(updatedData, "first_name", firstnameRef.current.value);
        safeUpdate(updatedData, "middle_name", middlenameRef.current.value);
        safeUpdate(updatedData, "last_name", lastnameRef.current.value);
        break;

      case "contact":
        safeUpdate(updatedData, "aicte_id", aicteIdRef.current.value);
        safeUpdate(updatedData, "email", emailRef.current.value);
        safeUpdate(updatedData, "contact", contactRef.current.value);
        safeUpdate(updatedData, "whatsapp", whatsappRef.current.value);
        break;

      case "personal":
        safeUpdate(updatedData, "dob", dobRef.current.value);
        safeUpdate(updatedData, "gender", genderRef.current.value);
        safeUpdate(updatedData, "category", categoryRef.current.value);
        safeUpdate(updatedData, "disability", disabilityRef.current.value);
        break;

      case "address":
        updatedData.permanent_address = {
          ...updatedData.permanent_address,
          address_line_1: permLine1Ref.current.value,
          address_line_2: permLine2Ref.current.value,
          landmark: permLandmarkRef.current.value,
          pincode: permPincodeRef.current.value,
          state_id: permStateRef.current.value,
        };

        updatedData.current_address = {
          ...updatedData.current_address,
          address_line_1: currLine1Ref.current.value,
          address_line_2: currLine2Ref.current.value,
          landmark: currLandmarkRef.current.value,
          pincode: currPincodeRef.current.value,
          state_id: currStateRef.current.value,
        };
        break;

      case "career":
        const careerFields = [
          "role",
          "company",
          "github",
          "linkedin",
          "facebook",
          "instagram",
          "twitter",
          "medium",
          "reddit",
          "slack",
          "dribbble",
          "behance",
          "codepen",
          "figma",
          "others",
        ];
        careerFields.forEach((field) => {
          safeUpdate(updatedData, field, eval(`${field}Ref.current.value`));
        });
        break;

      case "education":
        // Collect education info
        ["tenth", "twelfth", "ug", "pg"].forEach((level) => {
          Object.keys(eduRefs[level]).forEach((field) => {
            safeUpdate(
              (updatedData[level] = updatedData[level] || {}),
              field,
              eduRefs[level][field].current.value
            );
          });
        });

        // Handle "is_pg" properly
        const isPgRadio = document.querySelector('input[name="is_pg"]:checked');
        if (isPgRadio) updatedData.is_pg = isPgRadio.value;
        break;

      default:
        break;
    }

    setEditingSection(null);

    const updateProfile = async () => {
      try {
        const res = await api.put(
          "/supports_students/update_profile_2",
          updatedData
        );
        setAlert({
          message: res.data.message,
          color: res.data.color || "green",
        });
        setTimeout(() => setAlert({ message: "", color: "" }), 3000);
        await fetchData();
      } catch (err) {
        console.error("Error updating profile:", err);
        setAlert({ message: "Error updating profile", color: "red" });
        setTimeout(() => setAlert({ message: "", color: "" }), 3000);
      }
    };

    updateProfile();
  };

  const SectionHeader = ({ title, sectionKey }) => (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {editingSection === sectionKey ? (
        <div className="space-x-2">
          <button onClick={handleSave} className="text-green-600">
            <Save size={18} />
          </button>
          <button
            onClick={() => setEditingSection(null)}
            className="text-red-500"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditingSection(sectionKey)}
          className="text-gray-500 hover:text-blue-500"
        >
          <Pencil size={16} />
        </button>
      )}
    </div>
  );

  const Card = ({ children }) => (
    <div className="shadow-sm bg-blue-500/5 rounded-2xl p-4">{children}</div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 rounded-2xl bg-gray-50 mt-6">
      {loading && <Loader />}
      {alert.message && <Alert message={alert.message} color={alert.color} />}
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={
              data?.gender === "Male"
                ? "https://res.cloudinary.com/dydvdfmgo/image/upload/v1760359738/avatar-of-a-student-character-free-vector_mtpszu.jpg"
                : data?.gender === "Female"
                ? "https://res.cloudinary.com/dydvdfmgo/image/upload/v1760359738/avatar-of-a-student-character-free-vector_1_mrln1w.jpg"
                : "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
            }
            alt={data?.first_name || "profile"}
            className="w-20 h-20 rounded-full border"
          />

          <div>
            {editingSection === "profile" ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  defaultValue={data?.first_name || ""}
                  ref={firstnameRef}
                  className="border rounded p-1"
                />
                <input
                  type="text"
                  defaultValue={data?.middle_name || ""}
                  ref={middlenameRef}
                  className="border rounded p-1"
                />
                <input
                  type="text"
                  defaultValue={data?.last_name || ""}
                  ref={lastnameRef}
                  className="border rounded p-1"
                />
                <button onClick={handleSave} className="text-green-600">
                  <Save size={18} />
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="text-red-500"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {data?.first_name} {data?.middle_name} {data?.last_name}
                </h1>
                <button
                  onClick={() => setEditingSection("profile")}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <Pencil size={16} />
                </button>
              </div>
            )}
            <p className="text-gray-600">{data?.email}</p>
          </div>
        </div>
      </div>

      {/* Contact Info + Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Contact */}
        <Card>
          <SectionHeader title="Contact Information" sectionKey="contact" />
          {editingSection === "contact" ? (
            <div className="space-y-2">
              <label>AICTE Id</label>
              <input
                type="text"
                defaultValue={data?.aicte_id || ""}
                ref={aicteIdRef}
                className="border rounded p-1 w-full"
              />
              <label>Email</label>
              <input
                type="text"
                defaultValue={data?.email || ""}
                ref={emailRef}
                className="border rounded p-1 w-full cursor-not-allowed"
                disabled
              />
              <label>Contact</label>
              <input
                type="text"
                defaultValue={data?.contact || ""}
                ref={contactRef}
                className="border rounded p-1 w-full"
              />
              <label>WhatsApp</label>
              <input
                type="text"
                defaultValue={data?.whatsapp || ""}
                ref={whatsappRef}
                className="border rounded p-1 w-full"
              />
            </div>
          ) : (
            <>
              <p>
                <strong>AICTE Id:</strong> {data?.aicte_id || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {data?.email || "N/A"}
              </p>
              <p>
                <strong>Contact:</strong> {data?.contact || "N/A"}
              </p>
              <p>
                <strong>WhatsApp:</strong> {data?.whatsapp || "N/A"}
              </p>
            </>
          )}
        </Card>

        {/* Personal */}
        <Card>
          <SectionHeader title="Personal Details" sectionKey="personal" />
          {editingSection === "personal" ? (
            <div className="space-y-2">
              <label>DOB</label>
              <input
                type="date"
                defaultValue={data?.dob || ""}
                ref={dobRef}
                className="border rounded p-1 w-full"
              />

              <label>Gender</label>
              <select
                defaultValue={data?.gender || ""}
                ref={genderRef}
                className="border rounded p-1 w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <label>Category</label>
              <select
                defaultValue={data?.category || ""}
                ref={categoryRef}
                className="border rounded p-1 w-full"
              >
                <option value="">Select Category</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>

              <label>Disability</label>
              <select
                defaultValue={data?.disability || ""}
                ref={disabilityRef}
                className="border rounded p-1 w-full"
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          ) : (
            <>
              <p>
                <strong>DOB:</strong> {data?.dob || "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {data?.gender || "N/A"}
              </p>
              <p>
                <strong>Category:</strong> {data?.category || "N/A"}
              </p>
              <p>
                <strong>Disability:</strong> {data?.disability || "N/A"}
              </p>
            </>
          )}
        </Card>
      </div>

      {/* Address + Career */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Address Section */}
        <Card>
          <SectionHeader title="Address Information" sectionKey="address" />
          {editingSection === "address" ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Permanent Address */}
              <div>
                <h4 className="font-semibold mb-2">Permanent Address</h4>
                <label>Address 1</label>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  defaultValue={data?.permanent_address?.address_line_1 || ""}
                  ref={permLine1Ref}
                  className="border rounded p-1 w-full mb-2"
                />
                <label>Address 2</label>
                <input
                  type="text"
                  placeholder="Address Line 2"
                  defaultValue={data?.permanent_address?.address_line_2 || ""}
                  ref={permLine2Ref}
                  className="border rounded p-1 w-full mb-2"
                />
                <label>Landmark</label>
                <input
                  type="text"
                  placeholder="Landmark"
                  defaultValue={data?.permanent_address?.landmark || ""}
                  ref={permLandmarkRef}
                  className="border rounded p-1 w-full mb-2"
                />
                <label>Pincode</label>
                <input
                  type="number"
                  placeholder="Pincode"
                  defaultValue={data?.permanent_address?.pincode || ""}
                  ref={permPincodeRef}
                  className="border rounded p-1 w-full mb-2"
                />
                <label>State</label>
                <select
                  defaultValue={data?.permanent_address?.state_id || ""}
                  ref={permStateRef}
                  className="border rounded p-1 w-full"
                >
                  <option value="">Select State</option>
                  {statesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Current Address */}
              <div>
                <h4 className="font-semibold mb-2">Current Address</h4>
                <label>Address 1</label>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  defaultValue={data?.current_address?.address_line_1 || ""}
                  ref={currLine1Ref}
                  className="border rounded p-1 w-full mb-2"
                />
                <label>Address 2</label>
                <input
                  type="text"
                  placeholder="Address Line 2"
                  defaultValue={data?.current_address?.address_line_2 || ""}
                  ref={currLine2Ref}
                  className="border rounded p-1 w-full mb-2"
                />
                <label>Landmark</label>
                <input
                  type="text"
                  placeholder="Landmark"
                  defaultValue={data?.current_address?.landmark || ""}
                  ref={currLandmarkRef}
                  className="border rounded p-1 w-full mb-2"
                />
                <label>Pincode</label>
                <input
                  type="number"
                  placeholder="Pincode"
                  defaultValue={data?.current_address?.pincode || ""}
                  ref={currPincodeRef}
                  className="border rounded p-1 w-full mb-2"
                />
                <label>State</label>
                <select
                  defaultValue={data?.current_address?.state_id || ""}
                  ref={currStateRef}
                  className="border rounded p-1 w-full"
                >
                  <option value="">Select State</option>
                  {statesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Permanent Address</h4>
                <p>
                  <strong>Address 1:</strong>{" "}
                  {data?.permanent_address?.address_line_1 || "N/A"}
                </p>
                <p>
                  <strong>Address 2:</strong>{" "}
                  {data?.permanent_address?.address_line_2 || "N/A"}
                </p>
                <p>
                  <strong>Landmark:</strong>{" "}
                  {data?.permanent_address?.landmark || "N/A"}
                </p>
                <p>
                  <strong>Pincode:</strong>{" "}
                  {data?.permanent_address?.pincode || "N/A"}
                </p>
                <p>
                  <strong>State:</strong>{" "}
                  {data?.permanent_address?.location || "N/A"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Current Address</h4>
                <p>
                  <strong>Address 1:</strong>{" "}
                  {data?.current_address?.address_line_1 || "N/A"}
                </p>
                <p>
                  <strong>Address 2:</strong>{" "}
                  {data?.current_address?.address_line_2 || "N/A"}
                </p>
                <p>
                  <strong>Landmark:</strong>{" "}
                  {data?.current_address?.landmark || "N/A"}
                </p>
                <p>
                  <strong>Pincode:</strong>{" "}
                  {data?.current_address?.pincode || "N/A"}
                </p>
                <p>
                  <strong>State:</strong>{" "}
                  {data?.current_address?.location || "N/A"}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Career */}
        <Card>
          <SectionHeader title="Career & Links" sectionKey="career" />
          {editingSection === "career" ? (
            <div className="space-y-2">
              <label>Role</label>
              <input
                type="text"
                defaultValue={data?.role || ""}
                ref={roleRef}
                className="border rounded p-1 w-full"
              />
              <label>Company</label>
              <input
                type="text"
                defaultValue={data?.company || ""}
                ref={companyRef}
                className="border rounded p-1 w-full"
              />

              <label>GitHub</label>
              <input
                type="url"
                defaultValue={data?.github || ""}
                ref={githubRef}
                className="border rounded p-1 w-full"
              />
              <label>Linkedin</label>
              <input
                type="url"
                defaultValue={data?.linkedin || ""}
                ref={linkedinRef}
                className="border rounded p-1 w-full"
              />
              <label>Facebook</label>
              <input
                type="url"
                defaultValue={data?.facebook || ""}
                ref={facebookRef}
                className="border rounded p-1 w-full"
              />
              <label>Instagram</label>
              <input
                type="url"
                defaultValue={data?.instagram || ""}
                ref={instagramRef}
                className="border rounded p-1 w-full"
              />
              <label>Twitter</label>
              <input
                type="url"
                defaultValue={data?.twitter || ""}
                ref={twitterRef}
                className="border rounded p-1 w-full"
              />
              <label>Medium</label>
              <input
                type="url"
                defaultValue={data?.medium || ""}
                ref={mediumRef}
                className="border rounded p-1 w-full"
              />
              <label>Reddit</label>
              <input
                type="url"
                defaultValue={data?.reddit || ""}
                ref={redditRef}
                className="border rounded p-1 w-full"
              />
              <label>Slack</label>
              <input
                type="url"
                defaultValue={data?.slack || ""}
                ref={slackRef}
                className="border rounded p-1 w-full"
              />
              <label>Dribbble</label>
              <input
                type="url"
                defaultValue={data?.dribbble || ""}
                ref={dribbbleRef}
                className="border rounded p-1 w-full"
              />
              <label>Behance</label>
              <input
                type="url"
                defaultValue={data?.behance || ""}
                ref={behanceRef}
                className="border rounded p-1 w-full"
              />
              <label>Codepen</label>
              <input
                type="url"
                defaultValue={data?.codepen || ""}
                ref={codepenRef}
                className="border rounded p-1 w-full"
              />
              <label>Figma</label>
              <input
                type="url"
                defaultValue={data?.figma || ""}
                ref={figmaRef}
                className="border rounded p-1 w-full"
              />
              <label>Others</label>
              <input
                type="url"
                defaultValue={data?.others || ""}
                ref={othersRef}
                className="border rounded p-1 w-full"
              />
            </div>
          ) : (
            <>
              <p>
                <strong>Role:</strong> {data?.role || "N/A"}
              </p>
              <p>
                <strong>Company:</strong> {data?.company || "N/A"}
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                <a
                  href={data?.github || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.github || "N/A"}
                </a>
              </p>
              <p>
                <strong>Linkedin:</strong>{" "}
                <a
                  href={data?.linkedin || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.linkedin || "N/A"}
                </a>
              </p>
              <p>
                <strong>Facebook:</strong>{" "}
                <a
                  href={data?.facebook || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.facebook || "N/A"}
                </a>
              </p>
              <p>
                <strong>Instagram:</strong>{" "}
                <a
                  href={data?.instagram || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.instagram || "N/A"}
                </a>
              </p>
              <p>
                <strong>Twitter:</strong>{" "}
                <a
                  href={data?.twitter || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.twitter || "N/A"}
                </a>
              </p>
              <p>
                <strong>Medium:</strong>{" "}
                <a
                  href={data?.medium || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.medium || "N/A"}
                </a>
              </p>
              <p>
                <strong>Reddit:</strong>{" "}
                <a
                  href={data?.reddit || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.reddit || "N/A"}
                </a>
              </p>
              <p>
                <strong>Slack:</strong>{" "}
                <a
                  href={data?.slack || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.slack || "N/A"}
                </a>
              </p>
              <p>
                <strong>Dribbble:</strong>{" "}
                <a
                  href={data?.dribbble || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.dribbble || "N/A"}
                </a>
              </p>
              <p>
                <strong>Behance:</strong>{" "}
                <a
                  href={data?.behance || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.behance || "N/A"}
                </a>
              </p>
              <p>
                <strong>Codepen:</strong>{" "}
                <a
                  href={data?.codepen || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.codepen || "N/A"}
                </a>
              </p>
              <p>
                <strong>Figma:</strong>{" "}
                <a
                  href={data?.figma || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.figma || "N/A"}
                </a>
              </p>
              <p>
                <strong>Others:</strong>{" "}
                <a
                  href={data?.others || "#"}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.others || "N/A"}
                </a>
              </p>
            </>
          )}
        </Card>
      </div>

      {/* Education Section */}
      <Card>
        <SectionHeader title="Education Information" sectionKey="education" />

        {/* Is PG radio under Education title */}
        {editingSection === "education" ? (
          <div className="mb-4">
            <label className="font-semibold block mb-2">PG</label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="is_pg"
                  value="Yes"
                  defaultChecked={data?.is_pg === "Yes"}
                  ref={isPgRef}
                />{" "}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="is_pg"
                  value="No"
                  defaultChecked={data?.is_pg === "No"}
                  ref={isPgRef}
                />{" "}
                No
              </label>
            </div>
          </div>
        ) : (
          <p className="mb-4">
            <strong>PG:</strong> {data?.is_pg || "N/A"}
          </p>
        )}

        {editingSection === "education" ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Tenth */}
            <div>
              <h4 className="font-semibold mb-2">10th</h4>
              <label>Institute</label>
              <input
                type="text"
                placeholder="Institute"
                defaultValue={data?.tenth?.institute || ""}
                ref={eduRefs.tenth.institute}
                className="border rounded p-1 w-full mb-2"
              />
              <label>Percentage</label>
              <input
                type="text"
                placeholder="Marks"
                defaultValue={data?.tenth?.marks || ""}
                ref={eduRefs.tenth.marks}
                className="border rounded p-1 w-full mb-2"
              />
              <label>Passout</label>
              <select
                defaultValue={data?.tenth?.passout || ""}
                ref={eduRefs.tenth.passout}
                className="border rounded p-1 w-full"
              >
                <option value="">Select Passout Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Twelfth */}
            <div>
              <h4 className="font-semibold mb-2">12th</h4>
              <label>Institute</label>
              <input
                type="text"
                placeholder="Institute"
                defaultValue={data?.twelfth?.institute || ""}
                ref={eduRefs.twelfth.institute}
                className="border rounded p-1 w-full mb-2"
              />
              <label>Percentage</label>
              <input
                type="text"
                placeholder="Percentage"
                defaultValue={data?.twelfth?.percentage || ""}
                ref={eduRefs.twelfth.percentage}
                className="border rounded p-1 w-full mb-2"
              />
              <label>Passout</label>
              <select
                defaultValue={data?.twelfth?.passout || ""}
                ref={eduRefs.twelfth.passout}
                className="border rounded p-1 w-full"
              >
                <option value="">Select Passout Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* UG */}
            <div>
              <h4 className="font-semibold mb-2">Undergraduate (UG)</h4>
              <label>Institute</label>
              <select
                defaultValue={data?.ug?.institute_id || ""}
                ref={eduRefs.ug.institute_id}
                className="border rounded p-1 w-full mb-2"
              >
                <option value="">Select Institute</option>
                {ugInstitutesList.map((i, idx) => (
                  <option key={idx} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <label>Course</label>
              <select
                defaultValue={data?.ug?.course_id || ""}
                ref={eduRefs.ug.course_id}
                className="border rounded p-1 w-full mb-2"
              >
                <option value="">Select Course</option>
                {ugCoursesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <label>Branch</label>
              <select
                defaultValue={data?.ug?.branch || ""}
                ref={eduRefs.ug.branch}
                className="border rounded p-1 w-full mb-2"
              >
                <option value="">Select Branch</option>
                {ugBranchesList.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <label>Register No</label>
              <input
                type="text"
                placeholder="Register No"
                defaultValue={data?.ug?.regNo || ""}
                ref={eduRefs.ug.regNo}
                className="border rounded p-1 w-full mb-2"
              />
              <label>Marks</label>
              <input
                type="text"
                placeholder="Marks"
                defaultValue={data?.ug?.mark || ""}
                ref={eduRefs.ug.mark}
                className="border rounded p-1 w-full mb-2"
              />
              <label>Passout</label>
              <select
                defaultValue={data?.ug?.passout || ""}
                ref={eduRefs.ug.passout}
                className="border rounded p-1 w-full"
              >
                <option value="">Select Passout Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* PG */}
            <div>
              <h4 className="font-semibold mb-2">Postgraduate (PG)</h4>
              <label>Institute</label>
              <select
                defaultValue={data?.pg?.institute_id || ""}
                ref={eduRefs.pg.institute_id}
                className="border rounded p-1 w-full mb-2"
              >
                <option value="">Select Institute</option>
                {pgInstitutesList.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
              <label>Course</label>
              <select
                defaultValue={data?.pg?.course_id || ""}
                ref={eduRefs.pg.course_id}
                className="border rounded p-1 w-full mb-2"
              >
                <option value="">Select Course</option>
                {pgCoursesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <label>Branch</label>
              <select
                defaultValue={data?.pg?.branch || ""}
                ref={eduRefs.pg.branch}
                className="border rounded p-1 w-full mb-2"
              >
                <option value="">Select Branch</option>
                {pgBranchesList.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <label>Register No</label>
              <input
                type="text"
                placeholder="Register No"
                defaultValue={data?.pg?.regNo || ""}
                ref={eduRefs.pg.regNo}
                className="border rounded p-1 w-full mb-2"
              />
              <label>Marks</label>
              <input
                type="text"
                placeholder="Marks"
                defaultValue={data?.pg?.mark || ""}
                ref={eduRefs.pg.mark}
                className="border rounded p-1 w-full mb-2"
              />
              <label>Passout</label>
              <select
                defaultValue={data?.pg?.passout || ""}
                ref={eduRefs.pg.passout}
                className="border rounded p-1 w-full"
              >
                <option value="">Select Passout Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">10th</h4>
              <p>
                <strong>Institute:</strong> {data?.tenth?.institute || "N/A"}
              </p>
              <p>
                <strong>Percentage:</strong> {data?.tenth?.marks || "N/A"}
              </p>
              <p>
                <strong>Passout:</strong> {data?.tenth?.passout || "N/A"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">12th</h4>
              <p>
                <strong>Institute:</strong> {data?.twelfth?.institute || "N/A"}
              </p>
              <p>
                <strong>Percentage:</strong>{" "}
                {data?.twelfth?.percentage || "N/A"}
              </p>
              <p>
                <strong>Passout:</strong> {data?.twelfth?.passout || "N/A"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Undergraduate (UG)</h4>
              <p>
                <strong>Institute:</strong> {data?.ug?.institute || "N/A"}
              </p>
              <p>
                <strong>Course:</strong> {data?.ug?.course || "N/A"}
              </p>
              <p>
                <strong>Branch:</strong> {data?.ug?.branch || "N/A"}
              </p>
              <p>
                <strong>Register No:</strong> {data?.ug?.regNo || "N/A"}
              </p>
              <p>
                <strong>Marks:</strong> {data?.ug?.mark || "N/A"}
              </p>
              <p>
                <strong>Passout:</strong> {data?.ug?.passout || "N/A"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Postgraduate (PG)</h4>
              <p>
                <strong>Institute:</strong> {data?.pg?.institute || "N/A"}
              </p>
              <p>
                <strong>Course:</strong> {data?.pg?.course || "N/A"}
              </p>
              <p>
                <strong>Branch:</strong> {data?.pg?.branch || "N/A"}
              </p>
              <p>
                <strong>Register No:</strong> {data?.pg?.regNo || "N/A"}
              </p>
              <p>
                <strong>Marks:</strong> {data?.pg?.mark || "N/A"}
              </p>
              <p>
                <strong>Passout:</strong> {data?.pg?.passout || "N/A"}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentProfile;
