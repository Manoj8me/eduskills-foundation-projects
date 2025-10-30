import React from "react";
import ProgramsList from "../programs/ProgramsList";
import ProgramDetails from "../programs/ProgramDetails";

const PGProgramTab = ({
  isLoading,
  error,
  programsData,
  pgPrograms,
  programPgPassoutYears,
  programPgBranches,
  pgEditedPrograms,
  setPgPrograms,
  setProgramPgPassoutYears,
  setProgramPgBranches,
  setPgEditedPrograms
}) => {
  const handleProgramChange = (program) => {
    // If program is already in pgPrograms, we need to check if it can be removed
    if (pgPrograms.includes(program)) {
      if (pgEditedPrograms.includes(program)) {
        // Program has data, show warning
        alert("Cannot remove this program because it has data. Please clear all branch data first.");
        return;
      }
      // Otherwise, remove the program
      handleRemoveProgram(program);
      return;
    }
    
    // Add the program automatically
    const currentYear = new Date().getFullYear();
    // Find program info from API data
    const programInfo = programsData.find(p => p.program_name === program);
    
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

  const handleRemoveProgram = (programToRemove) => {
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

  const checkIfProgramHasFilledData = (program, updatedBranchesState) => {
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

  const handleResetBranch = (program, year, index) => {
    const updatedBranches = [...programPgBranches[program][year]];
    
    updatedBranches[index] = {
      branch: '',
      seats: '',
      hodName: '',
      hodEmail: '',
      hodPhone: '',
      isDefault: updatedBranches[index].isDefault
    };

    const updatedProgramPgBranches = {
      ...programPgBranches,
      [program]: {
        ...programPgBranches[program],
        [year]: updatedBranches
      }
    };

    setProgramPgBranches(updatedProgramPgBranches);

    const hasFilledData = checkIfProgramHasFilledData(program, updatedProgramPgBranches);

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

  const handleAddBranch = (program, year) => {
    const availableBranches = getAvailableBranches(program, year);
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

  const handleBranchChange = (program, year, index, field, value) => {
    const updated = { ...programPgBranches };
    updated[program][year][index][field] = value;
    setProgramPgBranches(updated);

    const hasFilledData = checkIfProgramHasFilledData(program, updated);

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

  const handleRemoveBranch = (program, year, index) => {
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

  const handleSameAsPrevious = (program, currentYear) => {
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

  const getAvailableBranches = (program, year) => {
    const programInfo = programsData.find(p => p.program_name === program);
    const availableBranches = programInfo ? programInfo.branches : [];
    
    const selectedBranches = programPgBranches[program]?.[year]?.map(b => b.branch).filter(Boolean) || [];
    return availableBranches.filter(branch => !selectedBranches.includes(branch));
  };

  const hasPreviousYear = (program, year) => {
    const sortedYears = [...(programPgPassoutYears[program] || [])].sort((a, b) => a - b);
    const yearIndex = sortedYears.indexOf(year);
    if (yearIndex <= 0) return false;

    const previousYear = sortedYears[yearIndex - 1];
    return (programPgBranches[program]?.[previousYear]?.length > 0);
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
            title="Select PG Programs"
            programs={programsData}
            selectedPrograms={pgPrograms}
            editedPrograms={pgEditedPrograms}
            onProgramChange={handleProgramChange}
            isPG={true}
          />

          {/* Display Selected Programs and Branches */}
          {pgPrograms.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>No PG programs selected. Please select programs above.</p>
            </div>
          ) : (
            pgPrograms.map((program) => (
              <ProgramDetails
                key={program}
                program={program}
                passoutYears={programPgPassoutYears[program] || []}
                branches={programPgBranches[program] || {}}
                onAddBranch={handleAddBranch}
                onRemoveBranch={handleRemoveBranch}
                onBranchChange={handleBranchChange}
                onResetBranch={handleResetBranch}
                onSameAsPrevious={handleSameAsPrevious}
                getAvailableBranches={(year) => getAvailableBranches(program, year)}
                hasPreviousYear={(year) => hasPreviousYear(program, year)}
                programType="PG"
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default PGProgramTab;