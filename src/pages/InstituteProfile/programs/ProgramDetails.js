import React from "react";
import { PlusCircle, ArrowLeft, MinusCircle, RefreshCcw } from "lucide-react";
import BranchRow from "./BranchRow";

const ProgramDetails = ({
  program,
  passoutYears,
  branches,
  onAddBranch,
  onRemoveBranch,
  onBranchChange,
  onResetBranch,
  onSameAsPrevious,
  getAvailableBranches,
  hasPreviousYear,
  programType
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">{program}</h3>

      {passoutYears?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {[...passoutYears].sort((a, b) => a - b).map((year) => (
            <div key={year} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">Year: {year}</h4>
                <div className="flex gap-2">
                  {hasPreviousYear(year) && (
                    <button
                      onClick={() => onSameAsPrevious(program, year)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-800"
                      title="Same as Previous Year"
                    >
                      <ArrowLeft size={16} />
                      <span className="text-xs">Same as above</span>
                    </button>
                  )}
                  {/* <button
                    onClick={() => onAddBranch(program, year)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    disabled={getAvailableBranches(year).length === 0}
                  >
                    <PlusCircle size={16} />
                    
                  </button> */}
                </div>
              </div>

              <div className="space-y-4">
                {!branches[year]?.length ? (
                  <div className="text-center py-2 text-gray-500 text-sm">
                    <p>No branches added. Click + to add branches.</p>
                  </div>
                ) : (
                  branches[year].map((branch, branchIdx) => (
                    <BranchRow
                      key={branchIdx}
                      branch={branch}
                      branchIdx={branchIdx}
                      availableBranches={getAvailableBranches(year)}
                      onBranchChange={(field, value) => onBranchChange(program, year, branchIdx, field, value)}
                      onResetBranch={() => onResetBranch(program, year, branchIdx)}
                      onRemoveBranch={() => onRemoveBranch(program, year, branchIdx)}
                      onAddBranch={() => onAddBranch(program, year)}

                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramDetails;