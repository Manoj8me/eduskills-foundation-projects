
import { useState, useEffect } from "react";
import { Info, Upload, GraduationCap, PlusCircle, Trash2, ArrowLeft,MinusCircle, RefreshCcw  } from "lucide-react";
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Add } from "@mui/icons-material";
import axios from "axios";
import { BASE_URL } from "../../services/configUrls";

export default function NewEducationForm({handleClose}) {
  // Form state
const [educationType, setEducationType] = useState({
  "UG Program": false,
  "PG Program": false
});
const [loading, setLoading] = useState(true);
const [formData, setFormData] = useState({
  instituteName: "",
  address: {
    country: "India",
    state: "",
    city: "",
    street1: "",
    street2: "",
    postalCode: ""
  },
  logo: null,
  managementDetails: [{ designation: "", name: "", email: "", phone: "", localDesignation: "" }],
  academyDetails: [{ designation: "", name: "", email: "", phone: "", localDesignation: "" }],
  placementDetails: [{ designation: "", name: "", email: "", phone: "", localDesignation: "" }],
  otherDetails:[{designation: "", name: "", email: "", phone: "", localDesignation: ""}]
});

// Active tab state
const [activeTab, setActiveTab] = useState("Address");

// API data states
const [programsData, setProgramsData] = useState({
  ug: [], // Available UG programs
  pg: []  // Available PG programs
});

// Selected programs
const [selectedPrograms, setSelectedPrograms] = useState([]);
const [selectedPgPrograms, setSelectedPgPrograms] = useState([]);

// Actual selected programs
const [ugPrograms, setUgPrograms] = useState([]);
const [pgPrograms, setPgPrograms] = useState([]);
const [ugEditedPrograms, setUgEditedPrograms] = useState([]);

// Program details
const [programPassoutYears, setProgramPassoutYears] = useState({});
const [programBranches, setProgramBranches] = useState({});
const [programPgPassoutYears, setProgramPgPassoutYears] = useState({});
const [programPgBranches, setProgramPgBranches] = useState({});
const [pgEditedPrograms, setPgEditedPrograms] = useState([]);

// Loading state
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);


useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoading(true);
        setError(null);
    
        const response = await fetch(`${BASE_URL}/internship/fetch_institute_profile`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
          }
        ); // replace with actual API URL
        const data = await response.json();
        // console.log("data.ug_intake.programs",data.ug_intake.programs)
      
        // console.log("priti data",data);
          const normalizedManagement = data.authority_management?.map(item => ({
    designation: item.degignation || '', // correcting the typo
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    localDesignation: item.localDesignation || ''
  })) || [{ designation: "", name: "", email: "", phone: "", localDesignation: "" }];

  const normalizedAcademy = data.authority_academy?.map(item => ({
    designation: item.degignation || '',
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    localDesignation: item.localDesignation || ''
  })) || [{ designation: "", name: "", email: "", phone: "", localDesignation: "" }];

  const normalizedPlacement = data?.authority_placement?.map(item => ({
    designation: item.degignation || '',
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    localDesignation: item.localDesignation || ''
  })) || [{ designation: "", name: "", email: "", phone: "", localDesignation: "" }];

  const normalizedOthers = data.authority_academy?.map(item => ({
    designation: item.degignation || '',
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    localDesignation: item.localDesignation || ''
  })) || [{ designation: "", name: "", email: "", phone: "", localDesignation: "" }];
  setFormData({
    ...data,
    managementDetails: normalizedManagement,
    academyDetails: normalizedAcademy,
    placementDetails: normalizedPlacement,
    otherDetails: normalizedOthers,
  });
  // Set authority details into form state
  // setFormData({
  //   managementDetails: normalizedManagement,
  //   academyDetails: normalizedAcademy,
  //   placementDetails: normalizedPlacement,
  //   otherDetails: normalizedOthers,
    
  // });
        
  if (data?.education_type && Array.isArray(data.education_type)) {
    setEducationType({
      "UG Program": data.education_type.includes("UG"),
      "PG Program": data.education_type.includes("PG")
    });
    setUgPrograms(data.ug_intake.programs || []);
    setProgramPassoutYears(data.ug_intake.programPassoutYears || {});
    setProgramBranches(data.ug_intake.programBranches || {});
    
  } else {
    // No data available, reset to default (false)
    setEducationType({
      "UG Program": false,
      "PG Program": false
    });
  }
        // if (data.ug_intake) {
         
        // }
    
      } catch (err) {
        console.error(err);
        setError("Failed to load UG intake data.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPrograms();
  }, []);
useEffect(() => {
  const fetchProgramsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Replace with your API endpoint
      const response = await axios.get(`${BASE_URL}/internship/programs_branches`);
      const data = response.data;
      
      // Validate the response data has the expected structure
      if (!data || !data.programs) {
        throw new Error('Invalid data format received from API');
      }
      
      // Properly separate UG and PG programs based on ispg field
      const ugPrograms = data.programs.filter(p => p.ispg === 0);
      const pgPrograms = data.programs.filter(p => p.ispg === 1);
      
      // Verify that the required duration field exists for each program
      const validatePrograms = (programs, type) => {
        return programs.map(program => {
          if (!program.program_id) {
            console.error(`${type} program is missing ID: ${program.program_name}`);
          }
          
          if (typeof program.duration !== 'number' || program.duration <= 0) {
            console.error(`Invalid duration for ${type} program ${program.program_name}, using default`);
            // Only use default as absolute fallback when the API returns invalid data
            return { ...program, duration: type === 'UG' ? 4 : 2 };
          }
          return program;
        });
      };
      
      const validatedUgPrograms = validatePrograms(ugPrograms, 'UG');
      const validatedPgPrograms = validatePrograms(pgPrograms, 'PG');
      
      // Group branches by program_id for easier access
      const branchesByProgram = {};
      if (data.branches) {
        data.branches.forEach(branch => {
          if (!branchesByProgram[branch.program_id]) {
            branchesByProgram[branch.program_id] = [];
          }
          branchesByProgram[branch.program_id].push(branch.branch_name);
        });
      }
      
      // Enhance program objects with their branches
      const enhancedUgPrograms = validatedUgPrograms.map(program => ({
        ...program,
        name: program.program_name, // Standardize the field name
        branches: branchesByProgram[program.program_id] || []
      }));
      
      const enhancedPgPrograms = validatedPgPrograms.map(program => ({
        ...program,
        name: program.program_name, // Standardize the field name
        branches: branchesByProgram[program.program_id] || []
      }));
      
      // Update state with correctly processed API data
      setProgramsData({
        ug: enhancedUgPrograms,
        pg: enhancedPgPrograms
      });
      
      // If the API returns existing programs for the institute
      if (data.existingUgPrograms) {
        setUgPrograms(data.existingUgPrograms);
        setProgramPassoutYears(data.ugProgramPassoutYears || {});
        setProgramBranches(data.ugProgramBranches || {});
      }
      
      if (data.existingPgPrograms) {
        setPgPrograms(data.existingPgPrograms);
        setProgramPgPassoutYears(data.pgProgramPassoutYears || {});
        setProgramPgBranches(data.pgProgramBranches || {});
      }
      
    } catch (error) {
      console.error('Error fetching programs data:', error);
      setError('Failed to load programs data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInstituteDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}/internship/institute_details`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
  
      if (!response.ok) throw new Error("Failed to fetch institute details");
  
      const result = await response.json();
      const data = result.data;
  
      setFormData((prev) => ({
        ...prev,
        instituteName: data.institute_name || "",
        address: {
          ...prev.address,
          city: data.city_name || "",
          state: data.state_name || ""
        }
      }));
    } catch (err) {
      console.error("Error fetching institute details:", err);
    }
  };
  const fetchLeaders = async () => {
    try {
      const response = await fetch(`${BASE_URL}/internship/academy_leader`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      setProgramBranches(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch academy leaders.');
    }
  };
  fetchLeaders();
  fetchInstituteDetails();
  fetchProgramsData();
}, []);

// Modified function to handle individual program selection with auto-add
const handleProgramChange = (program) => {
  // If program is already in ugPrograms, we need to remove it
  if (ugPrograms.includes(program)) {
    handleRemoveProgram(program);
    return;
  }
  // Otherwise, add the program automatically
  const currentYear = new Date().getFullYear();
  // Find program info from API data
  const programInfo = programsData.ug.find(p => p.name === program);
  // If program info is not found, log error and return
  if (!programInfo) {
    console.error(`Program information not found for ${program}`);
    return;
  }
  // Use the duration directly from the API data
  const duration = programInfo.duration; 
  // Generate years based on program duration
  const years = Array.from(
    { length: duration }, 
    (_, idx) => currentYear + idx + 1
  );
  years.sort((a, b) => a - b);
  // Add program to ugPrograms
  setUgPrograms(prev => [...prev, program]);
  // Set up passout years
  setProgramPassoutYears(prev => ({ ...prev, [program]: years }));
  // Initialize branches with one empty branch for each year
  const newBranches = {};
  years.forEach(year => {
    newBranches[year] = [{ 
      branch: '', 
      seats: '', 
      hodName: '', 
      hodEmail: '', 
      hodPhone: '' ,isDefault: true
    }];
  });
  setProgramBranches(prev => ({ ...prev, [program]: newBranches }));
};
const handleRemoveProgram = (programToRemove) => {
  const branchesByYear = programBranches[programToRemove] || {};

  const hasFilledData = Object.values(branchesByYear).some((branches) =>
    branches.some((branch) =>
      branch.branch || branch.seats || branch.hodName || branch.hodEmail || branch.hodPhone
    )
  );

  if (hasFilledData) {
    alert("Cannot delete this program because some branches have filled data. Please clear them first.");
    return;
  }

  setUgPrograms(ugPrograms.filter(program => program !== programToRemove));

  const updatedPassoutYears = { ...programPassoutYears };
  delete updatedPassoutYears[programToRemove];
  setProgramPassoutYears(updatedPassoutYears);

  const updatedBranches = { ...programBranches };
  delete updatedBranches[programToRemove];
  setProgramBranches(updatedBranches);
};


const handleAddBranch = (program, year) => {
  setProgramBranches((prev) => ({
    ...prev,
    [program]: {
      ...prev[program],
      [year]: [...(prev[program][year] || []), { branch: '', seats: '', hodName: '', hodEmail: '', hodPhone: '' }]
    }
  }));
};

// Improved handleRemoveBranch function with better validation
const handleRemoveBranch = (program, year, index) => {
  // Don't allow removing the last branch row
  if (programBranches[program][year].length <= 1) {
    alert("Cannot remove the last branch row. Use reset instead to clear the fields.");
    return;
  }

  const branch = programBranches[program][year][index];
  const hasData = branch.branch || branch.seats || branch.hodName || branch.hodEmail || branch.hodPhone;

  if (hasData) {
    const confirmRemove = window.confirm("This branch has data. Are you sure you want to remove it?");
    if (!confirmRemove) return;
  }

  // Create a copy of the current branches and remove the specified one
  const updatedBranches = [...programBranches[program][year]];
  updatedBranches.splice(index, 1);
  
  setProgramBranches(prev => ({
    ...prev,
    [program]: {
      ...prev[program],
      [year]: updatedBranches
    }
  }));
};

const handleBranchChange = (program, year, index, field, value) => {
  const updated = { ...programBranches };
  updated[program][year][index][field] = value;

  setProgramBranches(updated);

  const hasFilledData = checkIfProgramHasFilledData(program, updated);

  setUgEditedPrograms((prev) => {
    const isAlreadyEdited = prev.includes(program);
    if (hasFilledData && !isAlreadyEdited) {
      return [...prev, program];
    } else if (!hasFilledData && isAlreadyEdited) {
      return prev.filter((p) => p !== program);
    }
    return prev;
  });
};
const checkIfProgramHasFilledData = (program, updatedProgramBranches) => {
  return Object.values(updatedProgramBranches[program]).some((branches) =>
    branches.some(
      (branch) =>
        branch.branch?.trim() ||
        branch.seats?.toString().trim() ||
        branch.hodName?.trim() ||
        branch.hodEmail?.trim() ||
        branch.hodPhone?.trim()
    )
  );
};

// Fixed handleResetBranches function to properly handle single branch reset
const handleResetBranches = (program, year, index) => {
  const updatedBranches = [...programBranches[program][year]];

  updatedBranches[index] = {
    branch: "",
    seats: "",
    hodName: "",
    hodEmail: "",
    hodPhone: "",
    branchIdx: "",
    isDefault: true
  };

  const updatedProgramBranches = {
    ...programBranches,
    [program]: {
      ...programBranches[program],
      [year]: updatedBranches
    }
  };

  setProgramBranches(updatedProgramBranches);

  const hasFilledData = checkIfProgramHasFilledData(program, updatedProgramBranches);

  setUgEditedPrograms((prev) => {
    const isAlreadyEdited = prev.includes(program);
    if (hasFilledData && !isAlreadyEdited) {
      return [...prev, program];
    } else if (!hasFilledData && isAlreadyEdited) {
      return prev.filter((p) => p !== program);
    }
    return prev;
  });
};



const handleSameAsPrevious = (program, currentYear) => {
  const sortedYears = [...programPassoutYears[program]].sort((a, b) => a - b);
  const currentIndex = sortedYears.indexOf(currentYear);
  if (currentIndex <= 0) return;

  const previousYear = sortedYears[currentIndex - 1];
  const previousBranches = programBranches[program][previousYear] || [];

  const currentBranches = programBranches[program][currentYear] || [];
  const currentBranchNames = currentBranches.map(b => b.branch);

  const branchesToAdd = previousBranches.filter(
    prevBranch => !currentBranchNames.includes(prevBranch.branch)
  ).map(branch => ({
    branch: branch.branch,
    seats: branch.seats,
    hodName: branch.hodName,
    hodEmail: branch.hodEmail,
    hodPhone: branch.hodPhone,
  }));

  if (branchesToAdd.length > 0) {
    setProgramBranches((prev) => ({
      ...prev,
      [program]: {
        ...prev[program],
        [currentYear]: [...currentBranches, ...branchesToAdd]
      }
    }));
  }
};

// Fixed function to get available branches for a specific program
const getAvailableBranches = (program, year) => {
  const programInfo = programsData.ug.find(p => p.name === program);
  const availableBranches = programInfo ? programInfo.branches : [];
  
  const selectedBranches = programBranches[program]?.[year]?.map(b => b.branch).filter(Boolean) || [];
  return availableBranches.filter(branch => !selectedBranches.includes(branch));
};

const hasPreviousYear = (program, year) => {
  const sortedYears = [...(programPassoutYears[program] || [])].sort((a, b) => a - b);
  const yearIndex = sortedYears.indexOf(year);
  if (yearIndex <= 0) return false;

  const previousYear = sortedYears[yearIndex - 1];
  return (programBranches[program]?.[previousYear]?.length > 0);
};

  // PG Program functions - fixed similarly to UG functions
  const handlePgProgramChange = (program) => {
    // If program is already in pgPrograms, we need to check if it can be removed
    if (pgPrograms.includes(program)) {
      if (pgEditedPrograms.includes(program)) {
        // Program has data, show warning
        alert("Cannot remove this program because it has data. Please clear all branch data first.");
        return;
      }
      // Otherwise, remove the program
      handleRemovePgProgram(program);
      return;
    }
    
    // Add the program automatically
    const currentYear = new Date().getFullYear();
    // Find program info from API data
    const programInfo = programsData.pg.find(p => p.program_name === program);
    
    // If program info is not found, log error and return
    if (!programInfo) {
      console.error(`Program information not found for ${program}`);
      return;
    }
    
    // Use the duration directly from the API data
    const duration = programInfo.duration;
    
    // Generate years based on program duration
    const years = Array.from(
      { length: duration }, 
      (_, idx) => currentYear + idx + 1
    );
    years.sort((a, b) => a - b);
    
    // Add program to pgPrograms
    setPgPrograms(prev => [...prev, program]);
    
    // Set up passout years
    setProgramPgPassoutYears(prev => ({ ...prev, [program]: years }));
    
    // Initialize branches with one empty branch for each year
    const newBranches = {};
    years.forEach(year => {
      newBranches[year] = [{ 
        branch: '', 
        seats: '', 
        hodName: '', 
        hodEmail: '', 
        hodPhone: '',
        isDefault: true
      }];
    });
    
    setProgramPgBranches(prev => ({ ...prev, [program]: newBranches }));
  };
  
// Improved removePgProgram function with proper validation
const handleRemovePgProgram = (programToRemove) => {
  // Check if this program has any data filled in
  const hasPgData = pgEditedPrograms.includes(programToRemove);

  if (hasPgData) {
    alert("Cannot delete this program because it has data. Please clear all branch data first.");
    return;
  }

  setPgPrograms(pgPrograms.filter(program => program !== programToRemove));

  // Clean up related state
  const updatedPassoutYears = { ...programPgPassoutYears };
  delete updatedPassoutYears[programToRemove];
  setProgramPgPassoutYears(updatedPassoutYears);

  const updatedBranches = { ...programPgBranches };
  delete updatedBranches[programToRemove];
  setProgramPgBranches(updatedBranches);
};
const checkIfPgProgramHasFilledData = (program, updatedBranchesState) => {
  return Object.values(updatedBranchesState[program]).some(yearBranches =>
    yearBranches.some(branch =>
      branch.branch?.trim() ||
      branch.seats?.toString().trim() ||
      branch.hodName?.trim() ||
      branch.hodEmail?.trim() ||
      branch.hodPhone?.trim()
    )
  );
};

// Reset functionality for PG branches
const handleResetPgBranch = (program, year, index) => {
  const updatedBranches = [...programPgBranches[program][year]];
  
  updatedBranches[index] = {
    branch: '',
    seats: '',
    hodName: '',
    hodEmail: '',
    hodPhone: '',
    isDefault: true
  };

  const updatedProgramPgBranches = {
    ...programPgBranches,
    [program]: {
      ...programPgBranches[program],
      [year]: updatedBranches
    }
  };

  setProgramPgBranches(updatedProgramPgBranches);

  const hasFilledData = checkIfPgProgramHasFilledData(program, updatedProgramPgBranches);

  setPgEditedPrograms((prev) => {
    const isAlreadyEdited = prev.includes(program);
    if (hasFilledData && !isAlreadyEdited) {
      return [...prev, program];
    } else if (!hasFilledData && isAlreadyEdited) {
      return prev.filter((p) => p !== program);
    }
    return prev;
  });
};

// Modified handleAddPgBranch function
const handleAddPgBranch = (program, year) => {
  const availableBranches = getAvailablePgBranches(program, year);
  if (availableBranches.length === 0) return; // Don't add if no more branches available

  setProgramPgBranches((prev) => ({
    ...prev,
    [program]: {
      ...prev[program],
      [year]: [
        ...(prev[program][year] || []), 
        { 
          branch: '', 
          seats: '', 
          hodName: '', 
          hodEmail: '', 
          hodPhone: '',
          isDefault: false
        }
      ]
    }
  }));
};

const handlePgBranchChange = (program, year, index, field, value) => {
  const updated = { ...programPgBranches };
  updated[program][year][index][field] = value;
  setProgramPgBranches(updated);

  const hasFilledData = checkIfPgProgramHasFilledData(program, updated);

  setPgEditedPrograms((prev) => {
    const isAlreadyEdited = prev.includes(program);
    if (hasFilledData && !isAlreadyEdited) {
      return [...prev, program];
    } else if (!hasFilledData && isAlreadyEdited) {
      return prev.filter((p) => p !== program);
    }
    return prev;
  });
};

const handleRemovePgBranch = (program, year, index) => {
  // Don't allow removing the last branch row
  if (programPgBranches[program][year].length <= 1) {
    alert("Cannot remove the last branch row. Use reset instead to clear the fields.");
    return;
  }

  const branch = programPgBranches[program][year][index];
  const hasData = branch.branch || branch.seats || branch.hodName || branch.hodEmail || branch.hodPhone;

  if (hasData) {
    const confirmRemove = window.confirm("This branch has data. Are you sure you want to remove it?");
    if (!confirmRemove) return;
  }

  // Create a copy of the current branches and remove the specified one
  const updatedBranches = [...programPgBranches[program][year]];
  updatedBranches.splice(index, 1);
  
  setProgramPgBranches(prev => ({
    ...prev,
    [program]: {
      ...prev[program],
      [year]: updatedBranches
    }
  }));
  
  // Check if this was the last branch with data for this program
  const programHasData = Object.values(programPgBranches[program]).some(yearBranches => 
    yearBranches.some(branch => 
      branch.branch || branch.seats || branch.hodName || branch.hodEmail || branch.hodPhone
    )
  );
  
  if (!programHasData) {
    setPgEditedPrograms(prev => prev.filter(p => p !== program));
  }
};
// Modified handleRemovePgBranch function to prevent deleting default branches
// const handleRemovePgBranch = (program, year, index) => {
//   const branch = programPgBranches[program][year][index];
  
//   // Check if this is a default branch (cannot be deleted)
//   if (branch.isDefault) {
//     alert("The default branch row cannot be deleted. You can only clear its fields.");
//     return;
//   }
  
//   const hasData = branch.branch || branch.seats || branch.hodName || branch.hodEmail || branch.hodPhone;

//   if (hasData) {
//     alert("Cannot delete a branch with filled data. Please clear the fields first.");
//     return;
//   }

//   const updated = { ...programPgBranches };
//   updated[program][year].splice(index, 1);
//   setProgramPgBranches(updated);
// };


// Modified handleSameAsPreviousPg function
const handleSameAsPreviousPg = (program, currentYear) => {
  const sortedYears = [...programPgPassoutYears[program]].sort((a, b) => a - b);
  const currentIndex = sortedYears.indexOf(currentYear);
  if (currentIndex <= 0) return;

  const previousYear = sortedYears[currentIndex - 1];
  const previousBranches = programPgBranches[program][previousYear] || [];

  // Get all branches except the default one (which we'll keep)
  const currentBranches = programPgBranches[program][currentYear] || [];
  const defaultBranch = currentBranches.find(b => b.isDefault) || currentBranches[0];
  const currentBranchNames = currentBranches.map(b => b.branch);

  const branchesToAdd = previousBranches
    .filter(prevBranch => !currentBranchNames.includes(prevBranch.branch))
    .map(branch => ({
      branch: branch.branch,
      seats: branch.seats,
      hodName: branch.hodName,
      hodEmail: branch.hodEmail,
      hodPhone: branch.hodPhone,
      isDefault: false // Added branches are not default
    }));

  if (branchesToAdd.length > 0) {
    setProgramPgBranches(prev => ({
      ...prev,
      [program]: {
        ...prev[program],
        [currentYear]: [defaultBranch, ...branchesToAdd]
      }
    }));
  }
};
  
  // Fixed function to get available PG branches
  const getAvailablePgBranches = (program, year) => {
    const programInfo = programsData.pg.find(p => p.name === program);
    const availableBranches = programInfo ? programInfo.branches : [];
    
    const selectedBranches = programPgBranches[program]?.[year]?.map(b => b.branch).filter(Boolean) || [];
    return availableBranches.filter(branch => !selectedBranches.includes(branch));
  };
  
  const hasPreviousPgYear = (program, year) => {
    const sortedYears = [...(programPgPassoutYears[program] || [])].sort((a, b) => a - b);
    const yearIndex = sortedYears.indexOf(year);
    if (yearIndex <= 0) return false;
  
    const previousYear = sortedYears[yearIndex - 1];
    return (programPgBranches[program]?.[previousYear]?.length > 0);
  };
  
  
  // To handle Management
  const handleManagementChange = (index, field, value) => {
    const updated = [...formData.managementDetails];
    updated[index][field] = value;
    handleChange("managementDetails", updated);
  };
  
  const addManagementRow = () => {
    const updated = [...formData.managementDetails, { designation: "", name: "", email: "", phone: "", localDesignation: "" }];
    handleChange("managementDetails", updated);
  };
  
  const removeManagementRow = (index) => {
    const updated = [...formData.managementDetails];
    updated.splice(index, 1);
    handleChange("managementDetails", updated);
  };
  
  // To handle Academy
  const handleAcademyChange = (index, field, value) => {
    const updated = [...formData.academyDetails];
    updated[index][field] = value;
    handleChange("academyDetails", updated);
  };

  const addAcademyRow = () => {
    const updated = [...formData.academyDetails, { designation: "", name: "", email: "", phone: "", localDesignation: ""}];
    handleChange("academyDetails", updated);
  };

  const removeAcademyRow = (index) => {
    const updated = [...formData.academyDetails];
    updated.splice(index, 1);
    handleChange("academyDetails", updated);
  };

  // To handle Placement
  const handlePlacementChange = (index, field, value) => {
    const updated = [...formData.placementDetails];
    updated[index][field] = value;
    handleChange("placementDetails", updated);
  };

  const addPlacementRow = () => {
    const updated = [...formData.placementDetails, { designation: "", name: "", email: "", phone: "", localDesignation: ""}];
    handleChange("placementDetails", updated);
  };

  const removePlacementRow = (index) => {
    const updated = [...formData.placementDetails];
    updated.splice(index, 1);
    handleChange("placementDetails", updated);
  };

  // To handle Placement
  const handleOtherChange = (index, field, value) => {
    const updated = [...formData.otherDetails];
    updated[index][field] = value;
    handleChange("otherDetails", updated);
  };

  const addOtherRow = () => {
    const updated = [...formData.otherDetails, { designation: "", name: "", email: "", phone: "", localDesignation: ""}];
    handleChange("otherDetails", updated);
  };

  const removeOtherRow = (index) => {
    const updated = [...formData.otherDetails];
    updated.splice(index, 1);
    handleChange("otherDetails", updated);
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
      
    });
  };
  // Function to handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEducationType((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
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
  
  
  const handleSave = async () => {
    try {
      // Helper function to check if an authority entry is fully filled
      const isAuthorityEntryValid = (entry) =>
        entry &&
        entry.designation?.trim() &&
        entry.name?.trim() &&
        entry.email?.trim() &&
        entry.phone?.trim();
  
      // Validate Management Details
      if (
        !formData.managementDetails ||
        formData.managementDetails.length === 0 ||
        !formData.managementDetails.some(isAuthorityEntryValid)
      ) {
        alert('Please provide at least one complete Management authority entry.');
        return;
      }
  
      // Validate Placement Details
      if (
        !formData.placementDetails ||
        formData.placementDetails.length === 0 ||
        !formData.placementDetails.some(isAuthorityEntryValid)
      ) {
        alert('Please provide at least one complete Placement authority entry.');
        return;
      }
  
      // Validate Academy Details
      if (
        !formData.academyDetails ||
        formData.academyDetails.length === 0 ||
        !formData.academyDetails.some(isAuthorityEntryValid)
      ) {
        alert('Please provide at least one complete Academy authority entry.');
        return;
      }
  
      // Construct education type string (e.g., "UG, PG")
      const eduTypeArray = [];
      if (educationType["UG Program"]) eduTypeArray.push("UG");
      if (educationType["PG Program"]) eduTypeArray.push("PG");
     console.log("formData.instituteName",formData.instituteName)
      // Prepare the payload for JSON
      const instituteData = {
        institute_name: formData.instituteName || "",
        education_type: eduTypeArray.join(', '),
        institute_logo:formData.logo , // or a URL string if already uploaded
        ug_intake: ugPrograms.length > 0 ? {
          programs: ugPrograms,
          programPassoutYears,
          programBranches
        } : null,
        pg_intake: pgPrograms.length > 0 ? {
          programs: pgPrograms,
          programPassoutYears: programPgPassoutYears,
          programBranches: programPgBranches
        } : null,
        authority_management: formData.managementDetails,
        authority_placement: formData.placementDetails,
        authority_academy: formData.academyDetails,
        other_authority: formData.otherDetails || [],
        address: formData.address || {}
      };
  
      const response = await axios.post(
        'http://192.168.0.136:8000/internship/institute_profile',
        instituteData,
        {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          }
        }
      );
  
      if (response.status === 200) {
        alert('Institute data saved successfully!');
      }
    } catch (error) {
      console.error('Error saving institute data:', error);
      alert('Failed to save institute data. Please check and try again.');
    }
  };
  
  useEffect(() => {
    console.log("formData.instituteName", formData.instituteName);
    //setFormData({ instituteName: data.institute_name });

  }, [formData.instituteName]);
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header area with logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-medium text-gray-800">Institute Profile Details</h2>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Education Type */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-1/3">
              <div className="flex items-center">
                <label className="font-medium text-gray-700 mr-2">Education Type</label>
                {/* <Info className="h-4 w-4 text-gray-400" /> */}
              </div>
            </div>
            <div className="md:w-2/3 flex gap-4 bg-gray-50 p-3 rounded-md">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="UG Program"
                  checked={educationType["UG Program"]}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-500 mr-2 cursor-pointer"
                />
                <span>UG Program</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="PG Program"
                  checked={educationType["PG Program"]}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-500 mr-2 cursor-pointer"
                />
                <span>PG Program</span>
              </label>
            </div>
          </div>

        {/* Institute Logo */}
{/* <div className="mb-6 flex flex-col md:flex-row md:items-start gap-4">
  <div className="md:w-1/3">
    <label className="block font-medium text-gray-700">Institute Logo</label>
    <p className="text-xs text-gray-500 mt-1">Upload institute logo (PNG, JPG)</p>
  </div>
  <div className="md:w-2/3">
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer">
      <input 
        type="file" 
        id="logo" 
        className="hidden" 
        accept="image/png, image/jpeg"
        onChange={handleLogoUpload}
      />
      <label htmlFor="logo" className="cursor-pointer flex flex-col items-center">
        <Upload className="h-8 w-8 text-gray-400 mb-2" />
        <span className="text-sm text-gray-600 mb-1">
          {formData.logo ? "Logo uploaded" : "Drop your logo here, or browse"}
        </span>
        <span className="text-xs text-gray-500">Max file size: 200KB</span>
      </label>
      {formData.logo && (
        <img
          src={formData.logo}
          alt="Logo preview"
          className="mt-4 w-32 h-auto mx-auto border rounded"
        />
      )}
    </div>
  </div>
</div> */}

          
          {/* Institute Name */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
      <div className="md:w-1/3">
        <label className="block font-medium text-gray-700">Institute Name</label>
      </div>
      <div className="md:w-2/3">
        <input
          type="text"
          value={formData.instituteName}
          onChange={(e) => handleChange('instituteName', e.target.value)}
          disabled={loading}
          className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

           {/* Wbsite URL Name */}
           <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="md:w-1/3">
              <label className="block font-medium text-gray-700">Website URL</label>
            </div>
            <div className="md:w-2/3">
              <input
                type="text"
                value={formData.website_url}
                onChange={(e) => handleChange("WebsiteURL", e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              {getTabs().map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 font-medium ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          {/* Address Tab Content */}
          {activeTab === "Address" && (
            <div>
              <div className="mb-6 flex flex-col md:flex-row md:items-start gap-4">
                <div className="md:w-1/4">
                  <label className="block font-medium text-gray-700">Address</label>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                className="block w-full border border-gray-300 rounded-md py-2 px-3 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={formData.address?.country || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, country: e.target.value }
                  }))
                }
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>

                    <input
                      type="text"
                      value={formData.address?.state}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: { ...prev.address, state: e.target.value }
                        }))
                      }
                      disabled={loading}
                      placeholder="State"
                      className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      // value={formData.address?.city}
                      value={formData.address?.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: { ...prev.address, state: e.target.value } // ❌ should be city
                        }))
                      }
                      disabled={loading}
                      placeholder="City"
                      className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={formData.address?.street1}
                      placeholder="Street Address 1"
                      className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: { ...prev.address, street1: e.target.value } // ❌ should be city
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.address?.street2}
                      placeholder="Street Address 2"
                      className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: { ...prev.address, street2: e.target.value } // ❌ should be city
                        }))
                      }
                    />
                    <input
                      type="text"
                      value={formData.address?.postalCode}
                      placeholder="Postal Code"
                      className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: { ...prev.address, postalCode: e.target.value } // ❌ should be city
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* UG Program Details Tab */}
            {/* UG Program Details Tab - Fixed implementation */}
            {activeTab === "UG Program Details" && educationType["UG Program"] && (
  <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
    {isLoading ? (
      <div className="text-center py-4">
        <p>Loading programs data...</p>
      </div>
    ) : error ? (
      <div className="text-center py-4 text-red-600">
        <p>{error}</p>
      </div>
    ) : (
      <>
        {/* Select Program */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Select UG Programs</h3>
          <div className="flex flex-wrap gap-4">
            {programsData.ug.map((program) => (
              <div key={program.name} className="flex items-center">
                <input
                  type="checkbox"
                  id={`checkbox-${program.name}`}
                  checked={ugPrograms.includes(program.name)}
                  onChange={() => handleProgramChange(program.name)}
                  disabled={ugEditedPrograms.includes(program.name)} // Disable after editing
                  className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ${
                    ugEditedPrograms.includes(program.name) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
                <label
                  htmlFor={`checkbox-${program.name}`}
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  {program.name} ({program.duration} years)
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Display Selected Programs and Branches */}
        {ugPrograms.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No UG programs selected. Please select programs above.</p>
          </div>
        ) : (
          ugPrograms.map((program) => (
            <div key={program} className="border rounded-lg p-4 space-y-4">
              {/* <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{program}</h3>
                <button
                  onClick={() => handleRemoveProgram(program)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div> */}

              {programPassoutYears[program]?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {[...programPassoutYears[program]].sort((a, b) => a - b).map((year) => (
                    <div key={year} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-800">Year: {year}</h4>
                        <div className="flex gap-2">
                          {hasPreviousYear(program, year) && (
                            <button
                              onClick={() => handleSameAsPrevious(program, year)}
                              className="flex items-center gap-1 text-green-600 hover:text-green-800"
                              title="Same as Previous Year"
                            >
                              <ArrowLeft size={16} />
                              <span className="text-xs">Same as above</span>
                            </button>
                          )}
                         
                        </div>
                      </div>

                      <div className="space-y-4">
                        {!programBranches[program]?.[year]?.length ? (
                          <div className="text-center py-2 text-gray-500 text-sm">
                            <p>No branches added. Click + to add branches.</p>
                          </div>
                        ) : (
                          programBranches[program][year].map((branch, branchIdx) => (
                            <div key={branchIdx} className="space-y-6 border-b last:border-b-0">
                              {/* HOD Details */}
                              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                                {/* Branch */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-600">Branch</label>
                                  <select
                                    value={branch.branch}
                                    onChange={(e) => handleBranchChange(program, year, branchIdx, 'branch', e.target.value)}
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select Branch</option>
                                    {branch.branch && <option value={branch.branch}>{branch.branch}</option>}
                                    {getAvailableBranches(program, year).map((branchOption) => (
                                      <option key={branchOption} value={branchOption}>
                                        {branchOption}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Intake */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-600">Intake</label>
                                  <input
                                    type="number"
                                    value={branch.seats}
                                    onChange={(e) => handleBranchChange(program, year, branchIdx, 'seats', e.target.value)}
                                    placeholder="Seats"
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                {/* HOD Name */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-600">HOD Name</label>
                                  <input
                                    type="text"
                                    value={branch.hodName || ""}
                                    onChange={(e) => handleBranchChange(program, year, branchIdx, 'hodName', e.target.value)}
                                    placeholder="Enter HOD Name"
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                {/* HOD Email */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-600">HOD Email</label>
                                  <input
                                    type="email"
                                    value={branch.hodEmail || ""}
                                    onChange={(e) => handleBranchChange(program, year, branchIdx, 'hodEmail', e.target.value)}
                                    placeholder="Enter Email"
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                {/* HOD Phone */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-600">HOD Phone</label>
                                  <input
                                    type="tel"
                                    value={branch.hodPhone || ""}
                                    onChange={(e) => handleBranchChange(program, year, branchIdx, 'hodPhone', e.target.value)}
                                    placeholder="Enter Phone"
                                    className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                {/* Delete Button */}
                                <div className="flex justify-center gap-4">
                                <button
                                  onClick={() => handleAddBranch(program, year)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                  disabled={getAvailableBranches(program, year).length === 0}
                                >
                                  <PlusCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleResetBranches (program, year,branchIdx)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                 
                                >
                                  <RefreshCcw size={16} />
                                </button>
                                {!branch.isDefault && (
                                  <button
                                  type="button"
                                  onClick={() => handleRemoveBranch(program, year, branchIdx)}
                                  className="relative"
                                >
                                  <MinusCircle size={20} />
                                 
                                </button>
                              )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </>
    )}
  </div>
)}
   
{activeTab === "PG Program Details" && educationType["PG Program"] && (
  <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
    {isLoading ? (
      <div className="text-center py-4">
        <p>Loading programs data...</p>
      </div>
    ) : error ? (
      <div className="text-center py-4 text-red-600">
        <p>{error}</p>
      </div>
    ) : (
      <>
        {/* Select Program */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Select Programs</h3>
          <div className="flex flex-wrap gap-4">
            {programsData.pg.map((program) => (
              <div key={program.program_name} className="flex items-center">
                <input
                  type="checkbox"
                  id={`pg-checkbox-${program.program_name}`}
                  checked={
                    selectedPgPrograms.includes(program.program_name) ||
                    pgPrograms.includes(program.program_name)
                  }
                  onChange={() => handlePgProgramChange(program.program_name)}
                  disabled={pgEditedPrograms.includes(program.program_name)}
                  className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ${
                    pgEditedPrograms.includes(program.program_name) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />

                <label
                  htmlFor={`pg-checkbox-${program.program_name}`}
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  {program.program_name} ({program.duration} years)
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Display Selected Programs and Branches */}
        {pgPrograms.map((program) => (
          <div key={program} className="border rounded-lg p-4 space-y-4">
            {/* <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{program}</h3>
              <button
                onClick={() => handleRemovePgProgram(program)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div> */}

            {programPgPassoutYears[program]?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {[...programPgPassoutYears[program]].sort((a, b) => a - b).map((year) => (
                  <div key={year} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800">Year: {year}</h4>
                      <div className="flex gap-2">
                        {hasPreviousPgYear(program, year) && (
                          <button
                            onClick={() => handleSameAsPreviousPg(program, year)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-800"
                            title="Same as Previous Year"
                          >
                            <ArrowLeft size={16} />
                            <span className="text-xs">Same as above</span>
                          </button>
                        )}
                        
                      </div>
                    </div>

                    <div className="space-y-4">
                      {programPgBranches[program]?.[year]?.map((branch, branchIdx) => (
                        <div key={branchIdx} className="space-y-6 border-b last:border-b-0">
                          {/* Branch Details */}
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                            {/* Branch */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600">Branch</label>
                              <select
                                value={branch.branch}
                                onChange={(e) => handlePgBranchChange(program, year, branchIdx, 'branch', e.target.value)}
                                className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Branch</option>
                                {branch.branch && <option value={branch.branch}>{branch.branch}</option>}
                                {getAvailablePgBranches(program, year).map((branchOption) => (
                                  branchOption !== branch.branch && (
                                    <option key={branchOption} value={branchOption}>
                                      {branchOption}
                                    </option>
                                  )
                                ))}
                              </select>
                            </div>

                            {/* Intake */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600">Intake</label>
                              <input
                                type="number"
                                value={branch.seats}
                                onChange={(e) => handlePgBranchChange(program, year, branchIdx, 'seats', e.target.value)}
                                placeholder="Seats"
                                className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* HOD Name */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600">HOD Name</label>
                              <input
                                type="text"
                                value={branch.hodName || ""}
                                onChange={(e) => handlePgBranchChange(program, year, branchIdx, 'hodName', e.target.value)}
                                placeholder="Enter HOD Name"
                                className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* HOD Email */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600">HOD Email</label>
                              <input
                                type="email"
                                value={branch.hodEmail || ""}
                                onChange={(e) => handlePgBranchChange(program, year, branchIdx, 'hodEmail', e.target.value)}
                                placeholder="Enter Email"
                                className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* HOD Phone */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600">HOD Phone</label>
                              <input
                                type="tel"
                                value={branch.hodPhone || ""}
                                onChange={(e) => handlePgBranchChange(program, year, branchIdx, 'hodPhone', e.target.value)}
                                placeholder="Enter Phone"
                                className="border border-gray-300 rounded-lg py-2 px-3 w-full text-sm focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            {/* Delete Button - Only shown for non-default branches */}
                            <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleAddPgBranch(program, year)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                              disabled={getAvailablePgBranches(program, year).length === 0}
                            >
                              <PlusCircle size={16} />
                            </button>
                            <button
                                    onClick={() => handleResetPgBranch(program, year, branchIdx)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                 
                                >
                                  <RefreshCcw size={16} />
                                </button>
                              {!branch.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => handleRemovePgBranch(program, year, branchIdx)}
                                  className=" relative"
                                >
                                  <MinusCircle size={16}/>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </>
    )}
  </div>
)}  
 {/* Authority Details Tab */}
          {activeTab === "Authority Details" && (
            <div>
              {/* Management Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Management Authority</h2>
                {formData.managementDetails?.map((item, index) => (
                  <div key={index} className="flex flex-wrap -mx-2 mb-4 items-center">
                    {/* Designation Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Designation</label>
                      <select
                        value={item.designation}
                        onChange={(e) => handleManagementChange(index, "designation", e.target.value)}
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Designation</option>
                        {["Chairman", "Secretary","Chancellor","Presedent" ].filter(option => 
                          !formData.managementDetails.some((detail, i) => i !== index && detail.designation === option)
                        ).map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    {/* Name Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleManagementChange(index, "name", e.target.value)}
                        placeholder="Enter Name"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={item.email}
                        onChange={(e) => handleManagementChange(index, "email", e.target.value)}
                        placeholder="Enter Email"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={item.phone}
                        onChange={(e) => handleManagementChange(index, "phone", e.target.value)}
                        placeholder="Enter Phone Number"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Local Designation Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Local Designation</label>
                      <input
                        type="text"
                        value={item.localDesignation}
                        onChange={(e) => handleManagementChange(index, "localDesignation", e.target.value)}
                        placeholder="Enter Local Designation"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Actions (Remove/Add buttons) */}
                    <div className="w-full md:w-1/12 px-2 mb-2 flex items-center gap-2 mt-4">
                      {/* Show delete button only if it's not the first row */}
                      {index > 0 && (
                        <IconButton
                          onClick={() => removeManagementRow(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={addManagementRow}
                        sx={{ color: 'blue' }}
                      >
                        <AddCircleIcon sx={{ height: '25px', width: '25px' }}/>
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>

              {/* Academy Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Academic Authority</h2>
                {formData.academyDetails?.map((item, index) => (
                  <div key={index} className="flex flex-wrap -mx-2 mb-4 items-center">
                    {/* Designation Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Designation</label>
                      <select
                        value={item.designation}
                        onChange={(e) => handleAcademyChange(index, "designation", e.target.value)}
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Designation</option>
                        {["Principal ","Vice Principal", "Dean", "Vice Counselor","Director ","Vice Chancellor"].filter(option => 
                          !formData.academyDetails.some((detail, i) => i !== index && detail.designation === option)
                        ).map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    {/* Name Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleAcademyChange(index, "name", e.target.value)}
                        placeholder="Enter Name"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={item.email}
                        onChange={(e) => handleAcademyChange(index, "email", e.target.value)}
                        placeholder="Enter Email"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={item.phone}
                        onChange={(e) => handleAcademyChange(index, "phone", e.target.value)}
                        placeholder="Enter Phone Number"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Local Designation Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Local Designation</label>
                      <input
                        type="text"
                        value={item.localDesignation}
                        onChange={(e) => handleAcademyChange(index, "localDesignation", e.target.value)}
                        placeholder="Enter Local Designation"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Icon buttons (Add/Remove) */}
                    <div className="w-full md:w-1/12 px-2 mb-2 flex items-center gap-2 mt-4">
                      {/* Show delete button only if it's not the first row */}
                      {index > 0 && (
                        <IconButton onClick={() => removeAcademyRow(index)} color="error">
                          <DeleteIcon sx={{ height: '20px', width: '20px' }} />
                        </IconButton>
                      )}
                      <IconButton onClick={addAcademyRow} sx={{ color: 'blue' }}>
                        <AddCircleIcon sx={{ height: '25px', width: '25px' }} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>

              {/* Placement Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Placement Authority</h2>
                {formData.placementDetails?.map((item, index) => (
                  <div key={index} className="flex flex-wrap items-center mb-4">
                    {/* Designation Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Designation</label>
                      <select
                        value={item.designation}
                        onChange={(e) => handlePlacementChange(index, "designation", e.target.value)}
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Designation</option>
                        {["Dean", "TPO", "Director"].filter(option => 
                          !formData.placementDetails.some((detail, i) => i !== index && detail.designation === option)
                        ).map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    {/* Name Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handlePlacementChange(index, "name", e.target.value)}
                        placeholder="Enter Name"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={item.email}
                        onChange={(e) => handlePlacementChange(index, "email", e.target.value)}
                        placeholder="Enter Email"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={item.phone}
                        onChange={(e) => handlePlacementChange(index, "phone", e.target.value)}
                        placeholder="Enter Phone Number"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Local Designation Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Local Designation</label>
                      <input
                        type="text"
                        value={item.localDesignation}
                        onChange={(e) => handlePlacementChange(index, "localDesignation", e.target.value)}
                        placeholder="Enter Local Designation"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Actions (Remove/Add buttons) */}
                    <div className="w-full md:w-1/12 px-2 mb-2 flex items-center gap-2 mt-4">
                      {/* Show delete button only if it's not the first row */}
                      {index > 0 && (
                        <IconButton onClick={() => removePlacementRow(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={addPlacementRow}
                        sx={{ color: 'blue' }}
                      >
                        <AddCircleIcon sx={{ height: '27px', width: '27px' }} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
              {/* other Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Other Authority</h2>
                {formData.otherDetails?.map((item, index) => (
                  <div key={index} className="flex flex-wrap items-center mb-4">
                    {/* Designation Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Designation</label>
                      <input
                        type="text"
                        value={item.designation}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          const isDuplicate = formData.otherDetails.some((detail, i) =>
                            i !== index && detail.designation.toLowerCase() === newValue.toLowerCase()
                          );
                          if (!isDuplicate) {
                            handleOtherChange(index, "designation", newValue);
                          } else {
                            alert("This designation is already used.");
                          }
                        }}
                        className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter Designation"
                      />
                    </div>
                    {/* Name Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleOtherChange(index, "name", e.target.value)}
                        placeholder="Enter Name"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={item.email}
                        onChange={(e) => handleOtherChange(index, "email", e.target.value)}
                        placeholder="Enter Email"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={item.phone}
                        onChange={(e) => handleOtherChange(index, "phone", e.target.value)}
                        placeholder="Enter Phone Number"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Local Designation Field */}
                    <div className="w-full md:w-1/6 px-2 mb-4">
                      <label className="block font-medium text-gray-700 mb-1">Local Designation</label>
                      <input
                        type="text"
                        value={item.localDesignation}
                        onChange={(e) => handleOtherChange(index, "localDesignation", e.target.value)}
                        placeholder="Enter Local Designation"
                        className="border border-gray-300 rounded-md py-2 px-3 w-full shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Actions (Remove/Add buttons) */}
                    <div className="w-full md:w-1/12 px-2 mb-2 flex items-center gap-2 mt-4">
                      {/* Show delete button only if it's not the first row */}
                      {index > 0 && (
                        <IconButton onClick={() => removeOtherRow(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={addOtherRow}
                        sx={{ color: 'blue' }}
                      >
                        <AddCircleIcon sx={{ height: '27px', width: '27px' }} />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-4">
            {/* <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition">
              Cancel
            </button> */}
            <button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
