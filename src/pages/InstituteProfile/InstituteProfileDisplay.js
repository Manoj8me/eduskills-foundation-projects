import React, { useState, useEffect } from 'react';
import { Pencil, ChevronDown, ChevronUp, Building, Users, Book, Phone, Mail } from 'lucide-react';
import { Box, Modal } from "@mui/material";
import InstituteProfile from "./NewEducationForm";
import { BASE_URL } from "../../services/configUrls";

export default function InstituteProfileView() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instituteData, setInstituteData] = useState(null);
  const [fullData, setfullData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchInstituteProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${ BASE_URL }/internship/fetch_institute_profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        
        // Transform API response to match our component structure
        const transformedData = transformApiData(data);
        setInstituteData(transformedData);
        setfullData(data);
        setError(null);
      } catch (err) {
        setError(`Failed to fetch institute profile: ${err.message}`);
        console.error("Error fetching institute profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstituteProfile();
  }, []);

  // Transform API data to match our component structure
  const transformApiData = (apiData) => {
    console.log("Raw API Data:", apiData); // Log raw data for debugging
    
    // Transform institute profile data
    const instituteProfile = {
      logoUrl: apiData.institute_logo?.startsWith('data:image') ? apiData.institute_logo : null,
      instituteName: apiData.institute_name,
      instituteUrl: apiData.website_url,
      educationTypes: []
    };

    // Add education types based on the education_type setting
    if (apiData.education_type) {
      if (apiData.education_type.includes("UG")) {
        instituteProfile.educationTypes.push('UG');
      }
      if (apiData.education_type.includes("PG")) {
        instituteProfile.educationTypes.push('PG');
      }
    } else {
      // Fallback to checking intake data
      if (apiData.ug_intake && Object.keys(apiData.ug_intake).length > 0) {
        instituteProfile.educationTypes.push('UG');
      }
      if (apiData.pg_intake && Object.keys(apiData.pg_intake).length > 0) {
        instituteProfile.educationTypes.push('PG');
      }
    }

    // Transform authorities data
    const authorities = {
      management: apiData.authority_management || [],
      academic: apiData.authority_academy || [],
      placement: apiData.authority_placement || [],
      other: apiData.other_authority || []
    };

    const address = {
      address: apiData.address || {}
    };
    
    // Transform programs data
    const programs = {
      UG: [],
      PG: []
    };

    // Transform UG programs
    if (apiData.ug_intake && apiData.ug_intake.programs && apiData.ug_intake.programs.length > 0) {
      apiData.ug_intake.programs.forEach(programName => {
        const passoutYears = apiData.ug_intake.programPassoutYears?.[programName] || [];
        const programPassoutYears = passoutYears.map(year => {
          const branches = apiData.ug_intake.programBranches?.[programName]?.[year.toString()] || [];
          return {
            year,
            branches: branches.map(branch => ({
              branchName: branch.branch || branch.branchName || "",
              seats: branch.seats || "0",
              hodName: branch.hodName || "",
              hodEmail: branch.hodEmail || "",
              hodPhone: branch.hodPhone || ""
            }))
          };
        });

        programs.UG.push({
          programName,
          passoutYears: programPassoutYears
        });
      });
    }

    // Transform PG programs - Fixed to match the expected structure
    if (apiData.pg_intake && apiData.pg_intake.programs && apiData.pg_intake.programs.length > 0) {
      apiData.pg_intake.programs.forEach(programName => {
        const passoutYears = apiData.pg_intake.programPassoutYears?.[programName] || [];
        const programPassoutYears = passoutYears.map(year => {
          const branches = apiData.pg_intake.programBranches?.[programName]?.[year.toString()] || [];
          return {
            year,
            branches: branches.map(branch => ({
              branchName: branch.branch || branch.branchName || "",
              seats: branch.seats || "0",
              hodName: branch.hodName || "",
              hodEmail: branch.hodEmail || "",
              hodPhone: branch.hodPhone || ""
            }))
          };
        });

        programs.PG.push({
          programName,
          passoutYears: programPassoutYears
        });
      });
    }
    
    console.log("Transformed Programs Data:", programs); // Log transformed programs data
    
    return {
      instituteProfile,
      authorities,
      programs,
      address
    };
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!instituteData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-500">No institute data available.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Institute Header Card */}
        <HeaderCard 
          profile={instituteData.instituteProfile} 
          openEditModal={() => setShowEditModal(true)}
        />
        
        {/* Tabs Section */}
        <TabsSection 
          authorities={instituteData.authorities} 
          programs={instituteData.programs}
        />

        {/* Edit Profile Modal Popup */}
        <Modal
          open={showEditModal}
          onClose={handleClose}
          aria-labelledby="institute-profile-modal"
          aria-describedby="institute-profile-form"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: { xs: 300, sm: 500, lg: 900, xl: 1200 },
              maxHeight: '80vh',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              overflowY: 'auto',
            }}
          >
            <InstituteProfile 
              initialData={fullData}
              onClose={handleClose}
              onSave={(updatedData) => {
                // Transform the updated data and set it
                setInstituteData(transformApiData(updatedData));
                setfullData(updatedData);
                setShowEditModal(false);
              }}
            />
          </Box>
        </Modal>
      </div>
    </div>
  );
}

// Header Card Component
function HeaderCard({ profile, openEditModal }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Institute Profile</h1>
        <button 
          className="flex items-center bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition"
          onClick={openEditModal}
        >
          <Pencil size={16} className="mr-1" />
          <span>Edit Profile</span>
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row p-6 items-center">
        <div className="flex-shrink-0">
          {profile.logoUrl ? (
            <div className="relative h-28 w-28">
              <img
                src={profile.logoUrl}
                alt="Institute Logo"
                className="h-28 w-28 object-cover rounded-full border-4 border-white shadow-md"
              />
            </div>
          ) : (
            <div className="h-28 w-28 bg-gray-200 flex items-center justify-center rounded-full text-gray-500">
              <Building size={40} />
            </div>
          )}
        </div>
        <div className="mt-4 md:mt-0 md:ml-8 flex-grow">
          <div className="mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{profile.instituteName}</h2>
            {profile.instituteUrl && (
              <a 
                href={profile.instituteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {profile.instituteUrl}
              </a>
            )}
          </div>
          
          {/* Education Type Section */}
          <div className="flex items-center mt-2">
            <span className="text-gray-700 font-medium mr-3">Education Type:</span>
            <div className="flex space-x-2">
              {profile.educationTypes && profile.educationTypes.includes('UG') && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  UG
                </span>
              )}
              {profile.educationTypes && profile.educationTypes.includes('PG') && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  PG
                </span>
              )}
              {(!profile.educationTypes || profile.educationTypes.length === 0) && (
                <span className="text-gray-500 italic">None specified</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tabs Section Component
function TabsSection({ authorities, programs }) {
  const [activeTab, setActiveTab] = useState('authorities');
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tabs Navigation */}
      <div className="flex border-b">
        <TabButton 
          active={activeTab === 'authorities'} 
          onClick={() => setActiveTab('authorities')}
          icon={<Users size={18} />}
          label="Authorities"
        />
        <TabButton 
          active={activeTab === 'programs'} 
          onClick={() => setActiveTab('programs')}
          icon={<Book size={18} />}
          label="Programs"
        />
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'authorities' && (
          <AuthoritiesTab authorities={authorities} />
        )}
        
        {activeTab === 'programs' && (
          <ProgramsTab programs={programs} />
        )}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-6 py-4 font-medium transition-colors ${
        active 
          ? 'text-blue-600 border-b-2 border-blue-600' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Authorities Tab Component
function AuthoritiesTab({ authorities }) {
  return (
    <>
      <CollapsibleSection 
        title="Management Authority" 
        items={authorities.management} 
      />
      <CollapsibleSection 
        title="Academic Authority" 
        items={authorities.academic} 
      />
      <CollapsibleSection 
        title="Placement Authority" 
        items={authorities.placement} 
      />
      <CollapsibleSection 
        title="Other Authority" 
        items={authorities.other} 
      />
    </>
  );
}

// Programs Tab Component
function ProgramsTab({ programs }) {
  return (
    <>
      <ProgramSection 
        title="Undergraduate Programs" 
        programs={programs.UG} 
      />
      <ProgramSection 
        title="Postgraduate Programs" 
        programs={programs.PG} 
      />
    </>
  );
}

// Collapsible Section Component
function CollapsibleSection({ title, items }) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Handle case where items might be undefined
  const itemsToDisplay = items || [];
  
  return (
    <div className="mb-6">
      <div 
        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <div className="flex items-center">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-4 space-y-4 pl-2">
          {itemsToDisplay.length > 0 ? (
            <>
              {/* Table Headers */}
              <div className="grid grid-cols-5 gap-4 px-4 py-2 bg-gray-100 rounded-t-lg font-medium text-gray-600 text-sm">
                <div>Designation</div>
                <div>Name</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Local Designation</div>
              </div>
              
              {/* Authority Items */}
              {itemsToDisplay.map((person, idx) => (
                <AuthorityItem key={idx} person={person} />
              ))}
            </>
          ) : (
            <p className="text-gray-500 py-2">No data available.</p>
          )}
        </div>
      )}
    </div>
  );
}

// Authority Item Component (Displayed in one line)
function AuthorityItem({ person }) {
  return (
    <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition">
      {/* Designation */}
      <div>
        <span className="text-blue-600">{person.designation}</span>
      </div>
      
      {/* Name */}
      <div>
        <span className="font-medium">{person.name}</span>
      </div>
      
      {/* Email */}
      <div>
        <span className="text-gray-700">{person.email}</span>
      </div>
      
      {/* Phone */}
      <div>
        <span className="text-gray-700">{person.phone}</span>
      </div>
      
      {/* Local Designation */}
      <div>
        <span className="text-gray-500">{person.localDesignation}</span>        
      </div>
    </div>
  );
}

// Program Section Component
function ProgramSection({ title, programs }) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Handle case where programs might be undefined
  const programsToDisplay = programs || [];
  
  // Check if any program has branches to display
  const hasBranches = programsToDisplay.some(program => 
    program.passoutYears && 
    program.passoutYears.some(year => 
      year.branches && year.branches.length > 0
    )
  );
  
  return (
    <div className="mb-6">
      <div 
        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-500">{programsToDisplay.length} program(s)</span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-4">
          {programsToDisplay.length > 0 && hasBranches ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Out Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HOD</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Programs */}
                  {programsToDisplay.map((program, programIndex) => {
                    // Skip programs without valid passoutYears
                    if (!program.passoutYears || program.passoutYears.length === 0) {
                      return null;
                    }
                    
                    let rowCount = 0; // To track displayed rows for program visibility
                    
                    return program.passoutYears.map((yearObj, yearIndex) => {
                      // Skip years without valid branches
                      if (!yearObj.branches || yearObj.branches.length === 0) {
                        return null;
                      }
                      
                      return yearObj.branches.map((branch, branchIndex) => {
                        const rowKey = `${programIndex}-${yearIndex}-${branchIndex}`;
                        const isFirstRow = rowCount === 0;
                        rowCount++;
                        
                        return (
                          <tr key={rowKey} 
                              className={branchIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {isFirstRow ? program.programName : ''}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {yearObj.year}
                            </td>
                            <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                              {branch.branchName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {branch.seats}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {branch.hodName || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                              {(branch.hodEmail || branch.hodPhone) ? (
                                <div className="flex flex-col">
                                  {branch.hodEmail && (
                                    <span className="flex items-center text-xs mb-1">
                                      <Mail size={12} className="mr-1 text-gray-400" />
                                      {branch.hodEmail}
                                    </span>
                                  )}
                                  {branch.hodPhone && (
                                    <span className="flex items-center text-xs">
                                      <Phone size={12} className="mr-1 text-gray-400" />
                                      {branch.hodPhone}
                                    </span>
                                  )}
                                </div>
                              ) : '-'}
                            </td>
                          </tr>
                        );
                      });
                    });
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 py-2">No programs available.</p>
          )}
        </div>
      )}
    </div>
  );
}