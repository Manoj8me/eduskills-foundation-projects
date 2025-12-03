import { EmptyState } from "../CertificateManager";
import { CenteredPortal } from "./CenteredPortal";

// completely new loop of categories/sub categories
export function DomainTemplatesModal({ category, onClose, onViewTemplate, onEditTemplate, onEditTemplateDetails }){
  // category: node object which contains domains map
  const domains = category?.domains || {};
  return (
    <CenteredPortal>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
        <div className="bg-white rounded p-6 w-full max-w-2xl overflow-auto" onClick={e=>e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{category.name} — Domain Certificates</h3>
            <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
          </div>

          {Object.keys(domains).length === 0 ? (
            <EmptyState title="No templates" message="No templates created for this node yet." />
          ) : (
            Object.entries(domains).map(([d, arr])=> (
              <div key={d} className="mb-4 border rounded">
                <div className="bg-gray-100 px-4 py-2 font-semibold">{d === '_ungrouped' ? 'Ungrouped' : d}</div>
                <div>
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="p-2 text-left">Template</th>
                        <th className="p-2 text-left">Issue</th>
                        <th className="p-2 text-left">Validity</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arr.map(t=> (
                        <tr key={t.id} className="border-t">
                          <td className="p-2">{t.name}</td>
                          <td className="p-2">{t.issueDate || '—'}</td>
                          <td className="p-2">{t.validityDate || '—'}</td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <button onClick={()=>onViewTemplate(t)} className="px-2 py-1 border rounded">Preview</button>
                              <button onClick={()=>onEditTemplate(t)} className="px-2 py-1 border rounded">Edit Canvas</button>
                              <button onClick={()=>onEditTemplateDetails(t)} className="px-2 py-1 border rounded">Edit Details</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CenteredPortal>
  );
}




// import { useState } from "react";
// import { createPortal } from "react-dom";
// import { CenteredPortal } from "./CenteredPortal";
// import { DeleteTemplateModal } from "./DeleteTemplateModal";

// export function DomainTemplatesModal({
//   category,
//   onClose,
//   onEditTemplate,
//   onViewTemplate,
//   onEditTemplateDetails
// }) {
//   const [actionModal, setActionModal] = useState(null); // { template, x, y }
//   const [deleteModal, setDeleteModal] = useState(null);

//   const domainsMap = category?.domains || {};
//   const templates = domainsMap[category.selectedDomain] || [];

//   function openActionModal(template, event) {
//     const rect = event.currentTarget.getBoundingClientRect();
//     setActionModal({ template, x: rect.left, y: rect.bottom + window.scrollY + 6 });
//   }

//   function closeActionModal() {
//     setActionModal(null);
//   }

//   return createPortal(
//     <CenteredPortal>
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 p-4" onClick={closeActionModal}>
//         <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>

//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">
//               Certificates — {category.name} / {category.selectedDomain}
//             </h2>
//             <button className="px-3 py-1 border rounded" onClick={onClose}>Close</button>
//           </div>

//           <table className="w-full border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="py-2 px-3 text-left">Template Name</th>
//                 <th className="py-2 px-3 text-left">Orientation</th>
//                 <th className="py-2 px-3 text-left">Issue Date</th>
//                 <th className="py-2 px-3 text-left">Validity Date</th>
//                 <th className="py-2 px-3 text-left">Variables</th>
//                 <th className="py-2 px-3 text-left">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {templates.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="py-6 text-center text-gray-500">
//                     No certificates under this domain.
//                   </td>
//                 </tr>
//               ) : (
//                 templates.map((tpl) => (
//                   <tr key={tpl.id} className="border-b hover:bg-gray-50">
//                     <td className="py-2 px-3">{tpl.name}</td>
//                     <td className="py-2 px-3">{tpl.orientation}</td>
//                     <td className="py-2 px-3">{tpl.issueDate}</td>
//                     <td className="py-2 px-3">{tpl.validityDate}</td>
//                     <td className="py-2 px-3">{(tpl.variables || []).join(", ")}</td>
//                     <td className="py-2 px-3">
//                       <button
//                         className="px-2 py-1 border rounded hover:bg-gray-200"
//                         onClick={(e) => { e.stopPropagation(); openActionModal(tpl, e); }}
//                       >
//                         ⋮
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* Action Modal */}
//           {actionModal && (
//             <div
//               className="absolute bg-white border shadow-lg rounded z-50 w-48"
//               style={{ top: actionModal.y, left: actionModal.x }}
//             >
//               <button className="w-full px-3 py-2 text-left hover:bg-gray-100"
//                       onClick={() => { closeActionModal(); onEditTemplate(actionModal.template); }}>
//                 Edit Template
//               </button>
//               <button className="w-full px-3 py-2 text-left hover:bg-gray-100"
//                       onClick={() => { closeActionModal(); onViewTemplate(actionModal.template); }}>
//                 View Template
//               </button>
//               <button className="w-full px-3 py-2 text-left hover:bg-gray-100"
//                       onClick={() => { closeActionModal(); onEditTemplateDetails(actionModal.template); }}>
//                 Edit Template Details
//               </button>
//               <button className="w-full px-3 py-2 text-left hover:bg-red-100 text-red-600"
//                       onClick={() => { closeActionModal(); setDeleteModal(actionModal.template); }}>
//                 Delete Template
//               </button>
//             </div>
//           )}

//           {/* Delete Template Modal */}
//           {deleteModal && (
//             <DeleteTemplateModal
//               title="Delete Template"
//               message={`Are you sure you want to delete "${deleteModal.name}"?`}
//               onCancel={() => setDeleteModal(null)}
//               onConfirm={() => {
//                 // Remove template
//                 const domain = category.selectedDomain;
//                 const idx = (category.domains[domain] || []).findIndex(t => t.id === deleteModal.id);
//                 if (idx !== -1) category.domains[domain].splice(idx, 1);
//                 setDeleteModal(null);
//               }}
//             />
//           )}

//         </div>
//       </div>
//     </CenteredPortal>,
//     document.body
//   );
// }
