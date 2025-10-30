import React from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import AuthoritySection from "../common/AuthoritySection";

const AuthorityTab = ({ 
  managementDetails, 
  academyDetails, 
  placementDetails, 
  otherDetails, 
  onManagementChange, 
  onAcademyChange, 
  onPlacementChange, 
  onOtherChange 
}) => {
  // Management authority options
  const managementOptions = ["Chairman", "Secretary", "Chancellor", "President"];
  
  // Academic authority options
  const academyOptions = ["Principal", "Vice Principal", "Dean", "Vice Counselor", "Director", "Vice Chancellor"];
  
  // Placement authority options
  const placementOptions = ["Dean", "TPO", "Director"];

  return (
    <div>
      {/* Management Details */}
      <AuthoritySection
        title="Management Authority"
        items={managementDetails}
        options={managementOptions}
        onChange={(updatedItems) => onManagementChange(updatedItems)}
      />

      {/* Academy Details */}
      <AuthoritySection
        title="Academic Authority"
        items={academyDetails}
        options={academyOptions}
        onChange={(updatedItems) => onAcademyChange(updatedItems)}
      />

      {/* Placement Details */}
      <AuthoritySection
        title="Placement Authority"
        items={placementDetails}
        options={placementOptions}
        onChange={(updatedItems) => onPlacementChange(updatedItems)}
      />

      {/* Other Details */}
      <AuthoritySection
        title="Other Authority"
        items={otherDetails}
        options={[]}
        customDesignation={true}
        onChange={(updatedItems) => onOtherChange(updatedItems)}
      />
    </div>
  );
};

export default AuthorityTab;