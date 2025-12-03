import { useEffect, useState } from "react";
import { CenteredPortal } from "./CenteredPortal";

// completely new loop of categories/sub categories
export function EditCategoryModal({ categoryName = "", onCancel, onSave }){
  const [name, setName] = useState(categoryName);
  useEffect(()=> setName(categoryName), [categoryName]);
  return (
    <CenteredPortal>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
        <div className="bg-white rounded p-6 w-full max-w-md" onClick={e=>e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-2">Edit Name</h3>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded px-3 py-2 mb-4" />
          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={()=>name.trim() && onSave(name.trim())} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </div>
      </div>
    </CenteredPortal>
  );
}



// import { useEffect, useState } from "react";
// import { CenteredPortal } from "./CenteredPortal";

// export function EditCategoryModal({ categoryName = "", onCancel, onSave, title = "Edit Category Name" }) {
//     const [name, setName] = useState(categoryName);
//     useEffect(() => setName(categoryName), [categoryName]);
//     return (
//         <CenteredPortal>
//             {/* <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"> */}
//             <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30
//                 overflow-auto p-4">

//                 <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
//                     <h2 className="text-xl font-bold mb-4">{title}</h2>
//                     <input value={name} onChange={(e) => setName(e.target.value)}
//                         className="w-full border rounded px-3 py-2 mb-4" />
//                     <div className="flex justify-end gap-2">
//                         <button onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
//                         <button onClick={() => onSave(name)} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
//                     </div>
//                 </div>
//             </div>
//         </CenteredPortal>
//     );
// }
