import React from "react";
import ProgramsList from "../programs/ProgramsList";
import ProgramDetails from "../programs/ProgramDetails";

const UGProgramTab = ({
  isLoading,
  error,
  programsData,
  ugPrograms,
  programPassoutYears,
  programBranches,
  ugEditedPrograms,
  setUgPrograms,
  setProgramPassoutYears,
  setProgramBranches,
  setUgEditedPrograms
}) => {
  const handleProgramChange = (program) => {
    // If program is already in ugPrograms, we need to remove it
    if (ugPrograms.includes(program)) {
      handleRemoveProgram(program);
      return;
    }
    
    // Otherwise, add the program automatically
    const currentYear = new Date().getFullYear();
    // Find program info from API data
    const programInfo = programsData.find(p => p.name === program);
    
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
        hodPhone: '',
        isDefault: true
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
        [year]: [...(prev[program][year] || []), { 
          branch: '', 
          seats: '', 
          hodName: '', 
          hodEmail: '', 
          hodPhone: '',
          isDefault: false
        }]
      }
    }));
  };

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

  const handleResetBranches = (program, year, index) => {
    const updatedBranches = [...programBranches[program][year]];

    updatedBranches[index] = {
      branch: "",
      seats: "",
      hodName: "",
      hodEmail: "",
      hodPhone: "",
      isDefault: updatedBranches[index].isDefault
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
      isDefault: false
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

  const getAvailableBranches = (program, year) => {
    const programInfo = programsData.find(p => p.name === program);
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

  return (
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
          <ProgramsList 
            title="Select UG Programs"
            programs={programsData}
            selectedPrograms={ugPrograms}
            editedPrograms={ugEditedPrograms}
            onProgramChange={handleProgramChange}
          />

          {/* Display Selected Programs and Branches */}
          {ugPrograms.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>No UG programs selected. Please select programs above.</p>
            </div>
          ) : (
            ugPrograms.map((program) => (
              <ProgramDetails
                key={program}
                program={program}
                passoutYears={programPassoutYears[program] || []}
                branches={programBranches[program] || {}}
                onAddBranch={handleAddBranch}
                onRemoveBranch={handleRemoveBranch}
                onBranchChange={handleBranchChange}
                onResetBranch={handleResetBranches}
                onSameAsPrevious={handleSameAsPrevious}
                getAvailableBranches={(year) => getAvailableBranches(program, year)}
                hasPreviousYear={(year) => hasPreviousYear(program, year)}
                programType="UG"
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default UGProgramTab;