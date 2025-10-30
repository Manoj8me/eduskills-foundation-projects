import {
  FileText,
  Target,
  CheckCircle,
  Upload,
  X,
  CreditCard,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import React, { useState } from "react";
import api from "../../../services/api";
import { BASE_URL } from "../../../services/configUrls";

const PlacementVisionAndDeclaration = ({
  formData,
  setFormData,
  errors,
  setErrors,
  onRefreshFiles, // Add this prop to trigger file refresh from parent
}) => {
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [deletingFiles, setDeletingFiles] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
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

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (200KB = 200 * 1024 bytes)
    const maxSize = 200 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "File size must be under 200KB",
      }));
      e.target.value = "";
      return;
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Only JPG, PNG, and GIF images are allowed",
      }));
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
        `${BASE_URL}/internship/nomination/tpo-nominations/files`,
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
            originalFile: file, // Keep reference to original file for display
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
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Failed to upload file. Please try again.",
      }));
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

  // Function to count words
  const countWords = (text) => {
    if (!text) return 0;
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFileUpload = (
    fieldName,
    title,
    icon,
    acceptTypes = "image/*"
  ) => {
    const fileData = formData[fieldName];
    const isUploading = uploadingFiles[fieldName];
    const progress = uploadProgress[fieldName] || 0;
    const isDeleting = deletingFiles[fieldName];

    if (isUploading) {
      return (
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">{icon}</div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-600 font-medium">
                  Uploading...
                </span>
                <span className="text-sm text-blue-600 font-bold">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!fileData) {
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
          <div className="text-center">
            {icon}
            <div className="mt-4">
              <label
                htmlFor={fieldName}
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                {title}
              </label>
              <input
                type="file"
                id={fieldName}
                name={fieldName}
                onChange={(e) => handleFileUpload(e, fieldName)}
                accept={acceptTypes}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop or click to upload
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center flex-1 min-w-0">
          {React.cloneElement(icon, {
            className: "h-8 w-8 text-green-500 mr-3",
          })}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-green-900 truncate">
              {fileData.filename ||
                (fileData.originalFile && fileData.originalFile.name) ||
                "Uploaded file"}
            </p>
            {fileData.originalFile && (
              <p className="text-sm text-green-500">
                {formatFileSize(fileData.originalFile.size)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          {/* {fileData.link && (
            <a
              href={fileData.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
              title="View file"
            >
              <Eye className="h-4 w-4" />
            </a>
          )} */}
          {/* {fileData.link && (
            <a
              href={fileData.link}
              download
              className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100 transition-colors duration-200"
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </a>
          )} */}
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
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Target className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">
            Vision & Declaration
          </h3>
        </div>

        <div className="space-y-6">
          {/* Vision Statement */}
          <div>
            <label
              htmlFor="visionStatementFinal"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Your Vision for Transforming Placement & Student Employability *
            </label>
            <p className="text-sm text-gray-600 mb-2">
              In not more than 150 words
            </p>
            <div className="relative">
              <Target className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <textarea
                id="visionStatementFinal"
                name="visionStatementFinal"
                value={formData.visionStatementFinal || ""}
                onChange={handleChange}
                rows={5}
                className={`${inputClasses(
                  "visionStatementFinal"
                )} resize-none`}
                placeholder="Share your vision for transforming placement services and enhancing student employability through innovative strategies..."
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              {errors.visionStatementFinal && (
                <p className="text-sm text-red-600">
                  {errors.visionStatementFinal}
                </p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {countWords(formData.visionStatementFinal)}/150 words
              </p>
            </div>
          </div>

          {/* ID Card Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Institution ID Card *
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Upload a clear photo of your institution ID card (JPG, PNG, GIF -
              Max 200KB)
            </p>

            {renderFileUpload(
              "idCardImage",
              "Choose ID Card Image",
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            )}

            {errors.idCardImage && (
              <p className="mt-1 text-sm text-red-600">{errors.idCardImage}</p>
            )}
          </div>

          {/* Declaration */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Declaration
            </h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="declaration"
                  name="declaration"
                  checked={formData.declaration || false}
                  onChange={handleChange}
                  className={`${checkboxClasses} mt-1`}
                  required
                />
                <div className="ml-3">
                  <label
                    htmlFor="declaration"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    <span className="font-medium">I hereby certify that:</span>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>
                        • All the information provided is true and accurate
                      </li>
                      <li>
                        • I authorize EduSkills to verify the details for award
                        evaluation purposes
                      </li>
                      <li>
                        • I understand that any false information may lead to
                        disqualification
                      </li>
                      <li>
                        • I consent to the processing of my personal data for
                        evaluation purposes
                      </li>
                      <li>
                        • The uploaded ID card image is authentic and belongs to
                        me
                      </li>
                      <li>
                        • I am currently employed at the mentioned institution
                        in the placement/training role
                      </li>
                    </ul>
                  </label>
                </div>
              </div>
              {errors.declaration && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.declaration}
                </p>
              )}
            </div>
          </div>

          {/* Digital Signature Image Upload (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Digital Signature Image{" "}
              {/* <span className="text-gray-500 font-normal">(Optional)</span> */}
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Upload your signature image (JPG, PNG, GIF - Max 200KB)
            </p>

            {renderFileUpload(
              "digitalSignatureImage",
              "Choose Signature Image",
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            )}

            {errors.digitalSignatureImage && (
              <p className="mt-1 text-sm text-red-600">
                {errors.digitalSignatureImage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementVisionAndDeclaration;
