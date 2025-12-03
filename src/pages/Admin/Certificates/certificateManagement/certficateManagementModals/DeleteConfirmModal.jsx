import { CenteredPortal } from "./CenteredPortal";

// completely new loop of categories/sub categories
export function DeleteConfirmModal({ title = "Confirm", message = "Are you sure?", onCancel, onConfirm }) {
  return (
    <CenteredPortal>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
        <div className="bg-white rounded p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
          </div>
        </div>
      </div>
    </CenteredPortal>
  );
}




// import { CenteredPortal } from "./CenteredPortal";

// export function DeleteConfirmModal({ title, message, onCancel, onConfirm }) {
//   return (
//     <CenteredPortal>
//       {/* <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"> */}
//       <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30
//                 overflow-auto p-4">

//         <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
//           <h2 className="text-xl font-bold mb-3">{title}</h2>
//           <p className="mb-6">{message}</p>
//           <div className="flex justify-end gap-2">
//             <button onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
//             <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">Confirm</button>
//           </div>
//         </div>
//       </div>
//     </CenteredPortal>
//   );
// }