// api try
import { useState, useEffect } from "react";
import { CenteredPortal } from "./CenteredPortal";
import { api } from "../../api";

export function CreateTemplateModal({
  onClose,
  categoryId,
  nodeType, // 'domains' | 'certificate-category'
}) {
  const [name, setName] = useState("");
  const [createdDate, setCreatedDate] = useState(new Date().toISOString().split("T")[0]);
  const [validityDate, setValidityDate] = useState(new Date().toISOString().split("T")[0]);
  const [orientation, setOrientation] = useState("Portrait");

  // Domains
  const [domains, setDomains] = useState([]);
  const [domain, setDomain] = useState(""); // this will hold the domain_id

  // Variables
  const [variableInput, setVariableInput] = useState("");
  const [variables, setVariables] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active domains only if nodeType === "domains"
  useEffect(() => {
    if (nodeType === "domains") {
      api.get("/admin/domains/active")
        .then((res) => {
          const data = res.data || [];
          // map API fields to our expected format
          const mappedDomains = data.map((d) => ({
            id: String(d.domain_id), // store as string for select value
            name: d.domain_name,
          }));
          setDomains(mappedDomains);
          if (mappedDomains.length) setDomain(mappedDomains[0].id); // set first domain
        })
        .catch((err) => console.error(err));
    }
  }, [nodeType]);

  const addVariable = () => {
    const v = variableInput.trim();
    if (!v) return;
    setVariables((prev) => [...prev, v]);
    setVariableInput("");
  };

  const removeVariable = (v) => {
    setVariables((prev) => prev.filter((x) => x !== v));
  };

  const handleCreate = async () => {
    if (!name.trim() || !createdDate) return;

    const payload = {
      category_id: categoryId,
      certificate_name: name.trim(),
      orientation: orientation.toLowerCase(),
      issue_date: createdDate,
      validity_date: validityDate,
      variables,
    };

    if (nodeType === "domains") {
      payload.domain_id = parseInt(domain); // convert string back to integer
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/admin/certificate-templates/details", payload);

      const params = new URLSearchParams({
        certificate_id: res.data.certificate_id,
      }).toString();

      window.open(`/certificate-canvas?${params}`, "_blank");

      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create template. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredPortal>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg p-6 w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-4">Create Certificate Template</h3>

          {error && <div className="text-red-500 mb-3">{error}</div>}

          <div className="space-y-4">
            {/* Template Name */}
            <div>
              <label className="block mb-1 font-medium">Template Name</label>
              <input
                placeholder="Enter template name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Dates */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium">Created Date</label>
                <input
                  type="date"
                  value={createdDate}
                  onChange={(e) => setCreatedDate(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium">Validity Date</label>
                <input
                  type="date"
                  value={validityDate}
                  onChange={(e) => setValidityDate(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Orientation */}
            <div>
              <label className="block mb-1 font-medium">Orientation</label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="orient"
                    checked={orientation === "Portrait"}
                    onChange={() => setOrientation("Portrait")}
                  />
                  Portrait
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="orient"
                    checked={orientation === "Landscape"}
                    onChange={() => setOrientation("Landscape")}
                  />
                  Landscape
                </label>
              </div>
            </div>

            {/* Domain dropdown only for domains table */}
            {nodeType === "domains" && (
              <div>
                <label className="block mb-1 font-medium">Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select domain</option>
                  {domains.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Variables */}
            <div>
              <label className="block mb-1 font-medium">Variables</label>
              <div className="flex gap-2">
                <input
                  placeholder="Enter variable name"
                  value={variableInput}
                  onChange={(e) => setVariableInput(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  onClick={addVariable}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Add
                </button>
              </div>

              {variables.length > 0 && (
                <div className="mt-3 space-y-2">
                  {variables.map((v) => (
                    <div
                      key={v}
                      className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                    >
                      <span>{v}</span>
                      <button
                        onClick={() => removeVariable(v)}
                        className="text-red-600 hover:underline"
                      >
                        remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </CenteredPortal>
  );
}




// // static cretae modal
// import { useState } from "react";
// import { CenteredPortal } from "./CenteredPortal";

// export function CreateTemplateModal({
//   onClose,
//   onCreate,
//   domains = [],
//   showDomainDropdown = false
// }) {
//   const [name, setName] = useState("");
//   const [issueDate, setIssueDate] = useState("");
//   const [validityDate, setValidityDate] = useState("");
//   const [orientation, setOrientation] = useState("Portrait");
//   const [domain, setDomain] = useState(domains[0] || "");

//   // NEW — variables list
//   const [variableInput, setVariableInput] = useState("");
//   const [variables, setVariables] = useState([]);

//   const addVariable = () => {
//     const v = variableInput.trim();
//     if (!v) return;
//     setVariables(prev => [...prev, v]);
//     setVariableInput("");
//   };

//   const removeVariable = (v) => {
//     setVariables(prev => prev.filter(x => x !== v));
//   };

//   return (
//     <CenteredPortal>
//       <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
//         <div
//           className="bg-white rounded-lg p-6 w-full max-w-lg"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <h3 className="text-xl font-semibold mb-4">
//             Create Certificate Template
//           </h3>

//           <div className="space-y-4">

//             {/* Template Name */}
//             <div>
//               <label className="block mb-1 font-medium">Template Name</label>
//               <input
//                 placeholder="Enter template name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full border rounded px-3 py-2"
//               />
//             </div>

//             {/* Issue + Validity Dates */}
//             <div className="flex gap-4">
//               <div className="w-1/2">
//                 <label className="block mb-1 font-medium">Issue Date</label>
//                 <input
//                   type="date"
//                   value={issueDate}
//                   onChange={(e) => setIssueDate(e.target.value)}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//               <div className="w-1/2">
//                 <label className="block mb-1 font-medium">
//                   Validity Date
//                 </label>
//                 <input
//                   type="date"
//                   value={validityDate}
//                   onChange={(e) => setValidityDate(e.target.value)}
//                   className="w-full border rounded px-3 py-2"
//                 />
//               </div>
//             </div>

//             {/* Orientation */}
//             <div>
//               <label className="block mb-1 font-medium">Orientation</label>
//               <div className="flex items-center gap-4 mt-1">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="orient"
//                     checked={orientation === "Portrait"}
//                     onChange={() => setOrientation("Portrait")}
//                   />
//                   Portrait
//                 </label>

//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="orient"
//                     checked={orientation === "Landscape"}
//                     onChange={() => setOrientation("Landscape")}
//                   />
//                   Landscape
//                 </label>
//               </div>
//             </div>

//             {/* Domains (only when allowed) */}
//             {showDomainDropdown && (
//               <div>
//                 <label className="block mb-1 font-medium">Domain</label>
//                 <select
//                   value={domain}
//                   onChange={(e) => setDomain(e.target.value)}
//                   className="w-full border rounded px-3 py-2"
//                 >
//                   <option value="">Select domain</option>
//                   {domains.map((d) => (
//                     <option key={d} value={d}>
//                       {d}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Variables Section */}
//             <div>
//               <label className="block mb-1 font-medium">Variables</label>

//               <div className="flex gap-2">
//                 <input
//                   placeholder="Enter variable name"
//                   value={variableInput}
//                   onChange={(e) => setVariableInput(e.target.value)}
//                   className="flex-1 border rounded px-3 py-2"
//                 />
//                 <button
//                   onClick={addVariable}
//                   className="px-4 py-2 bg-green-600 text-white rounded"
//                 >
//                   Add
//                 </button>
//               </div>

//               {/* Render variable list */}
//               {variables.length > 0 && (
//                 <div className="mt-3 space-y-2">
//                   {variables.map((v) => (
//                     <div
//                       key={v}
//                       className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
//                     >
//                       <span>{v}</span>
//                       <button
//                         onClick={() => removeVariable(v)}
//                         className="text-red-600 hover:underline"
//                       >
//                         remove
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-2 mt-6">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 border rounded"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => {
//                 if (!name.trim()) return;

//                 onCreate({
//   id: crypto.randomUUID(),
//   templateName: name.trim(),      // <-- renamed
//   startDate: issueDate,           // <-- renamed
//   endDate: validityDate,          // <-- renamed
//   validity: validityDate,         // optional, you can map if needed
//   orientation,
//   domain: showDomainDropdown ? domain : null,
//   variables
// });

//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               Create
//             </button>
//           </div>
//         </div>
//       </div>
//     </CenteredPortal>
//   );
// }




// // code after domain addition
// import React, { useState } from "react";
// import { CenteredPortal } from "./CenteredPortal";

// /*
//  Props:
//   - onClose()
//   - onCreate(templateObj)
//   - domains: array of domain strings (from backend)
//   - showDomainDropdown: boolean (if true show select)
// */
// export function CreateTemplateModal({ onClose, onCreate, domains = [], showDomainDropdown = false }) {
//   const [orientation, setOrientation] = useState("Portrait");
//   const [certificateName, setCertificateName] = useState("");
//   const [domain, setDomain] = useState(domains[0] || "");
//   const [issueDate, setIssueDate] = useState("");
//   const [validityDate, setValidityDate] = useState("");
//   const [variables, setVariables] = useState([]); // New state for variables
//   const [variableInput, setVariableInput] = useState(""); // input for new variable
//   const [errors, setErrors] = useState({});

//   function handleAddVariable() {
//     const val = variableInput.trim();
//     if (val && !variables.includes(val)) {
//       setVariables([...variables, val]);
//       setVariableInput("");
//     }
//   }

//   function handleRemoveVariable(idx) {
//     const newVars = [...variables];
//     newVars.splice(idx, 1);
//     setVariables(newVars);
//   }

//   function handleCreate() {
//     const e = {};
//     if (!certificateName.trim()) e.certificateName = "Required";
//     if (!issueDate) e.issueDate = "Required";
//     if (!validityDate) e.validityDate = "Required";
//     if (showDomainDropdown && !domain) e.domain = "Select domain";
//     if (Object.keys(e).length) { setErrors(e); return; }

//     const template = {
//       name: certificateName.trim(),
//       issueDate,
//       validityDate,
//       orientation,
//       domain: showDomainDropdown ? domain : undefined,
//       variables
//     };

//     onCreate(template);

//     // open canvas with params
//     const params = new URLSearchParams({
//       orientation,
//       certificateName: certificateName.trim(),
//       domain: showDomainDropdown ? domain : "",
//       createdDate: issueDate,
//       validityDate,
//       variables: variables.join(", ")
//     }).toString();
//     window.open(`/certificate-canvas?${params}`, "_blank");
//   }

//   return (
//     <CenteredPortal>
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 p-4">
//         <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//           <h2 className="text-xl font-semibold mb-4">Create Template</h2>

//           {/* Orientation */}
//           <div className="mb-3">
//             <label className="block mb-1">Orientation</label>
//             <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full border rounded px-2 py-1">
//               <option>Portrait</option>
//               <option>Landscape</option>
//             </select>
//           </div>

//           {/* Certificate Name */}
//           <div className="mb-3">
//             <label className="block mb-1">Certificate Name</label>
//             <input value={certificateName} onChange={(e) => setCertificateName(e.target.value)} className="w-full border rounded px-2 py-1" />
//             {errors.certificateName && <p className="text-red-500 text-sm">{errors.certificateName}</p>}
//           </div>

//           {/* Domain dropdown */}
//           {showDomainDropdown && (
//             <div className="mb-3">
//               <label className="block mb-1">Domain</label>
//               <select value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full border rounded px-2 py-1">
//                 <option value="">-- choose domain --</option>
//                 {domains.map((d) => <option key={d} value={d}>{d}</option>)}
//               </select>
//               {errors.domain && <p className="text-red-500 text-sm">{errors.domain}</p>}
//             </div>
//           )}

//           {/* Variables */}
//           <div className="mb-3">
//             <label className="block mb-1">Variables</label>
//             <div className="flex gap-2 mb-2">
//               <input
//                 value={variableInput}
//                 onChange={(e) => setVariableInput(e.target.value)}
//                 placeholder="Add variable"
//                 className="flex-1 border rounded px-2 py-1"
//                 onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddVariable(); } }}
//               />
//               <button onClick={handleAddVariable} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {variables.map((v, idx) => (
//                 <span key={idx} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
//                   {v}
//                   <button onClick={() => handleRemoveVariable(idx)} className="text-red-500 font-bold">×</button>
//                 </span>
//               ))}
//             </div>
//           </div>

//           {/* Issue & Validity Dates */}
//           <div className="flex gap-2 mb-4">
//             <div className="flex-1">
//               <label className="block mb-1">Issue Date</label>
//               <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full border rounded px-2 py-1" />
//               {errors.issueDate && <p className="text-red-500 text-sm">{errors.issueDate}</p>}
//             </div>
//             <div className="flex-1">
//               <label className="block mb-1">Validity Date</label>
//               <input type="date" value={validityDate} onChange={(e) => setValidityDate(e.target.value)} className="w-full border rounded px-2 py-1" />
//               {errors.validityDate && <p className="text-red-500 text-sm">{errors.validityDate}</p>}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-2">
//             <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
//             <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
//           </div>
//         </div>
//       </div>
//     </CenteredPortal>
//   );
// }




// code before domains addition
// import { useState } from "react";
// import { CenteredPortal } from "../CertificateManager";

// export function CreateTemplateModal({ onClose, onCreate, domains = [] }) {
//   // simplified create modal; onCreate returns template object
//   const [orientation, setOrientation] = useState("Portrait");
//   const [certificateName, setCertificateName] = useState("");
//   const [domain, setDomain] = useState(domains[0] || "");
//   const [createdDate, setCreatedDate] = useState("");
//   const [validityDate, setValidityDate] = useState("");
//   const [errors, setErrors] = useState({});

//   function handleCreate() {
//     const e = {};
//     if (!certificateName.trim()) e.certificateName = "Required";
//     if (!createdDate) e.createdDate = "Required";
//     if (!validityDate) e.validityDate = "Required";
//     if (Object.keys(e).length) { setErrors(e); return; }

//     const template = {
//       name: certificateName,
//       issueDate: createdDate,
//       validityDate,
//       orientation,
//       // domains: [domain],
//     };

//     onCreate(template);

//     // ⭐ NEW CODE → OPEN CANVAS
//     const params = new URLSearchParams({
//       orientation,
//       certificateName,
//       // domain,
//       createdDate,
//       validityDate,
//     }).toString();
//     window.open(`/certificate-canvas?${params}`, "_blank");
//   }


//   return (
//     <CenteredPortal>
//       {/* <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"> */}
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30
//                 overflow-auto p-4">

//         <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
//           <h2 className="text-xl font-bold mb-4">Create Template</h2>

//           <div className="mb-3">
//             <label className="block mb-1">Orientation</label>
//             <select value={orientation} onChange={(e) => setOrientation(e.target.value)} className="w-full border rounded px-2 py-1">
//               <option>Portrait</option>
//               <option>Landscape</option>
//             </select>
//           </div>

//           <div className="mb-3">
//             <label className="block mb-1">Certificate Name</label>
//             <input value={certificateName} onChange={(e) => setCertificateName(e.target.value)} className="w-full border rounded px-2 py-1" />
//             {errors.certificateName && <p className="text-red-500 text-sm">{errors.certificateName}</p>}
//           </div>

//           {/* <div className="mb-3">
//             <label className="block mb-1">Domain</label>
//             <select value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full border rounded px-2 py-1">
//               {domains.map((d) => <option key={d} value={d}>{d}</option>)}
//             </select>
//           </div> */}

//           <div className="flex gap-2 mb-4">
//             <div className="flex-1">
//               <label className="block mb-1">Issue Date</label>
//               <input type="date" value={createdDate} onChange={(e) => setCreatedDate(e.target.value)} className="w-full border rounded px-2 py-1" />
//             </div>
//             <div className="flex-1">
//               <label className="block mb-1">Validity Date</label>
//               <input type="date" value={validityDate} onChange={(e) => setValidityDate(e.target.value)} className="w-full border rounded px-2 py-1" />
//             </div>
//           </div>

//           <div className="flex justify-end gap-2">
//             <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
//             <button onClick={handleCreate} className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
//           </div>
//         </div>
//       </div>
//     </CenteredPortal>
//   );
// }