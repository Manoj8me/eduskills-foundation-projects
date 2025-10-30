import {
  Target,
  Building,
  CheckSquare,
  Users,
  IndianRupee,
  Upload,
  X,
  FileText,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { useState } from "react";
import api from "../../../services/api";
import { BASE_URL } from "../../../services/configUrls";

const ProjectsGrants = ({
  formData,
  setFormData,
  errors,
  setErrors,
  onRefreshFiles,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [deletingFiles, setDeletingFiles] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      const currentValues = formData[name] || [];
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...currentValues, value]
          : currentValues.filter((v) => v !== value),
      }));

      // If unchecking, remove the associated file
      if (!checked) {
        const fileField = `${value}File`;
        setFormData((prev) => ({
          ...prev,
          [fileField]: null,
        }));
        // Clear the file input
        const fileInput = document.getElementById(fileField);
        if (fileInput) {
          fileInput.value = "";
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle major projects array changes
  const handleMajorProjectChange = (index, field, value) => {
    const currentProjects = formData.majorProjects || [
      { title: "", agency: "", year: "", role: "", amount: "", outcome: "" },
      { title: "", agency: "", year: "", role: "", amount: "", outcome: "" },
      { title: "", agency: "", year: "", role: "", amount: "", outcome: "" },
    ];

    const updatedProjects = [...currentProjects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      majorProjects: updatedProjects,
    }));

    // Clear any existing errors for this field
    const errorKey = `majorProject${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type (PDF only)
    if (file.type !== "application/pdf") {
      alert("Please upload only PDF files");
      e.target.value = "";
      return;
    }

    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      e.target.value = "";
      return;
    }

    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));

    try {
      const uploadFormData = new FormData();
      uploadFormData.append(fieldName, file);
      uploadFormData.append("category_id", formData.category_id);
      uploadFormData.append("leader_id", formData.leader_id);

      const response = await api.post(
        `${BASE_URL}/internship/nomination/leader/files`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              [fieldName]: percentCompleted,
            }));
          },
        }
      );

      if (response.status === 200 && response.data) {
        // Store the file info from API response
        setFormData((prev) => ({
          ...prev,
          [fieldName]: {
            filename: response.data.filename,
            link: response.data.link,
            originalFile: file,
          },
        }));

        // Clear any existing errors
        if (errors[fieldName]) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: "",
          }));
        }

        console.log(
          `File uploaded successfully for ${fieldName}:`,
          response.data
        );

        // Refresh files from server after successful upload
        if (onRefreshFiles && typeof onRefreshFiles === "function") {
          await onRefreshFiles();
        }
      }
    } catch (error) {
      console.error(`Error uploading file for ${fieldName}:`, error);
      alert("Failed to upload file. Please try again.");
      e.target.value = "";
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
      setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }));
    }
  };

  const handleFileDelete = async (fieldName) => {
    const fileData = formData[fieldName];
    if (!fileData || !fileData.filename) return;

    setDeletingFiles((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const deleteResponse = await api.delete(
        `${BASE_URL}/internship/nomination/tpo-nominations/files`,
        {
          data: {
            filename: fileData.filename,
            key: fieldName,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (deleteResponse.status === 200) {
        // Remove file from form data
        setFormData((prev) => ({
          ...prev,
          [fieldName]: null,
        }));

        // Clear the file input
        const fileInput = document.getElementById(fieldName);
        if (fileInput) {
          fileInput.value = "";
        }
        console.log(`File deleted successfully for ${fieldName}`);

        // Refresh files from server after successful deletion
        if (onRefreshFiles && typeof onRefreshFiles === "function") {
          await onRefreshFiles();
        }
      }
    } catch (error) {
      console.error(`Error deleting file for ${fieldName}:`, error);
      alert("Failed to delete file. Please try again.");
    } finally {
      setDeletingFiles((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const removeFile = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    // Clear the file input
    const fileInput = document.getElementById(fieldName);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 pl-12 border rounded-lg transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${
      errors[fieldName]
        ? "border-red-300 bg-red-50"
        : "border-gray-300 hover:border-gray-400 focus:bg-white"
    }
  `;

  const checkboxClasses =
    "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500";

  const govSchemes = [
    { value: "aicte", label: "AICTE MODROB / STTP / FDP" },
    { value: "dst", label: "DST-FIST / DST-SEED" },
    { value: "ugc", label: "UGC Minor / Major Research Projects" },
    { value: "worldbank", label: "World Bank / TEQIP / RUSA" },
    {
      value: "msme",
      label: "MSME / Startup India / Incubation Support",
    },
    { value: "csr", label: "CSR Grant Mobilization from Corporates" },
  ];

  const renderFileUpload = (scheme) => {
    const fieldName = `${scheme.value}File`;
    const fileData = formData[fieldName];
    const isUploading = uploadingFiles[fieldName];
    const progress = uploadProgress[fieldName] || 0;
    const isDeleting = deletingFiles[fieldName];

    if (!formData.govSchemes?.includes(scheme.value)) {
      return (
        <span className="text-sm text-gray-400 italic">
          Select scheme to upload document
        </span>
      );
    }

    if (isUploading) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">
              Uploading...
            </span>
            <span className="text-sm text-blue-600 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      );
    }

    if (fileData) {
      return (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
          <div className="flex items-center flex-1 min-w-0">
            <FileText className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-green-900 truncate">
                {fileData.filename ||
                  (fileData.originalFile && fileData.originalFile.name) ||
                  "Uploaded file"}
              </p>
              {fileData.originalFile && (
                <p className="text-xs text-green-600">
                  {formatFileSize(fileData.originalFile.size)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <button
              type="button"
              onClick={() => handleFileDelete(fieldName)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
              title="Delete file"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <input
          id={fieldName}
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileUpload(e, fieldName)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 transition-colors duration-200">
          <div className="text-center">
            <Upload className="h-4 w-4 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-600 mb-1">Click to upload</p>
            <p className="text-xs text-gray-500">PDF, max 2MB</p>
          </div>
        </div>
      </div>
    );
  };

  // Initialize major projects if not exists
  const majorProjects = formData.majorProjects || [
    { title: "", agency: "", year: "", role: "", amount: "", outcome: "" },
    { title: "", agency: "", year: "", role: "", amount: "", outcome: "" },
    { title: "", agency: "", year: "", role: "", amount: "", outcome: "" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          File Requirements:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Each section accepts only one attachment</li>
          <li>
            • If you have multiple files for a single category, please merge
            them into one file and upload it
          </li>
          <li>• The one PDF file size must not exceed 2MB</li>
        </ul>
      </div>
      {/* Total Funded Projects */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Total Number of Funded Projects (July 2024 to Aug 2025)
        </h3>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Project Types (Select all that apply):
          </p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="projectTypes"
                value="govt"
                checked={formData.projectTypes?.includes("govt") || false}
                onChange={handleChange}
                className={checkboxClasses}
              />
              <span className="ml-2 text-sm text-gray-700">
                Govt. Sponsored
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="projectTypes"
                value="industry"
                checked={formData.projectTypes?.includes("industry") || false}
                onChange={handleChange}
                className={checkboxClasses}
              />
              <span className="ml-2 text-sm text-gray-700">
                Industry Funded
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="projectTypes"
                value="csr"
                checked={formData.projectTypes?.includes("csr") || false}
                onChange={handleChange}
                className={checkboxClasses}
              />
              <span className="ml-2 text-sm text-gray-700">
                CSR / NGO Supported
              </span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="totalProjects"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Total Projects *
            </label>
            <div className="relative">
              <Target className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="totalProjects"
                name="totalProjects"
                value={formData.totalProjects || ""}
                onChange={handleChange}
                className={inputClasses("totalProjects")}
                placeholder="Enter number of projects"
              />
            </div>
            {errors.totalProjects && (
              <p className="mt-1 text-sm text-red-600">
                {errors.totalProjects}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="totalFunding"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Total Funding (in ₹ Lakhs) *
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="totalFunding"
                name="totalFunding"
                value={formData.totalFunding || ""}
                onChange={handleChange}
                className={inputClasses("totalFunding")}
                placeholder="Enter funding amount"
              />
            </div>
            {errors.totalFunding && (
              <p className="mt-1 text-sm text-red-600">{errors.totalFunding}</p>
            )}
          </div>
        </div>
      </div>

      {/* Major Projects Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Major Projects Handled or Facilitated as Principal / Project Head
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          July 2024 to Aug 2025 (Mention any 3 major projects)
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Project Title
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Funding Agency
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Year
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Amount (₹ Lakhs)
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Outcome/Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {majorProjects.map((project, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={project.title || ""}
                      onChange={(e) =>
                        handleMajorProjectChange(index, "title", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Project title"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={project.agency || ""}
                      onChange={(e) =>
                        handleMajorProjectChange(
                          index,
                          "agency",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Agency name"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={project.year || ""}
                      onChange={(e) =>
                        handleMajorProjectChange(index, "year", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="2024-25"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={project.role || ""}
                      onChange={(e) =>
                        handleMajorProjectChange(index, "role", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="PI/Co-PI"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={project.amount || ""}
                      onChange={(e) =>
                        handleMajorProjectChange(
                          index,
                          "amount",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Enter amount"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      value={project.outcome || ""}
                      onChange={(e) =>
                        handleMajorProjectChange(
                          index,
                          "outcome",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
                      placeholder="Brief outcome"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Government Schemes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Government Schemes / Grants Facilitated Under Your Leadership
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          July 2024 to Aug 2025 (Mark all that apply and upload supporting
          documents)
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Select
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                  Government Scheme / Grant
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b min-w-[300px]">
                  Supporting Document
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {govSchemes.map((scheme) => (
                <tr key={scheme.value} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="govSchemes"
                        value={scheme.value}
                        checked={
                          formData.govSchemes?.includes(scheme.value) || false
                        }
                        onChange={handleChange}
                        className={checkboxClasses}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">
                      {scheme.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {renderFileUpload(scheme)}
                    {errors[`${scheme.value}File`] && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors[`${scheme.value}File`]}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <label
            htmlFor="otherFunding"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Other National / International Funding
          </label>
          <div className="relative">
            <Building className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="otherFunding"
              name="otherFunding"
              value={formData.otherFunding || ""}
              onChange={handleChange}
              className={inputClasses("otherFunding")}
              placeholder="Specify other funding sources..."
            />
          </div>
        </div>
      </div>

      {/* Industry Collaborations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Industry Collaborations Resulting in Sponsored Labs / Skill Programs
        </h3>

        <div className="mb-4">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="industryCollaboration"
                value="yes"
                checked={formData.industryCollaboration === "yes"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="industryCollaboration"
                value="no"
                checked={formData.industryCollaboration === "no"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>

        {formData.industryCollaboration === "yes" && (
          <div>
            <label
              htmlFor="industryDetails"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Industry Details
            </label>
            <p className="text-sm text-gray-600 mb-2">
              Provide name of industry, lab/program established, and funding
              involved
            </p>
            <div className="relative">
              <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                id="industryDetails"
                name="industryDetails"
                value={formData.industryDetails || ""}
                onChange={handleChange}
                rows={3}
                className={`${inputClasses("industryDetails")} resize-none`}
                placeholder="Describe industry partnerships, labs established, funding details..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsGrants;
