// dynamic api post api code
import { useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../../api";


export function AddCategoryModal({ onCancel, onSaved }) {
  const [name, setName] = useState("");
  const [choice, setChoice] = useState(null); // 'domains' | 'subcategories' | 'choose-template'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Map choice to subcategory key for payload
  const getSubcategoryValue = () => {
    switch (choice) {
      case "choose-template":
        return 0;
      case "subcategories":
        return 1;
      case "domains":
        return 2;
      default:
        return 2; // default to domains if not selected
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !choice) return;

    const payload = {
      category_name: name.trim(),
      subcategory: getSubcategoryValue(),
    };

    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/admin/categories/main", payload);

      // onSaved callback to refresh table or update UI
      if (onSaved) onSaved(response.data);

      onCancel(); // close modal after successful save
    } catch (err) {
      console.error(err);
      setError("Failed to save category. Please try again.");
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
        <h2 className="text-xl font-bold mb-4">Add Category</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
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



// // static working code single certificate manager
// import { useState } from "react";
// import { createPortal } from "react-dom";

// // completely new loop of categories/sub categories
// export function AddCategoryModal({ onCancel, onSave, defaultName = "" }) {
//   const [name, setName] = useState(defaultName);

//   // 'domains' | 'subcategories' | 'choose-template'
//   const [choice, setChoice] = useState(null);

//   return createPortal(
//     <div
//       className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
//       onClick={onCancel}
//     >
//       <div
//         onClick={(e) => e.stopPropagation()}
//         className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md"
//       >
//         <h2 className="text-xl font-bold mb-4">Add Node</h2>

//         <input
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Name"
//           className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-600"
//         />

//         <div className="space-y-3 mb-4">
//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="radio"
//               name="node-type"
//               checked={choice === "domains"}
//               onChange={() => setChoice("domains")}
//             />
//             <span>Does this have domains?</span>
//           </label>

//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="radio"
//               name="node-type"
//               checked={choice === "subcategories"}
//               onChange={() => setChoice("subcategories")}
//             />
//             <span>Does this have subcategories?</span>
//           </label>

//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="radio"
//               name="node-type"
//               checked={choice === "choose-template"}
//               onChange={() => setChoice("choose-template")}
//             />
//             <span>Create template?</span>
//           </label>
//         </div>

//         <div className="flex justify-end gap-2">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 border rounded hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={() => {
//               if (!name.trim()) return;

//               onSave({
//                 name: name.trim(),
//                 type: choice || "domains", // default to 'domains'
//               });

//               onCancel(); // CLOSE THE MODAL AFTER SAVE
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// }

