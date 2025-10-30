import React from "react";

const EducationTypeSelector = ({ educationType, onChange }) => {

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
      <div className="md:w-1/3">
        <div className="flex items-center">
          <label className="font-medium text-gray-700 mr-2">Education Type <span className="text-red-500">*</span></label>
        </div>
      </div>
      <div className="md:w-2/3 flex gap-4 bg-gray-50 p-3 rounded-md">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="UG Program"
            checked={educationType["UG Program"]}
            onChange={onChange}
            className="h-4 w-4 text-blue-500 mr-2 cursor-pointer"
          />
          <span>UG Program</span>
        </label>

        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="PG Program"
            checked={educationType["PG Program"]}
            onChange={onChange}
            className="h-4 w-4 text-blue-500 mr-2 cursor-pointer"
          />
          <span>PG Program</span>
        </label>
      </div>
    </div>
  );
};

export default EducationTypeSelector;