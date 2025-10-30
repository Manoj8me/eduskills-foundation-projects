import React, { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import {
  fetchProgramsData,
  fetchInstituteDetails,
  fetchLeaders,
} from "../../services/api";
import { BASE_URL } from "../../services/configUrls";
import EducationTypeSelector from "./EducationTypeSelector";
import InstituteInfo from "./InstituteInfo";
import Tabs from "./Tabs";
import AddressTab from "./tabs/AddressTab";
import AuthorityTab from "./tabs/AuthorityTab";
import UGProgramTab from "./tabs/UGProgramTab";
import PGProgramTab from "./tabs/PGProgramTab";
import ActionButtons from "./ActionButton";
import axios from "axios";

export default function NewEducationForm({ handleClose }) {
  // State for education type
  const [educationType, setEducationType] = useState({
    "UG Program": false,
    "PG Program": false,
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  // Base form data
  const [formData, setFormData] = useState({
    instituteName: "",
    institute_name: "",  // Added this field to handle both naming conventions
    website_url: "",
    address: {
      country: "India",
      state: "",
      city: "",
      street1: "",
      street2: "",
      postalCode: "",
    },
    logo: null,
    managementDetails: [
      { designation: "", name: "", email: "", phone: "", localDesignation: "" },
    ],
    academyDetails: [
      { designation: "", name: "", email: "", phone: "", localDesignation: "" },
    ],
    placementDetails: [
      { designation: "", name: "", email: "", phone: "", localDesignation: "" },
    ],
    otherDetails: [
      { designation: "", name: "", email: "", phone: "", localDesignation: "" },
    ],
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState("Address");

  // Program states
  const [programsData, setProgramsData] = useState({ ug: [], pg: [] });
  const [ugPrograms, setUgPrograms] = useState([]);
  const [pgPrograms, setPgPrograms] = useState([]);
  const [programPassoutYears, setProgramPassoutYears] = useState({});
  const [programBranches, setProgramBranches] = useState({});
  const [programPgPassoutYears, setProgramPgPassoutYears] = useState({});
  const [programPgBranches, setProgramPgBranches] = useState({});
  const [ugEditedPrograms, setUgEditedPrograms] = useState([]);
  const [pgEditedPrograms, setPgEditedPrograms] = useState([]);

  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [programsError, setProgramsError] = useState(null);

  // Fetch institute profile data
  useEffect(() => {
    const fetchInstituteProfile = async () => {
      try {
        setLoading(true);
        setProfileError(null);

        // First try to fetch the profile data
        const response = await fetch(
          `${BASE_URL}/internship/fetch_institute_profile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        
        // If the response is 404 or another status that indicates no data exists yet,
        // we'll just use the default form values for a new form
        if (response.status === 404) {
          console.log("No existing profile found - creating new form");
          setLoading(false);
          return; // Exit early - no data to process
        }
        
        if (!response.ok) {
          // For other error types, throw an error
          throw new Error(`Failed to fetch institute profile: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Institute profile data:", data);
        
        // Only process data if we actually received something meaningful
        if (data && Object.keys(data).length > 0) {
          // Handle management authority data
          const normalizedManagement = data.authority_management?.map((item) => ({
            designation: item.degignation || item.designation || "", // handle both spellings
            name: item.name || "",
            email: item.email || "",
            phone: item.phone || "",
            localDesignation: item.localDesignation || "",
          })) || [
            {
              designation: "",
              name: "",
              email: "",
              phone: "",
              localDesignation: "",
            },
          ];
          
          // Handle academy authority data
          const normalizedAcademy = data.authority_academy?.map((item) => ({
            designation: item.degignation || item.designation || "",
            name: item.name || "",
            email: item.email || "",
            phone: item.phone || "",
            localDesignation: item.localDesignation || "",
          })) || [
            {
              designation: "",
              name: "",
              email: "",
              phone: "",
              localDesignation: "",
            },
          ];

          // Handle placement authority data
          const normalizedPlacement = data.authority_placement?.map((item) => ({
            designation: item.degignation || item.designation || "",
            name: item.name || "",
            email: item.email || "",
            phone: item.phone || "",
            localDesignation: item.localDesignation || "",
          })) || [
            {
              designation: "",
              name: "",
              email: "",
              phone: "",
              localDesignation: "",
            },
          ];

          // Handle other authority data
          const normalizedOthers = data.other_authority?.map((item) => ({
            designation: item.degignation || item.designation || "",
            name: item.name || "",
            email: item.email || "",
            phone: item.phone || "",
            localDesignation: item.localDesignation || "",
          })) || [
            {
              designation: "",
              name: "",
              email: "",
              phone: "",
              localDesignation: "",
            },
          ];
          
          // Handle address data correctly
          const address = {
            country: data.address?.country || "India",
            state: data.address?.state || "",
            city: data.address?.city || "",
            street1: data.address?.street1 || "",
            street2: data.address?.street2 || "",
            postalCode: data.address?.postalCode || "",
          };
          
          // Set form data with all fields
          setFormData(prevData => ({
            ...prevData,
            instituteName: data.institute_name || "",  // Ensure both fields are set
            institute_name: data.institute_name || "",
            website_url: data.website_url || "",
            logo: data.institute_logo || null,
            address: address,
            managementDetails: normalizedManagement,
            academyDetails: normalizedAcademy,
            placementDetails: normalizedPlacement,
            otherDetails: normalizedOthers,
          }));

          // Set education type
          if (data.education_type) {
            // Handle education_type if it's a string or an array
            let eduTypes = [];
            if (typeof data.education_type === 'string') {
              eduTypes = data.education_type.split(',').map(type => type.trim());
            } else if (Array.isArray(data.education_type)) {
              eduTypes = data.education_type;
            }
            
            setEducationType({
              "UG Program": eduTypes.includes("UG"),
              "PG Program": eduTypes.includes("PG"),
            });
          }
          
          // Handle UG program data
          if (data.ug_intake && data.ug_intake.programs) {
            setUgPrograms(data.ug_intake.programs);
            setProgramPassoutYears(data.ug_intake.programPassoutYears || {});
            setProgramBranches(data.ug_intake.programBranches || {});
          }
          
          // Handle PG program data
          if (data.pg_intake && data.pg_intake.programs) {
            setPgPrograms(data.pg_intake.programs);
            setProgramPgPassoutYears(data.pg_intake.programPassoutYears || {});
            setProgramPgBranches(data.pg_intake.programBranches || {});
          }
        }
      } catch (err) {
        console.error("Error fetching institute profile:", err);
        // Set a specific error for profile fetching, but don't block the form
        setProfileError("Couldn't load existing profile data, continuing with empty form.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstituteProfile();
  }, []);

  // Fetch programs data
  useEffect(() => {
    const fetchAllProgramsData = async () => {
      setIsLoading(true);
      setProgramsError(null);
      try {
        const response = await axios.get(
          `${BASE_URL}/internship/programs_branches`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }
          }
        );
        
        const data = response.data;
        console.log("Programs and branches data:", data);

        // If no programs data is available, just silently continue with empty arrays
        if (!data || !data.programs || !Array.isArray(data.programs)) {
          console.log("No programs data available or invalid format");
          setProgramsData({
            ug: [],
            pg: []
          });
          return;
        }

        // Separate UG and PG programs
        const ugPrograms = data.programs.filter((p) => p.ispg === 0);
        const pgPrograms = data.programs.filter((p) => p.ispg === 1);

        // Validate and prepare programs
        const validatePrograms = (programs, type) => {
          return programs.map((program) => {
            if (!program.program_id) {
              console.warn(`${type} program is missing ID: ${program.program_name}`);
              // Create a temporary ID to prevent errors
              return { ...program, program_id: `temp_${Math.random().toString(36).substr(2, 9)}` };
            }

            if (typeof program.duration !== "number" || program.duration <= 0) {
              console.warn(`Invalid duration for ${type} program ${program.program_name}, using default`);
              return { ...program, duration: type === "UG" ? 4 : 2 };
            }
            return program;
          });
        };

        const validatedUgPrograms = validatePrograms(ugPrograms, "UG");
        const validatedPgPrograms = validatePrograms(pgPrograms, "PG");

        // Group branches by program_id
        const branchesByProgram = {};
        if (data.branches && Array.isArray(data.branches)) {
          data.branches.forEach((branch) => {
            if (!branch || !branch.program_id) return; // Skip invalid entries
            
            if (!branchesByProgram[branch.program_id]) {
              branchesByProgram[branch.program_id] = [];
            }
            if (branch.branch_name) {
              branchesByProgram[branch.program_id].push(branch.branch_name);
            }
          });
        }
        
        // Enhance program objects with branches
        const enhancedUgPrograms = validatedUgPrograms.map((program) => ({
          ...program,
          name: program.program_name || "Unknown Program",
          branches: branchesByProgram[program.program_id] || [],
        }));

        const enhancedPgPrograms = validatedPgPrograms.map((program) => ({
          ...program,
          name: program.program_name || "Unknown Program",
          branches: branchesByProgram[program.program_id] || [],
        }));

        // Update state with API data
        setProgramsData({
          ug: enhancedUgPrograms,
          pg: enhancedPgPrograms,
        });
      } catch (error) {
        console.error("Error fetching programs data:", error);
        setProgramsError("Could not load programs list. You can continue filling out the form.");
        // Set empty arrays as fallback
        setProgramsData({
          ug: [],
          pg: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch institute details from separate endpoint
    const fetchInstituteDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/internship/institute_details`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch institute details");

        const result = await response.json();
        const data = result.data;
        console.log("Institute details:", data);

        // Only update these fields if they're empty in the form
        setFormData((prev) => ({
          ...prev,
          instituteName: prev.instituteName || data.institute_name || "",
          institute_name: prev.institute_name || data.institute_name || "",
          address: {
            ...prev.address,
            city: prev.address.city || data.city_name || "",
            state: prev.address.state || data.state_name || "",
          },
        }));
      } catch (err) {
        console.error("Error fetching institute details:", err);
      }
    };

    // Fetch academy leaders
    const fetchAcademyLeaders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/internship/academy_leader`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Academy leaders:", data);
          // Process academy leaders data if needed
        } else {
          throw new Error("Failed to fetch academy leaders");
        }
      } catch (err) {
        console.error("Error fetching academy leaders:", err);
        setError("Failed to fetch academy leaders.");
      }
    };

    fetchAllProgramsData();
    fetchInstituteDetails();
    fetchAcademyLeaders();
  }, []);

  // Handle input change
  const handleChange = (field, value) => {
    setFormData((prevState) => {
      // If updating instituteName, also update institute_name to keep them in sync
      if (field === 'instituteName') {
        return {
          ...prevState,
          [field]: value,
          institute_name: value
        };
      }
      // Otherwise, just update the specified field
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  // Function to handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    console.log(`Checkbox changed: ${name} to ${checked}`);
    
    // Update the education type state
    setEducationType((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
    
    // Ensure proper tab navigation when education types are changed
    if (name === "UG Program" && checked) {
      // Make sure UG Programs tab data is ready (can add loading state here if needed)
      if (programsData.ug.length === 0) {
        console.log("No UG program data available yet");
      }
    }
    
    if (name === "PG Program" && checked) {
      // Make sure PG Programs tab data is ready (can add loading state here if needed)
      if (programsData.pg.length === 0) {
        console.log("No PG program data available yet");
      }
    }
  };

  // Dynamic rendering of tabs
  const getTabs = () => {
    const baseTabs = ["Address", "Authority Details"];
    if (educationType["UG Program"]) {
      baseTabs.push("UG Program Details");
    }
    if (educationType["PG Program"]) {
      baseTabs.push("PG Program Details");
    }
    return baseTabs;
  };

  const handleSave = async () => {
    try {
      // Validate the form data
      if (!validateForm()) {
        return;
      }

      // Set loading state
      setIsLoading(true);

      // Construct education type array
      const eduTypeArray = [];
      if (educationType["UG Program"]) eduTypeArray.push("UG");
      if (educationType["PG Program"]) eduTypeArray.push("PG");

      // Prepare the payload
      const instituteData = {
        institute_name: formData.instituteName || formData.institute_name,
        education_type: eduTypeArray.join(', '),
        institute_logo: formData.logo,
        website_url: formData.website_url,
        ug_intake:
          ugPrograms.length > 0
            ? {
                programs: ugPrograms,
                programPassoutYears,
                programBranches,
              }
            : null,
        pg_intake:
          pgPrograms.length > 0
            ? {
                programs: pgPrograms,
                programPassoutYears: programPgPassoutYears,
                programBranches: programPgBranches,
              }
            : null,
        authority_management: formData.managementDetails,
        authority_placement: formData.placementDetails,
        authority_academy: formData.academyDetails,
        other_authority: formData.otherDetails,
        address: formData.address,
      };

      console.log("Saving institute data:", instituteData);

      // Call your API to save the data
      const response = await fetch(`${BASE_URL}/internship/institute_profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(instituteData),
      });

      if (response.ok) {
        alert("Institute data saved successfully!");
        if (handleClose) handleClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save institute data");
      }
    } catch (error) {
      console.error("Error saving institute data:", error);
      alert(
        `Failed to save institute data: ${
          error.message || "Please check and try again."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Only PNG or JPG files are allowed.");
      return;
    }
  
    if (file.size > 200 * 1024) { // 200KB = 200 * 1024 bytes
      alert("Please upload an image smaller than 200KB.");
      return;
    }
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  const handleRemoveLogo = () => {
  setFormData(prev => ({ ...prev, logo: null }));
};
const validateForm = () => {
  if (!formData.instituteName?.trim() && !formData.institute_name?.trim()) {
    alert("Please enter the institute name.");
    return false;
  }
const urlRegex = /^(https?:\/\/)?([\w\d-]+\.){1,}([a-zA-Z]{2,})(\/.*)?$/;
if (formData.website_url?.trim() && !urlRegex.test(formData.website_url)) {
  alert("Please enter a valid Website URL.");
  return false;
}

  if (!educationType["UG Program"] && !educationType["PG Program"]) {
    alert("Please select at least one Education Type: UG or PG.");
    return false;
  }

  // 🔒 UG Program validations (only if UG is selected)
  if (educationType["UG Program"]) {
    if (!ugPrograms || ugPrograms.length === 0) {
      alert("UG Program is selected. Please select at least one UG Program.");
      return false;
    }
    if (!programBranches || programBranches.length === 0) {
      alert("UG Program is selected. Please select at least one UG Branch.");
      return false;
    }
  }

  // 🔒 PG Program validations (only if PG is selected)
  if (educationType["PG Program"]) {
    if (!pgPrograms || pgPrograms.length === 0) {
      alert("PG Program is selected. Please select at least one PG Program.");
      return false;
    }
    if (!programPgBranches || programPgBranches.length === 0) {
      alert("PG Program is selected. Please select at least one PG Branch.");
      return false;
    }
  }

  const isAuthorityEntryValid = (entry) =>
    entry &&
    (entry.designation?.trim() || entry.degignation?.trim()) &&
    entry.name?.trim() &&
    entry.email?.trim() &&
    entry.phone?.trim();

  if (
    !formData.managementDetails ||
    !formData.managementDetails.some(isAuthorityEntryValid)
  ) {
    alert("Please provide at least one valid Management authority.");
    setActiveTab("Authority Details");
    return false;
  }

  if (
    !formData.placementDetails ||
    !formData.placementDetails.some(isAuthorityEntryValid)
  ) {
    alert("Please provide at least one valid Placement authority.");
    setActiveTab("Authority Details");
    return false;
  }

  if (
    !formData.academyDetails ||
    !formData.academyDetails.some(isAuthorityEntryValid)
  ) {
    alert("Please provide at least one valid Academy authority.");
    setActiveTab("Authority Details");
    return false;
  }

  return true;
};

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header area with logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-medium text-gray-800">
              Institute Profile Details
            </h2>
          </div>
        </div>
        
        {/* Display profile error if any */}
        {/* {profileError && (
          <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">
              Note: {profileError} You can fill out the form as a new profile.
            </p>
          </div>
        )} */}

        <div className="p-6">
          {/* Education Type Selection */}
          <EducationTypeSelector
            educationType={educationType}
            onChange={handleCheckboxChange}
          />

          {/* Institute Info (Name & Website) */}
          <InstituteInfo
            instituteName={formData.instituteName || formData.institute_name}
            websiteUrl={formData.website_url}
            onChange={handleChange}
            loading={loading}
            handleLogoUpload={handleLogoUpload}
            logo={formData.logo}
            handleRemoveLogo={handleRemoveLogo}
          />

          {/* Tab Navigation */}
          <Tabs
            tabs={getTabs()}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          {activeTab === "Address" && (
            <AddressTab
              address={formData.address}
              onChange={(updatedAddress) => {
                setFormData((prev) => ({
                  ...prev,
                  address: updatedAddress,
                }));
              }}
              loading={loading}
            />
          )}

          {activeTab === "Authority Details" && (
            <AuthorityTab
              managementDetails={formData.managementDetails}
              academyDetails={formData.academyDetails}
              placementDetails={formData.placementDetails}
              otherDetails={formData.otherDetails}
              onManagementChange={(updatedManagement) =>
                handleChange("managementDetails", updatedManagement)
              }
              onAcademyChange={(updatedAcademy) =>
                handleChange("academyDetails", updatedAcademy)
              }
              onPlacementChange={(updatedPlacement) =>
                handleChange("placementDetails", updatedPlacement)
              }
              onOtherChange={(updatedOther) =>
                handleChange("otherDetails", updatedOther)
              }
            />
          )}

          {activeTab === "UG Program Details" &&
            educationType["UG Program"] && (
              <>
                {programsError && (
                  <div className="bg-yellow-50 p-4 mb-4 rounded-md border border-yellow-200">
                    <p className="text-yellow-700">{programsError}</p>
                    <p className="text-yellow-600 mt-1 text-sm">You can still add programs manually.</p>
                  </div>
                )}
                <UGProgramTab
                  isLoading={isLoading}
                  error={programsError}
                  programsData={programsData.ug}
                  ugPrograms={ugPrograms}
                  programPassoutYears={programPassoutYears}
                  programBranches={programBranches}
                  ugEditedPrograms={ugEditedPrograms}
                  setUgPrograms={setUgPrograms}
                  setProgramPassoutYears={setProgramPassoutYears}
                  setProgramBranches={setProgramBranches}
                  setUgEditedPrograms={setUgEditedPrograms}
                />
              </>
            )}

          {activeTab === "PG Program Details" &&
            educationType["PG Program"] && (
              <>
                {programsError && (
                  <div className="bg-yellow-50 p-4 mb-4 rounded-md border border-yellow-200">
                    <p className="text-yellow-700">{programsError}</p>
                    <p className="text-yellow-600 mt-1 text-sm">You can still add programs manually.</p>
                  </div>
                )}
                <PGProgramTab
                  isLoading={isLoading}
                  error={programsError}
                  programsData={programsData.pg}
                  pgPrograms={pgPrograms}
                  programPgPassoutYears={programPgPassoutYears}
                  programPgBranches={programPgBranches}
                  pgEditedPrograms={pgEditedPrograms}
                  setPgPrograms={setPgPrograms}
                  setProgramPgPassoutYears={setProgramPgPassoutYears}
                  setProgramPgBranches={setProgramPgBranches}
                  setPgEditedPrograms={setPgEditedPrograms}
                />
              </>
            )}

          {/* Action buttons */}
          <ActionButtons
            // onCancel={handleClose}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}