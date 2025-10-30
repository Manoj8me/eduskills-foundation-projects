import { useState, useEffect } from "react";

import {
  User,
  TrendingUp,
  Award,
  FileText,
  CheckCircle,
  ArrowLeft,
  ClipboardCheck,
  Info,
  Download,
  AlertCircle,
  Clock,
  Loader2,
  X,
  Shield,
} from "lucide-react";

// Import the separate components
import PlacementData from "./PlacementData";
import PlacementInitiatives from "./PlacementInitiatives";
import PlacementSupportingDocuments from "./PlacementSupportingDocuments";
import PlacementVisionAndDeclaration from "./PlacementVisionAndDeclaration";
import { BASE_URL } from "../../../services/configUrls";
import PlacementPersonalInformation from "./PlacementPersonlaInformation";
import api from "../../../services/api";

export default function PlacementMultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showTerms, setShowTerms] = useState(true);
  const [loading, setLoading] = useState(true);
  const [nominationStatus, setNominationStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    designation: "",
    institutionName: "",
    emailId: "",
    mobileNumber: "",
    yearsOfExperience: "",
    linkedinProfile: "",

    // Placement Data
    studentsEligible: "",
    studentsPlaced: "",
    highestPackage: "",
    averagePackage: "",
    companiesVisited: "",
    internshipOffers: "",
    startupGovtPlacements: "",

    // Key Initiatives & Achievements
    industryPartnerships: "",
    placementStrategies: "",
    skillDevelopmentPrograms: "",
    ruralStudentInitiatives: "",
    diversityContribution: "",
    careerGuidancePrograms: "",
    visionStatement: "",

    // Supporting Documents
    supportingDocuments: [],
    hrRecommendationFile: null,
    placementBrochureFile: null,
    testimonialsFile: null,
    photographsFile: null,
    pressCoverageFile: null,
    certificatesFile: null,
    mouPartnershipFile: null,

    // Vision and Declaration
    visionStatementFinal: "",
    idCardImage: null,
    declaration: false,
    digitalSignature: "",
    digitalSignatureImage: null,
    submissionDate: "",

    // API required fields
    category_id: null,
    leader_id: null,
  });

  const [errors, setErrors] = useState({});

  // Fetch nomination status on component mount
  useEffect(() => {
    fetchNominationStatus();
  }, []);

  const fetchNominationStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `${BASE_URL}/internship/nomination/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = response.data;

      setNominationStatus(data);

      // Pre-populate basic form data with API response
      setFormData((prev) => ({
        ...prev,
        fullName: data.full_name || "",
        designation: data.designation || "",
        institutionName: data.institution_name || "",
        emailId: data.email_id || "",
        mobileNumber: data.mobile_number || "",
        category_id: data.category_id,
        leader_id: data.leader_id,
      }));
      console.log(data.leader_id, "leader", data.category_id, "category");
      // If we have leader_id and category_id, fetch existing form data
      if (data.leader_id && data.category_id) {
        await fetchExistingFormData(data.leader_id, data.category_id);
      }
    } catch (error) {
      console.error("Error fetching nomination status:", error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch existing form data
  const fetchExistingFormData = async (leaderId, categoryId) => {
    try {
      console.log(
        `Fetching existing form data for leader_id: ${leaderId}, category_id: ${categoryId}`
      );

      const response = await api.get(
        `${BASE_URL}/internship/nomination/tpo-nominations/${leaderId}/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        const existingData = response.data;
        console.log("Existing form data fetched:", existingData);

        // Merge existing data with current form data
        setFormData((prev) => ({
          ...prev,
          // Personal Information
          yearsOfExperience:
            existingData.yearsOfExperience || prev.yearsOfExperience,
          linkedinProfile: existingData.linkedinProfile || prev.linkedinProfile,

          // Placement Data
          studentsEligible:
            existingData.studentsEligible || prev.studentsEligible,
          studentsPlaced: existingData.studentsPlaced || prev.studentsPlaced,
          highestPackage: existingData.highestPackage || prev.highestPackage,
          averagePackage: existingData.averagePackage || prev.averagePackage,
          companiesVisited:
            existingData.companiesVisited || prev.companiesVisited,
          internshipOffers:
            existingData.internshipOffers || prev.internshipOffers,
          startupGovtPlacements:
            existingData.startupGovtPlacements || prev.startupGovtPlacements,

          // Key Initiatives & Achievements
          industryPartnerships:
            existingData.industryPartnerships || prev.industryPartnerships,
          placementStrategies:
            existingData.placementStrategies || prev.placementStrategies,
          skillDevelopmentPrograms:
            existingData.skillDevelopmentPrograms ||
            prev.skillDevelopmentPrograms,
          ruralStudentInitiatives:
            existingData.ruralStudentInitiatives ||
            prev.ruralStudentInitiatives,
          diversityContribution:
            existingData.diversityContribution || prev.diversityContribution,
          careerGuidancePrograms:
            existingData.careerGuidancePrograms || prev.careerGuidancePrograms,
          visionStatement: existingData.visionStatement || prev.visionStatement,

          // Supporting Documents - parse JSON arrays if they exist
          supportingDocuments: existingData.supportingDocuments
            ? typeof existingData.supportingDocuments === "string"
              ? JSON.parse(existingData.supportingDocuments)
              : existingData.supportingDocuments
            : prev.supportingDocuments,

          // Vision and Declaration
          visionStatementFinal:
            existingData.visionStatementFinal || prev.visionStatementFinal,
          declaration: existingData.declaration || prev.declaration,
          digitalSignature:
            existingData.digitalSignature || prev.digitalSignature,
          // submissionDate: existingData.submissionDate || prev.submissionDate,
        }));

        // Fetch uploaded files information
        await fetchUploadedFiles(leaderId, categoryId);

        // Mark sections as completed based on existing data
        const completedSections = new Set();

        // Check Personal Information completion
        if (existingData.yearsOfExperience) {
          completedSections.add(1);
        }

        // Check Placement Data completion
        if (existingData.studentsEligible && existingData.studentsPlaced) {
          completedSections.add(2);
        }

        // Check Key Initiatives completion
        if (existingData.visionStatement) {
          completedSections.add(3);
        }

        // Check Supporting Documents completion (optional section)
        completedSections.add(4);

        // Check Vision & Declaration completion
        if (existingData.visionStatementFinal && existingData.declaration) {
          completedSections.add(5);
        }

        setCompletedSteps(completedSections);
        console.log(
          "Completed sections based on existing data:",
          Array.from(completedSections)
        );
      }
    } catch (error) {
      // If error is 404, it means no existing data - that's fine
      if (error.response?.status === 404) {
        console.log("No existing form data found - starting fresh");
      } else {
        console.error("Error fetching existing form data:", error);
      }
    }
  };

  const fetchUploadedFiles = async (leaderId, categoryId) => {
    try {
      const response = await api.get(
        `${BASE_URL}/internship/nomination/tpo-nominations/files/${leaderId}/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200 && response.data) {
        const uploadedFiles = response.data;
        console.log("Uploaded files fetched:", uploadedFiles);

        // Update form data with uploaded file information
        uploadedFiles.forEach((fileInfo) => {
          const fieldName = Object.keys(fileInfo)[0];
          const fileData = fileInfo[fieldName];

          setFormData((prev) => ({
            ...prev,
            [fieldName]: {
              filename: fileData.filename,
              link: fileData.link,
            },
          }));
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("No uploaded files found");
      } else {
        console.error("Error fetching uploaded files:", error);
      }
    }
  };

  const steps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Basic personal and contact details",
      icon: User,
      component: PlacementPersonalInformation,
    },
    {
      id: 2,
      title: "Placement Data",
      description: "Institutional placement statistics",
      icon: TrendingUp,
      component: PlacementData,
    },
    {
      id: 3,
      title: "Key Initiatives",
      description: "Achievements and initiatives",
      icon: Award,
      component: PlacementInitiatives,
    },
    {
      id: 4,
      title: "Supporting Documents",
      description: "Upload documents and certificates",
      icon: FileText,
      component: PlacementSupportingDocuments,
    },
    {
      id: 5,
      title: "Vision & Declaration",
      description: "Final vision and submission",
      icon: ClipboardCheck,
      component: PlacementVisionAndDeclaration,
    },
  ];

  const handleRefreshFiles = async () => {
    if (formData.leader_id && formData.category_id) {
      await fetchUploadedFiles(formData.leader_id, formData.category_id);
    }
  };

  // Handle step navigation - DISABLED FOR SIDEBAR
  const handleStepNavigation = (stepId) => {
    // Sidebar navigation is completely disabled
    return;
  };

  // Validation functions remain the same...
  const validatePersonalInfo = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.designation.trim())
      newErrors.designation = "Designation is required";
    if (!formData.institutionName.trim())
      newErrors.institutionName = "Institution name is required";
    if (!formData.emailId.trim()) {
      newErrors.emailId = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      newErrors.emailId = "Please enter a valid email address";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid mobile number";
    }
    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = "Years of experience is required";
    }
    if (
      formData.linkedinProfile &&
      !formData.linkedinProfile.includes("linkedin.com")
    ) {
      newErrors.linkedinProfile = "Please enter a valid LinkedIn profile URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePlacementData = () => {
    const newErrors = {};

    if (!formData.studentsEligible)
      newErrors.studentsEligible = "Number of eligible students is required";
    if (!formData.studentsPlaced)
      newErrors.studentsPlaced = "Number of placed students is required";
    if (!formData.highestPackage)
      newErrors.highestPackage = "Highest package amount is required";
    if (!formData.averagePackage)
      newErrors.averagePackage = "Average package amount is required";
    if (!formData.companiesVisited)
      newErrors.companiesVisited = "Number of companies visited is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePlacementInitiatives = () => {
    const newErrors = {};

    if (!formData.visionStatement?.trim()) {
      newErrors.visionStatement = "Vision statement is required";
    } else {
      const wordCount = formData.visionStatement
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      if (wordCount > 150) {
        newErrors.visionStatement =
          "Vision statement must not exceed 150 words";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSupportingDocuments = () => {
    setErrors({});
    return true;
  };

  const validateVisionAndDeclaration = () => {
    const newErrors = {};

    if (!formData.visionStatementFinal?.trim()) {
      newErrors.visionStatementFinal = "Vision statement is required";
    } else {
      const wordCount = formData.visionStatementFinal
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      if (wordCount > 150) {
        newErrors.visionStatementFinal =
          "Vision statement must not exceed 150 words";
      }
    }

    if (!formData.idCardImage || !formData.idCardImage.filename) {
      newErrors.idCardImage = "Institution ID card is required";
    }

    if (!formData.declaration) {
      newErrors.declaration = "You must accept the declaration";
    }

    // if (!formData.digitalSignature?.trim()) {
    //   newErrors.digitalSignature = "Digital signature (full name) is required";
    // }

    // if (!formData.submissionDate) {
    //   newErrors.submissionDate = "Submission date is required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Section-wise save function
  const prepareSectionDataForSaving = (stepNumber) => {
    const sectionFormData = new FormData();

    // Always include required API fields for every section
    sectionFormData.append("category_id", formData.category_id);
    sectionFormData.append("leader_id", formData.leader_id);
    sectionFormData.append("section", stepNumber);

    switch (stepNumber) {
      case 1: // Personal Information
        {
          const personalInfoFields = [
            "fullName",
            "designation",
            "institutionName",
            "emailId",
            "mobileNumber",
            "yearsOfExperience",
            "linkedinProfile",
          ];

          personalInfoFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              sectionFormData.append(field, formData[field]);
            }
          });
        }
        break;

      case 2: // Placement Data
        {
          const placementDataFields = [
            "studentsEligible",
            "studentsPlaced",
            "highestPackage",
            "averagePackage",
            "companiesVisited",
            "internshipOffers",
            "startupGovtPlacements",
          ];

          placementDataFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              sectionFormData.append(field, formData[field]);
            }
          });
        }
        break;

      case 3: // Key Initiatives & Achievements
        {
          const initiativesFields = [
            "industryPartnerships",
            "placementStrategies",
            "skillDevelopmentPrograms",
            "ruralStudentInitiatives",
            "diversityContribution",
            "careerGuidancePrograms",
            "visionStatement",
          ];

          initiativesFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              sectionFormData.append(field, formData[field]);
            }
          });
        }
        break;

      case 4: // Supporting Documents
        {
          if (
            formData.supportingDocuments &&
            Array.isArray(formData.supportingDocuments)
          ) {
            sectionFormData.append(
              "supportingDocuments",
              JSON.stringify(formData.supportingDocuments)
            );
          }

          // For file fields, send the filename instead of the file object
          const documentFileFields = [
            "hrRecommendationFile",
            "placementBrochureFile",
            "testimonialsFile",
            "photographsFile",
            "pressCoverageFile",
            "certificatesFile",
            "mouPartnershipFile",
            "otherDocumentsFile",
          ];

          documentFileFields.forEach((field) => {
            if (formData[field] && formData[field].filename) {
              sectionFormData.append(field, formData[field].filename);
            }
          });
        }
        break;

      case 5: // Vision & Declaration
        {
          const visionFields = [
            "visionStatementFinal",
            "declaration",
            "digitalSignature",
            "submissionDate",
          ];

          visionFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              sectionFormData.append(field, formData[field]);
            }
          });

          // For file fields, send the filename instead of the file object
          const visionFileFields = ["idCardImage", "digitalSignatureImage"];

          visionFileFields.forEach((field) => {
            if (formData[field] && formData[field].filename) {
              sectionFormData.append(field, formData[field].filename);
            }
          });
        }
        break;

      default:
        console.warn(`Unknown section: ${stepNumber}`);
        break;
    }

    return sectionFormData;
  };

  // Save function remains the same
  const saveFormData = async () => {
    try {
      setSaving(true);

      const sectionData = prepareSectionDataForSaving(currentStep);

      const response = await api.post(
        `${BASE_URL}/internship/nomination/tpo-nominations`,
        sectionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log(`Section ${currentStep} data saved successfully`);
        return true;
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      alert("There was an error saving your progress. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validatePersonalInfo();
    } else if (currentStep === 2) {
      isValid = validatePlacementData();
    } else if (currentStep === 3) {
      isValid = validatePlacementInitiatives();
    } else if (currentStep === 4) {
      isValid = validateSupportingDocuments();
    } else if (currentStep === 5) {
      isValid = validateVisionAndDeclaration();
    }

    if (isValid) {
      const saveSuccess = await saveFormData();

      if (saveSuccess) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
        if (currentStep < steps.length) {
          setCurrentStep(currentStep + 1);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Silent validation functions and other methods remain the same...
  const validatePersonalInfoSilent = () => {
    return (
      formData.fullName.trim() &&
      formData.designation.trim() &&
      formData.institutionName.trim() &&
      formData.emailId.trim() &&
      /\S+@\S+\.\S+/.test(formData.emailId) &&
      formData.mobileNumber.trim() &&
      /^\+?[\d\s-()]+$/.test(formData.mobileNumber) &&
      formData.yearsOfExperience
    );
  };

  const validatePlacementDataSilent = () => {
    return (
      formData.studentsEligible &&
      formData.studentsPlaced &&
      formData.highestPackage &&
      formData.averagePackage &&
      formData.companiesVisited
    );
  };

  const validatePlacementInitiativesSilent = () => {
    if (!formData.visionStatement?.trim()) return false;
    const wordCount = formData.visionStatement
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    return wordCount <= 150;
  };

  const validateSupportingDocumentsSilent = () => {
    return true;
  };

  const validateVisionAndDeclarationSilent = () => {
    if (!formData.visionStatementFinal?.trim()) return false;
    if (!formData.idCardImage || !formData.idCardImage.filename) return false;
    if (!formData.declaration) return false;

    const wordCount = formData.visionStatementFinal
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    return wordCount <= 150;
  };

  const canSubmit = () => {
    const requiredSections = [1, 2, 3, 4, 5];
    return requiredSections.every((sectionId) => {
      if (sectionId === 1) return validatePersonalInfoSilent();
      if (sectionId === 2) return validatePlacementDataSilent();
      if (sectionId === 3) return validatePlacementInitiativesSilent();
      if (sectionId === 4) return validateSupportingDocumentsSilent();
      if (sectionId === 5) return validateVisionAndDeclarationSilent();
      return true;
    });
  };

  // Helper function to prepare FormData for submission
  const prepareFormDataForSubmission = () => {
    const submissionFormData = new FormData();

    // Add all non-file fields to FormData
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      // Skip file fields - they'll be handled separately
      const fileFields = [
        "hrRecommendationFile",
        "placementBrochureFile",
        "testimonialsFile",
        "photographsFile",
        "pressCoverageFile",
        "certificatesFile",
        "mouPartnershipFile",
        "otherDocumentsFile",
        "idCardImage",
        "digitalSignatureImage",
      ];

      if (!fileFields.includes(key)) {
        if (Array.isArray(value)) {
          // Handle arrays (like checkboxes, supportingDocuments, etc.)
          submissionFormData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          submissionFormData.append(key, value);
        }
      }
    });

    // Add file fields as filenames (since files are already uploaded)
    const fileFields = [
      "hrRecommendationFile",
      "placementBrochureFile",
      "testimonialsFile",
      "photographsFile",
      "pressCoverageFile",
      "certificatesFile",
      "mouPartnershipFile",
      "otherDocumentsFile",
      "idCardImage",
      "digitalSignatureImage",
    ];

    fileFields.forEach((field) => {
      if (formData[field] && formData[field].filename) {
        submissionFormData.append(field, formData[field].filename);
      }
    });

    // Add the lastConfirmation key as true for final submission
    submissionFormData.append("lastConfirmation", "true");

    return submissionFormData;
  };

  // Show confirmation modal before final submission
  const handleSubmitClick = () => {
    if (validateVisionAndDeclaration()) {
      setShowConfirmationModal(true);
    }
  };

  // Handle final submission after confirmation
  const handleConfirmedSubmit = async () => {
    setShowConfirmationModal(false);
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    setSubmitting(true);

    // Prepare the FormData for submission
    const submissionFormData = prepareFormDataForSubmission();

    // Log FormData contents for debugging
    for (let [key, value] of submissionFormData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: File - ${value.name} (${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}:`, value);
      }
    }

    try {
      const response = await api.post(
        `${BASE_URL}/internship/nomination/tpo-nominations`,
        submissionFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const result = response.data;
        console.log("Success:", result);
        // After successful submission, fetch the nomination status
        await fetchNominationStatus();
        // The component will automatically re-render based on the updated nomination status
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "There was an error submitting your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!showConfirmationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-[36rem] w-full mx-auto shadow-xl">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Final Submission Confirmation
                </h3>
                <p className="text-sm text-gray-500">
                  Please read carefully before proceeding
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-2">Important Notice:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>
                      Once you submit this application, you{" "}
                      <strong>cannot edit</strong> any information.
                    </li>
                    <li>
                      All your responses will be{" "}
                      <strong>final and locked</strong>.
                    </li>
                    <li>
                      Please ensure all information is{" "}
                      <strong>accurate and complete</strong>.
                    </li>
                    <li>
                      You will not be able to upload additional documents after
                      submission.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Review Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Before submitting:</p>
                  <p>
                    Please review all sections of your application to ensure
                    everything is correct and complete.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel & Review
              </button>
              <button
                onClick={handleConfirmedSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Yes, Submit Final Application"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading nomination status...</p>
        </div>
      </div>
    );
  }

  // Nomination not open
  if (
    (nominationStatus && !nominationStatus.nomination_open) ||
    !nominationStatus.nomination
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Nomination Will Open Soon
              </h1>
              <p className="text-gray-600">
                The nomination period for {nominationStatus.category_name} is
                currently closed. Please check back later.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium">
                    {nominationStatus.full_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Designation:</span>
                  <span className="font-medium">
                    {nominationStatus.designation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Institution:</span>
                  <span className="font-medium">
                    {nominationStatus.institution_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {nominationStatus.email_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="font-medium">
                    {nominationStatus.mobile_number}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Already submitted
  if (nominationStatus && nominationStatus.nomination_submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Nomination Successfully Submitted
              </h1>
              <p className="text-gray-600">
                You have successfully submitted your nomination for{" "}
                {nominationStatus.category_name}.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium">
                    {nominationStatus.full_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Designation:</span>
                  <span className="font-medium">
                    {nominationStatus.designation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Institution:</span>
                  <span className="font-medium">
                    {nominationStatus.institution_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {nominationStatus.email_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="font-medium">
                    {nominationStatus.mobile_number}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Confirmation Modal */}
      <ConfirmationModal />

      <div className="flex gap-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-6">
            {/* Back Button */}
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 group transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {nominationStatus?.category_name ||
                "Placement Officer Excellence Award"}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Complete all sections to submit
            </p>

            {/* Progress Steps */}
            <div className="space-y-3">
              {steps.map((step) => {
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = currentStep === step.id;
                // Sidebar navigation is completely disabled
                const isNavigable = false;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center p-3 rounded-lg border transition-all duration-200 
                      ${
                        isCurrent
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : isCompleted
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }
                      cursor-not-allowed 
                    `}
                  >
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-3
                      ${
                        isCurrent
                          ? "bg-blue-500 text-white"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-400"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-semibold text-sm truncate
                        ${
                          isCurrent
                            ? "text-blue-700"
                            : isCompleted
                            ? "text-green-700"
                            : "text-gray-400"
                        }
                      `}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-xs mt-0.5 truncate
                        ${
                          isCurrent
                            ? "text-blue-600"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-400"
                        }
                      `}
                      >
                        {step.description}
                      </p>
                    </div>
                    {/* Lock icon for all steps */}
                    <div className="flex-shrink-0 ml-2">
                      <svg
                        className="w-3 h-3 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round((completedSteps.size / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(completedSteps.size / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Navigation Guide */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Current step</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mr-2"></div>
                  <svg
                    className="w-2 h-2 text-gray-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Use navigation buttons below</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Terms & Conditions Banner */}
          {showTerms && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">
                      Terms & Conditions
                    </h3>
                    <div className="space-y-3 text-sm text-amber-700">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p>
                          <strong>
                            Please submit as much information as possible
                          </strong>{" "}
                          and upload as much proof of documentation to
                          strengthen your nomination.
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p>
                          <strong>
                            Please gather all required information
                          </strong>{" "}
                          before proceeding with the nomination to ensure a
                          smooth submission process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTerms(false)}
                  className="text-amber-600 hover:text-amber-800 transition-colors duration-200 p-1"
                  aria-label="Close terms notice"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
              <h1 className="text-xl font-bold text-white">
                {steps[currentStep - 1].title}
              </h1>
              <p className="text-blue-100 mt-1 text-sm">
                {steps[currentStep - 1].description}
              </p>
              <div className="mt-3 bg-blue-500 bg-opacity-30 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentStep / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <CurrentStepComponent
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                onRefreshFiles={handleRefreshFiles}
                isFieldDisabled={(fieldName) => {
                  // Disable certain fields based on API data
                  const disabledFields = [
                    "fullName",
                    "designation",
                    "institutionName",
                    "emailId",
                    "mobileNumber",
                  ];
                  return disabledFields.includes(fieldName) && nominationStatus;
                }}
              />

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      currentStep === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-sm"
                    }
                  `}
                >
                  Previous
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={saving}
                    className={`px-6 py-3 rounded-lg font-medium transform transition-all duration-200 shadow-sm flex items-center justify-center min-w-[180px]
                      ${
                        saving
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
                      }
                    `}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save & Proceed"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitClick}
                    disabled={!canSubmit() || submitting}
                    className={`px-6 py-3 rounded-lg font-medium transform transition-all duration-200 shadow-sm flex items-center justify-center min-w-[180px]
                             ${
                               canSubmit() && !submitting
                                 ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md cursor-pointer"
                                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
                             }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : canSubmit() ? (
                      "Submit Application"
                    ) : (
                      "Complete Required Fields"
                    )}
                  </button>
                )}
              </div>

              {/* Required fields note */}
              <div className="text-center mt-3">
                <p className="text-sm text-gray-500">* Required fields</p>
                {currentStep === steps.length && !canSubmit() && (
                  <p className="text-sm text-amber-600 mt-1 font-medium">
                    Please complete all required fields in previous sections to
                    submit
                  </p>
                )}
                {saving && (
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    Saving your progress...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
