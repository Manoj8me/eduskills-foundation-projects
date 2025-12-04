// code after new design
import React from "react";

export default function CanvasTopbar({
  back,
  undo,
  redo,
  save,   // ⬅ save function comes from parent
  preview,
  orientation,
  certificateName,
  A4
}) {
  return (
    <header className="topbar">
      {/* LEFT */}
      <div className="left">
        <button className="icon-btn" onClick={back}>←</button>
        <button className="icon-btn" onClick={undo}>⤺</button>
        <button className="icon-btn" onClick={redo}>⤼</button>
      </div>

      {/* CENTER */}
      <div className="center">
        <div className="meta">
          <span className="pill">{orientation.toUpperCase()}</span>
          <span className="pill">A4</span>

          <span className="pill small">
            {orientation === "portrait"
              ? `${A4.w} px × ${A4.h} px`
              : `${A4.h} px × ${A4.w} px`}
          </span>

          <div className="cert-title">{certificateName}</div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        <button className="icon-btn" onClick={save}>💾</button>
        <button className="btn-primary" onClick={preview}>Preview</button>
      </div>
    </header>
  );
}


// code before new design

// import React from "react";

// export default function CanvasTopbar({
//     back,
//     undo,
//     redo,
//     save,
//     preview,
//     orientation,
//     certificateName,
//     A4
// }) {
//     return (
//         <header className="topbar">
//             <div className="left">
//                 <button className="icon-btn" onClick={back} title="Back">←</button>
//                 <div className="spacer" />
//                 <button className="icon-btn" onClick={undo} title="Undo">⤺</button>
//                 <button className="icon-btn" onClick={redo} title="Redo">⤼</button>
//             </div>

//             <div className="center">
//                 <div className="meta">
//                     <span className="pill">{orientation.toUpperCase()}</span>
//                     <span className="pill">A4</span>

//                     <span className="pill small">
//                         {orientation === "portrait"
//                             ? `${A4.w} px x ${A4.h} px`
//                             : `${A4.h} px x ${A4.w} px`}
//                     </span>

//                     <div className="cert-title">{certificateName}</div>
//                 </div>
//             </div>

//             <div className="right">
//                 <button className="icon-btn" onClick={save} title="Save">💾</button>
//                 <button className="btn-primary" onClick={preview}>Preview</button>
//             </div>
//         </header>
//     );
// }
