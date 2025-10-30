import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Award,
  BookOpen,
  Target,
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
import PersonalInformation from "./PersonalInformation";
import LeadershipAchievements from "./LeadershipAchievements";
import ResearchPublications from "./ResearchPublications";
import ProjectsGrants from "./ProjectsGrants";
import NEPImplementation from "./NEPImplementation";
import SupportingDocuments from "./SupportingDocuments";
import VisionAndDeclaration from "./VisionAndDeclaration";
import { BASE_URL } from "../../../services/configUrls";
import api from "../../../services/api";

export default function MultiStepForm() {
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
    officialWebsite: "",
    linkedinProfile: "",

    // Leadership and Achievements
    yearsOfService: "",
    tenureAsPrincipal: "",
    keyContributions: "",
    notableAchievements: "",
    visionStatement: "",
    digitalInitiatives: "",
    communityEngagement: "",
    institutionalReforms: "",
    industryCollaboration: "",
    supportUnderrepresented: "",
    recognitionAwards: "",

    // Research Publications
    internationalJournals: "",
    nationalJournals: "",
    totalBooks: "",
    chaptersInBooks: "",
    patentsFiled: "",
    patentsPublished: "",
    patentsGranted: "",
    totalValue: "",
    fundingAgencies: "",
    editorialMembership: "",
    researchContribution1: "",
    researchContribution2: "",
    researchContribution3: "",

    // Projects & Grants
    projectTypes: [],
    totalProjects: "",
    totalFunding: "",
    majorProjects: [
      { title: "", agency: "", year: "", role: "", amount: "", outcome: "" },
      { title: "", agency: "", year: "", role: "", amount: "", outcome: "" },
      { title: "", agency: "", year: "", role: "", amount: "", outcome: "" },
    ],
    govSchemes: [],
    otherFunding: "",
    industryCollaborationProjects: "",
    industryDetails: "",
    aicteFile: null,
    dstFile: null,
    ugcFile: null,
    worldbankFile: null,
    msmeFile: null,
    csrFile: null,

    // NEP Implementation
    nepAdoption: "",
    nepInitiatives: "",
    nepReforms: [],
    nationalCollaboration: "",
    partnerBody: "",
    collaborationNature: "",
    studentOutcomes: "",
    nepChallenges: "",

    // Supporting Documents
    supportingDocuments: [],
    cvFile: null,
    publicationsFile: null,
    patentsFile: null,
    mousFile: null,
    testimonialsFile: null,
    achievementsFile: null,
    awardsFile: null,
    otherDocumentsFile: null,

    // Vision and Declaration
    visionStatementFinal: "",
    declaration: false,
    digitalSignature: "",
    digitalSignatureImage: null,
    institutionIdCard: null,
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

      // If we have leader_id and category_id, fetch existing form data
      if (data.leader_id && data.category_id) {
        await fetchExistingFormData(data.leader_id, data.category_id);
      }
    } catch (error) {
      console.error("Error fetching nomination status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch uploaded files
  const fetchUploadedFiles = async (leaderId, categoryId) => {
    try {
      const response = await api.get(
        `${BASE_URL}/internship/nomination/leader/files/${leaderId}/${categoryId}`,
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

  // Handle refresh files function
  const handleRefreshFiles = async () => {
    if (formData.leader_id && formData.category_id) {
      await fetchUploadedFiles(formData.leader_id, formData.category_id);
    }
  };

  // New function to fetch existing form data
  const fetchExistingFormData = async (leaderId, categoryId) => {
    try {
      const response = await api.get(
        `${BASE_URL}/internship/nomination/leader/${leaderId}/${categoryId}`,
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
          // Personal Information (keep basic info from status API)
          officialWebsite: existingData.officialWebsite || prev.officialWebsite,
          linkedinProfile: existingData.linkedinProfile || prev.linkedinProfile,

          // Leadership and Achievements
          yearsOfService: existingData.yearsOfService || prev.yearsOfService,
          tenureAsPrincipal:
            existingData.tenureAsPrincipal || prev.tenureAsPrincipal,
          keyContributions:
            existingData.keyContributions || prev.keyContributions,
          notableAchievements:
            existingData.notableAchievements || prev.notableAchievements,
          visionStatement: existingData.visionStatement || prev.visionStatement,
          digitalInitiatives:
            existingData.digitalInitiatives || prev.digitalInitiatives,
          communityEngagement:
            existingData.communityEngagement || prev.communityEngagement,
          institutionalReforms:
            existingData.institutionalReforms || prev.institutionalReforms,
          industryCollaboration:
            existingData.industryCollaboration || prev.industryCollaboration,
          supportUnderrepresented:
            existingData.supportUnderrepresented ||
            prev.supportUnderrepresented,
          recognitionAwards:
            existingData.recognitionAwards || prev.recognitionAwards,

          // Research Publications
          internationalJournals:
            existingData.internationalJournals || prev.internationalJournals,
          nationalJournals:
            existingData.nationalJournals || prev.nationalJournals,
          totalBooks: existingData.totalBooks || prev.totalBooks,
          chaptersInBooks: existingData.chaptersInBooks || prev.chaptersInBooks,
          patentsFiled: existingData.patentsFiled || prev.patentsFiled,
          patentsPublished:
            existingData.patentsPublished || prev.patentsPublished,
          patentsGranted: existingData.patentsGranted || prev.patentsGranted,
          totalValue: existingData.totalValue || prev.totalValue,
          fundingAgencies: existingData.fundingAgencies || prev.fundingAgencies,
          editorialMembership:
            existingData.editorialMembership || prev.editorialMembership,
          researchContribution1:
            existingData.researchContribution1 || prev.researchContribution1,
          researchContribution2:
            existingData.researchContribution2 || prev.researchContribution2,
          researchContribution3:
            existingData.researchContribution3 || prev.researchContribution3,

          // Projects & Grants
          totalProjects: existingData.totalProjects || prev.totalProjects,
          totalFunding: existingData.totalFunding || prev.totalFunding,
          otherFunding: existingData.otherFunding || prev.otherFunding,
          industryCollaborationProjects:
            existingData.industryCollaborationProjects ||
            prev.industryCollaborationProjects,
          industryDetails: existingData.industryDetails || prev.industryDetails,

          // Parse JSON arrays if they exist
          projectTypes: existingData.projectTypes
            ? typeof existingData.projectTypes === "string"
              ? JSON.parse(existingData.projectTypes)
              : existingData.projectTypes
            : prev.projectTypes,

          majorProjects: existingData.majorProjects
            ? typeof existingData.majorProjects === "string"
              ? JSON.parse(existingData.majorProjects)
              : existingData.majorProjects
            : prev.majorProjects,

          govSchemes: existingData.govSchemes
            ? typeof existingData.govSchemes === "string"
              ? JSON.parse(existingData.govSchemes)
              : existingData.govSchemes
            : prev.govSchemes,

          // NEP Implementation
          nepAdoption: existingData.nepAdoption || prev.nepAdoption,
          nepInitiatives: existingData.nepInitiatives || prev.nepInitiatives,
          nationalCollaboration:
            existingData.nationalCollaboration || prev.nationalCollaboration,
          partnerBody: existingData.partnerBody || prev.partnerBody,
          collaborationNature:
            existingData.collaborationNature || prev.collaborationNature,
          studentOutcomes: existingData.studentOutcomes || prev.studentOutcomes,
          nepChallenges: existingData.nepChallenges || prev.nepChallenges,

          nepReforms: existingData.nepReforms
            ? typeof existingData.nepReforms === "string"
              ? JSON.parse(existingData.nepReforms)
              : existingData.nepReforms
            : prev.nepReforms,

          // Supporting Documents
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
          submissionDate: existingData.submissionDate || prev.submissionDate,

          // Note: File fields cannot be pre-populated as they are File objects
        }));

        // Fetch uploaded files information
        await fetchUploadedFiles(leaderId, categoryId);

        // Mark sections as completed based on existing data
        const completedSections = new Set();

        // Check Personal Information completion (basic fields always present from status)
        completedSections.add(1);

        // Check Leadership & Achievements completion
        if (
          existingData.yearsOfService &&
          existingData.tenureAsPrincipal &&
          existingData.keyContributions &&
          existingData.visionStatement
        ) {
          completedSections.add(2);
        }

        // Check Research Publications completion
        if (
          (existingData.internationalJournals ||
            existingData.internationalJournals === "0") &&
          (existingData.nationalJournals ||
            existingData.nationalJournals === "0")
        ) {
          completedSections.add(3);
        }

        // Check Projects & Grants completion
        if (existingData.totalProjects && existingData.totalFunding) {
          completedSections.add(4);
        }

        // Check NEP Implementation completion
        if (existingData.nepAdoption) {
          completedSections.add(5);
        }

        // Check Supporting Documents completion (optional section)
        completedSections.add(6);

        // Check Vision & Declaration completion
        if (
          existingData.visionStatementFinal &&
          existingData.declaration &&
          existingData.digitalSignature &&
          existingData.submissionDate
        ) {
          completedSections.add(7);
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

  const steps = [
    {
      id: 1,
      title: "Personal Information",
      description: "Basic personal and contact details",
      icon: User,
      component: PersonalInformation,
    },
    {
      id: 2,
      title: "Leadership & Achievements",
      description: "Academic leadership and contributions",
      icon: Award,
      component: LeadershipAchievements,
    },
    {
      id: 3,
      title: "Research & Publications",
      description: "Research work and publications",
      icon: BookOpen,
      component: ResearchPublications,
    },
    {
      id: 4,
      title: "Projects & Grants",
      description: "Funded projects and grants",
      icon: Target,
      component: ProjectsGrants,
    },
    {
      id: 5,
      title: "NEP 2020 Implementation",
      description: "NEP 2020 reforms and initiatives",
      icon: FileText,
      component: NEPImplementation,
    },
    {
      id: 6,
      title: "Supporting Documents",
      description: "Upload documents and links",
      icon: CheckCircle,
      component: SupportingDocuments,
    },
    {
      id: 7,
      title: "Vision & Declaration",
      description: "Final vision and submission",
      icon: ClipboardCheck,
      component: VisionAndDeclaration,
    },
  ];

  // Helper function to convert string to number for API payload
  const convertToNumber = (value) => {
    if (value === "" || value === null || value === undefined) {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper function to convert string to integer for API payload
  const convertToInt = (value) => {
    if (value === "" || value === null || value === undefined) {
      return 0;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Section-wise save function for Leadership Excellence form
  const prepareLeadershipSectionDataForSaving = (stepNumber) => {
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
            "officialWebsite",
            "linkedinProfile",
          ];

          personalInfoFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              sectionFormData.append(field, formData[field]);
            }
          });
        }
        break;

      case 2: // Leadership & Achievements
        {
          // All fields remain as strings - no conversion
          const leadershipFields = [
            "yearsOfService",
            "tenureAsPrincipal",
            "keyContributions",
            "notableAchievements",
            "visionStatement",
            "digitalInitiatives",
            "communityEngagement",
            "institutionalReforms",
            "industryCollaboration",
            "supportUnderrepresented",
            "recognitionAwards",
          ];

          // Keep all fields as strings
          leadershipFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              sectionFormData.append(field, formData[field]);
            }
          });
        }
        break;

      case 3: // Research & Publications
        {
          // All fields remain as strings - no conversion
          const researchFields = [
            "internationalJournals",
            "nationalJournals",
            "totalBooks",
            "chaptersInBooks",
            "patentsFiled",
            "patentsPublished",
            "patentsGranted",
            "totalValue",
            "fundingAgencies",
            "editorialMembership",
            "researchContribution1",
            "researchContribution2",
            "researchContribution3",
          ];

          // Keep all fields as strings
          researchFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              sectionFormData.append(field, formData[field]);
            }
          });
        }
        break;

      case 4: // Projects & Grants
        {
          // All fields remain as strings - no conversion
          const projectFields = [
            "totalProjects",
            "totalFunding",
            "otherFunding",
            "industryCollaborationProjects",
            "industryDetails",
          ];

          // Keep all fields as strings
          projectFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              sectionFormData.append(field, formData[field]);
            }
          });

          // Handle arrays
          if (formData.projectTypes && Array.isArray(formData.projectTypes)) {
            sectionFormData.append(
              "projectTypes",
              JSON.stringify(formData.projectTypes)
            );
          }
          if (formData.majorProjects && Array.isArray(formData.majorProjects)) {
            sectionFormData.append(
              "majorProjects",
              JSON.stringify(formData.majorProjects)
            );
          }
          if (formData.govSchemes && Array.isArray(formData.govSchemes)) {
            sectionFormData.append(
              "govSchemes",
              JSON.stringify(formData.govSchemes)
            );
          }

          // Handle government scheme files - send filenames if uploaded via API
          const govSchemeFileFields = [
            "aicteFile",
            "dstFile",
            "ugcFile",
            "worldbankFile",
            "msmeFile",
            "csrFile",
          ];

          govSchemeFileFields.forEach((field) => {
            if (formData[field] && formData[field].filename) {
              sectionFormData.append(field, formData[field].filename);
            }
          });
        }
        break;

      case 5: // NEP Implementation
        {
          const nepFields = [
            "nepAdoption",
            "nepInitiatives",
            "nationalCollaboration",
            "partnerBody",
            "collaborationNature",
            "studentOutcomes",
            "nepChallenges",
          ];

          nepFields.forEach((field) => {
            if (formData[field] !== null && formData[field] !== undefined) {
              sectionFormData.append(field, formData[field]);
            }
          });

          // Handle NEP reforms array
          if (formData.nepReforms && Array.isArray(formData.nepReforms)) {
            sectionFormData.append(
              "nepReforms",
              JSON.stringify(formData.nepReforms)
            );
          }
        }
        break;

      case 6: // Supporting Documents
        {
          // Handle supporting documents array
          if (
            formData.supportingDocuments &&
            Array.isArray(formData.supportingDocuments)
          ) {
            sectionFormData.append(
              "supportingDocuments",
              JSON.stringify(formData.supportingDocuments)
            );
          }

          // Handle file uploads for section 6 - send filenames if uploaded via API
          const supportingDocFileFields = [
            "cvFile",
            "publicationsFile",
            "patentsFile",
            "mousFile",
            "testimonialsFile",
            "achievementsFile",
            "awardsFile",
            "otherDocumentsFile",
          ];

          supportingDocFileFields.forEach((field) => {
            if (formData[field] && formData[field].filename) {
              sectionFormData.append(field, formData[field].filename);
            }
          });
        }
        break;

      case 7: // Vision & Declaration
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

          // Handle file uploads for section 7 - send filenames if uploaded via API
          const visionFileFields = [
            "digitalSignatureImage",
            "institutionIdCard",
          ];

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

  // Save function
  const saveFormData = async () => {
    try {
      setSaving(true);

      const sectionData = prepareLeadershipSectionDataForSaving(currentStep);

      const response = await api.post(
        `${BASE_URL}/internship/nomination/leader/submit`,
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

  // Validation functions
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
    if (
      formData.officialWebsite &&
      !/^https?:\/\/.+/.test(formData.officialWebsite)
    ) {
      newErrors.officialWebsite = "Please enter a valid URL";
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

  const validateLeadershipAchievements = () => {
    const newErrors = {};

    if (!formData.yearsOfService)
      newErrors.yearsOfService = "Years of service is required";
    if (!formData.tenureAsPrincipal)
      newErrors.tenureAsPrincipal = "Tenure as principal is required";
    if (!formData.keyContributions.trim())
      newErrors.keyContributions = "Key contributions are required";
    if (!formData.visionStatement.trim())
      newErrors.visionStatement = "Vision statement is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResearchPublications = () => {
    const newErrors = {};

    if (
      !formData.internationalJournals &&
      formData.internationalJournals !== "0"
    )
      newErrors.internationalJournals =
        "Please enter number of international journal publications";
    if (!formData.nationalJournals && formData.nationalJournals !== "0")
      newErrors.nationalJournals =
        "Please enter number of national journal publications";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProjectsGrants = () => {
    const newErrors = {};

    if (!formData.totalProjects)
      newErrors.totalProjects = "Total number of projects is required";
    if (!formData.totalFunding)
      newErrors.totalFunding = "Total funding amount is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNEPImplementation = () => {
    const newErrors = {};

    if (!formData.nepAdoption)
      newErrors.nepAdoption = "NEP 2020 adoption status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSupportingDocuments = () => {
    setErrors({});
    return true;
  };

  const validateVisionAndDeclaration = () => {
    const newErrors = {};

    if (!formData.visionStatementFinal.trim())
      newErrors.visionStatementFinal = "Vision statement is required";
    if (!formData.declaration)
      newErrors.declaration = "You must accept the declaration";
    // if (!formData.digitalSignature.trim())
    //   newErrors.digitalSignature = "Digital signature (full name) is required";
    // if (!formData.submissionDate)
    //   newErrors.submissionDate = "Submission date is required";
    if (!formData.institutionIdCard || !formData.institutionIdCard.filename)
      newErrors.institutionIdCard = "Institution ID card is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validatePersonalInfo();
    } else if (currentStep === 2) {
      isValid = validateLeadershipAchievements();
    } else if (currentStep === 3) {
      isValid = validateResearchPublications();
    } else if (currentStep === 4) {
      isValid = validateProjectsGrants();
    } else if (currentStep === 5) {
      isValid = validateNEPImplementation();
    } else if (currentStep === 6) {
      isValid = validateSupportingDocuments();
    } else if (currentStep === 7) {
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

  // Silent validation functions
  const validatePersonalInfoSilent = () => {
    return (
      formData.fullName.trim() &&
      formData.designation.trim() &&
      formData.institutionName.trim() &&
      formData.emailId.trim() &&
      /\S+@\S+\.\S+/.test(formData.emailId) &&
      formData.mobileNumber.trim() &&
      /^\+?[\d\s-()]+$/.test(formData.mobileNumber)
    );
  };

  const validateLeadershipAchievementsSilent = () => {
    return (
      formData.yearsOfService &&
      formData.tenureAsPrincipal &&
      formData.keyContributions.trim() &&
      formData.visionStatement.trim()
    );
  };

  const validateResearchPublicationsSilent = () => {
    return (
      (formData.internationalJournals ||
        formData.internationalJournals === "0") &&
      (formData.nationalJournals || formData.nationalJournals === "0")
    );
  };

  const validateProjectsGrantsSilent = () => {
    return formData.totalProjects && formData.totalFunding;
  };

  const validateNEPImplementationSilent = () => {
    return formData.nepAdoption;
  };

  const validateSupportingDocumentsSilent = () => {
    return true;
  };

  const validateVisionAndDeclarationSilent = () => {
    return (
      formData.visionStatementFinal &&
      formData.visionStatementFinal.trim() &&
      formData.declaration &&
      // formData.digitalSignature &&
      // formData.digitalSignature.trim() &&
      // formData.submissionDate &&
      formData.institutionIdCard &&
      formData.institutionIdCard.filename
    );
  };

  const canSubmit = () => {
    const requiredSections = [1, 2, 3, 4, 5, 6, 7];
    return requiredSections.every((sectionId) => {
      if (sectionId === 1) return validatePersonalInfoSilent();
      if (sectionId === 2) return validateLeadershipAchievementsSilent();
      if (sectionId === 3) return validateResearchPublicationsSilent();
      if (sectionId === 4) return validateProjectsGrantsSilent();
      if (sectionId === 5) return validateNEPImplementationSilent();
      if (sectionId === 6) return validateSupportingDocumentsSilent();
      if (sectionId === 7) return validateVisionAndDeclarationSilent();
      return true;
    });
  };

  // Prepare form data for final submission
  // Modified final submission data preparation - keep numeric fields as strings
  const prepareFormDataForSubmission = () => {
    const submissionFormData = new FormData();

    // Remove the field type categorization - treat all as strings
    const fileFields = [
      "cvFile",
      "publicationsFile",
      "patentsFile",
      "mousFile",
      "testimonialsFile",
      "achievementsFile",
      "awardsFile",
      "otherDocumentsFile",
      "aicteFile",
      "dstFile",
      "ugcFile",
      "worldbankFile",
      "msmeFile",
      "csrFile",
      "digitalSignatureImage",
      "institutionIdCard",
    ];

    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if (!fileFields.includes(key)) {
        if (Array.isArray(value)) {
          // Keep arrays as JSON strings
          submissionFormData.append(key, JSON.stringify(value));
        } else if (key === "majorProjects") {
          // Handle majorProjects array
          submissionFormData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          // Keep ALL fields as strings - no numeric conversion
          submissionFormData.append(key, String(value));
        }
      }
    });

    // Add file fields as filenames (since files are already uploaded)
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

    const submissionFormData = prepareFormDataForSubmission();

    console.log("Form submitted with FormData:");
    for (let [key, value] of submissionFormData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: File - ${value.name} (${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}:`, value);
      }
    }

    console.log("Major Projects Array:", formData.majorProjects);

    try {
      const response = await api.post(
        `${BASE_URL}/internship/nomination/leader/submit`,
        submissionFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        await fetchNominationStatus();
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
      <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
          <p className="text-gray-600">
            Loading nomination status and existing data...
          </p>
        </div>
      </div>
    );
  }

  // Nomination not open
  if (nominationStatus && !nominationStatus.nomination_open) {
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
                "Education Leadership Excellence Award"}
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
                        : "bg-blue-400 text-gray-700 hover:bg-gray-300 hover:shadow-sm"
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
