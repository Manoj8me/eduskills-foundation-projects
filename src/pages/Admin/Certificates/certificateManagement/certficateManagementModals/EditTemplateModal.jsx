import { useEffect, useState } from "react";
import { CenteredPortal } from "./CenteredPortal";

// completely new loop of categories/sub categories
export function EditTemplateDetailsModal({ template = {}, showDomainField = false, onCancel, onSave }){
  const [local, setLocal] = useState({ ...template });
  useEffect(()=> setLocal({ ...template }), [template]);
  return (
    <CenteredPortal>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4" onClick={onCancel}>
        <div onClick={e=>e.stopPropagation()} className="bg-white rounded p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">Edit Template</h3>
          <input value={local.name || ''} onChange={e=>setLocal({...local, name: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
          <div className="flex gap-2 mb-3">
            <input type="date" value={local.issueDate || ''} onChange={e=>setLocal({...local, issueDate: e.target.value})} className="w-1/2 border rounded px-3 py-2" />
            <input type="date" value={local.validityDate || ''} onChange={e=>setLocal({...local, validityDate: e.target.value})} className="w-1/2 border rounded px-3 py-2" />
          </div>
          {showDomainField && <input value={local.domain || ''} onChange={e=>setLocal({...local, domain: e.target.value})} placeholder="Domain (optional)" className="w-full border rounded px-3 py-2 mb-3" />}
          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={()=>onSave(local)} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </CenteredPortal>
  );
}



// import { useEffect, useState } from "react";
// import { CenteredPortal } from "./CenteredPortal";

// export function EditTemplateDetailsModal({
//     template = {},
//     onCancel,
//     onSave,
//     showDomainField = false
// }) {
//     const [name, setName] = useState(template.name || "");
//     const [issueDate, setIssueDate] = useState(template.issueDate || "");
//     const [validityDate, setValidityDate] = useState(template.validityDate || "");

//     useEffect(() => {
//         setName(template.name || "");
//         setIssueDate(template.issueDate || "");
//         setValidityDate(template.validityDate || "");
//     }, [template]);

//     const [error, setError] = useState("");

//     function handleSave() {
//         setError("");
//         if (!name.trim()) {
//             setError("Template name required");
//             return;
//         }
//         if (issueDate && validityDate && new Date(issueDate) > new Date(validityDate)) {
//             setError("Issue date cannot be after validity");
//             return;
//         }
//         onSave({ ...template, name, issueDate, validityDate });
//     }

//     return (
//         <CenteredPortal>
//             <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 overflow-auto p-4">
//                 <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
//                     <h2 className="text-xl font-bold mb-4">Edit Template Details</h2>

//                     {error && <p className="text-red-600 mb-2">{error}</p>}

//                     {/* Template Name */}
//                     <div className="mb-3">
//                         <label className="block mb-1">Certificate Name</label>
//                         <input
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className="w-full border rounded px-2 py-1"
//                         />
//                     </div>

//                     {/* Dates */}
//                     <div className="flex gap-2 mb-3">
//                         <div className="flex-1">
//                             <label className="block mb-1">Issue Date</label>
//                             <input
//                                 type="date"
//                                 value={issueDate}
//                                 onChange={(e) => setIssueDate(e.target.value)}
//                                 className="w-full border rounded px-2 py-1"
//                             />
//                         </div>
//                         <div className="flex-1">
//                             <label className="block mb-1">Validity Date</label>
//                             <input
//                                 type="date"
//                                 value={validityDate}
//                                 onChange={(e) => setValidityDate(e.target.value)}
//                                 className="w-full border rounded px-2 py-1"
//                             />
//                         </div>
//                     </div>

//                     {/* Orientation */}
//                     <div className="mb-3">
//                         <label className="block mb-1">Orientation</label>
//                         <input
//                             value={template.orientation || ""}
//                             readOnly
//                             className="w-full bg-gray-100 border rounded px-2 py-1"
//                         />
//                     </div>

//                     {/* Domains */}
//                     {showDomainField && (
//                         <div className="mb-3">
//                             <label className="block mb-1">Domains</label>
//                             <input
//                                 value={(template.domains || []).join(", ")}
//                                 readOnly
//                                 className="w-full bg-gray-100 border rounded px-2 py-1"
//                             />
//                         </div>
//                     )}

//                     {/* Variables (read-only) */}
//                     <div className="mb-4">
//                         <label className="block mb-1">Variables</label>
//                         <input
//                             value={(template.variables || []).join(", ")}
//                             readOnly
//                             className="w-full bg-gray-100 border rounded px-2 py-1"
//                         />
//                     </div>

//                     {/* Actions */}
//                     <div className="flex justify-end gap-2">
//                         <button onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
//                         <button onClick={handleSave} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
//                     </div>
//                 </div>
//             </div>
//         </CenteredPortal>
//     );
// }
