// api try
// dynamic API - Add Subcategory Modal
import { useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../../api";

export function AddSubcategoryModal({ parentId, onCancel, onSaved }) {
  const [name, setName] = useState("");
  const [choice, setChoice] = useState(null); // 'domains' | 'subcategories' | 'choose-template'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Same mapping function as AddCategoryModal
  const getSubcategoryValue = () => {
    switch (choice) {
      case "choose-template":
        return 0;
      case "subcategories":
        return 1;
      case "domains":
        return 2;
      default:
        return 2;
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !choice) return;

    const payload = {
      parent_id: parentId,
      category_name: name.trim(),
      subcategory: getSubcategoryValue(),
    };

    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/admin/categories/sub", payload);

      // if (onSaved) onSaved(response.data);

      if (onSaved) onSaved(); // no args — parent won't accidentally treat this as a node

      onCancel(); // close modal
    } catch (err) {
      console.error(err);
      setError("Failed to save subcategory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Add Subcategory</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Subcategory Name"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-600"
        />

        <div className="space-y-3 mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="node-type"
              checked={choice === "domains"}
              onChange={() => setChoice("domains")}
            />
            <span>Does this have domains?</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="node-type"
              checked={choice === "subcategories"}
              onChange={() => setChoice("subcategories")}
            />
            <span>Does this have subcategories?</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="node-type"
              checked={choice === "choose-template"}
              onChange={() => setChoice("choose-template")}
            />
            <span>Create template?</span>
          </label>
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}



// import { useState } from "react";
// import { CenteredPortal } from "./CenteredPortal";

// // completely new loop of categories/sub categories
// export function AddSubcategoryModal({ onCancel, onSave }){
//   const [name, setName] = useState("");
//   // choices:
//   // - 'domains'  -> node.type === 'domains'
//   // - 'subcategories' -> node.type === 'subcategories'
//   // - 'template' -> we translate to payload.type === 'choose-template' (certificate-category)
//   const [choice, setChoice] = useState('subcategories');

//   return (
//     <CenteredPortal>
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 p-4" onClick={onCancel}>
//         <div onClick={e=>e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
//           <h2 className="text-xl font-bold mb-4">Add Subcategory</h2>

//           <input
//             value={name}
//             onChange={(e)=>setName(e.target.value)}
//             placeholder="Subcategory name"
//             className="w-full border rounded px-3 py-2 mb-4"
//           />

//           <div className="space-y-3 mb-4">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" name="sub-type" checked={choice === 'domains'} onChange={()=>setChoice('domains')} />
//               <span>Does this have domains?</span>
//             </label>

//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" name="sub-type" checked={choice === 'subcategories'} onChange={()=>setChoice('subcategories')} />
//               <span>Does this have subcategories?</span>
//             </label>

//             <label className="flex items-center gap-3 cursor-pointer">
//               <input type="radio" name="sub-type" checked={choice === 'template'} onChange={()=>setChoice('template')} />
//               <span>Create template?</span>
//             </label>
//           </div>

//           <div className="flex justify-end gap-2">
//             <button onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
//             <button
//               onClick={()=>{
//                 if(!name.trim()) return;
//                 // If user selected "Create template?" we must send the special type 'choose-template'
//                 const payloadType = choice === 'template' ? 'choose-template' : (choice || 'subcategories');
//                 onSave({ name: name.trim(), type: payloadType });
//               }}
//               className="px-4 py-2 rounded bg-blue-600 text-white"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </CenteredPortal>
//   );
// }
