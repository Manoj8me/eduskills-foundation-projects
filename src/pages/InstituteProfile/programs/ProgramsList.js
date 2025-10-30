import React from "react";

const ProgramsList = ({ 
  title, 
  programs, 
  selectedPrograms, 
  editedPrograms,
  onProgramChange,
  isPG = false
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-md font-medium text-gray-700 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-4">
        {programs.map((program) => {
          const programName = isPG ? program.program_name : program.name;
          const duration = program.duration;
          
          return (
            <div key={programName} className="flex items-center">
              <input
                type="checkbox"
                id={`checkbox-${programName}`}
                checked={selectedPrograms.includes(programName)}
                onChange={() => onProgramChange(programName)}
                disabled={editedPrograms.includes(programName)}
                className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ${
                  editedPrograms.includes(programName) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <label
                htmlFor={`checkbox-${programName}`}
                className="ml-2 text-sm font-medium text-gray-700"
              >
                {programName} ({duration} years)
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgramsList;