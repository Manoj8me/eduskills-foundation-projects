import { createPortal } from "react-dom";

// completely new loop of categories/sub categories
export function CenteredPortal({ children }){
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {children}
    </div>, document.body
  );
}


// // CenteredPortal.jsx
// import { createPortal } from "react-dom";
// import React from "react";

// export function CenteredPortal({ children }) {
//   return createPortal(
//     <div className="fixed inset-0 flex items-center justify-center z-[9999]">
//       {children}
//     </div>,
//     document.body
//   );
// }
