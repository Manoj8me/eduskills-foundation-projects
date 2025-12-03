// after design
// CanvasSidebar.jsx
import React, { useState } from "react";
import { Type, ImageUp } from "lucide-react";
import { BASE_URL } from "../../../../services/configUrls";

export default function CanvasSidebar({
    sidebarRef,
    panelRef,
    showPanel,
    setShowPanel,
    panelType,
    setPanelType,
    uploads,
    setUploads,
    addText,
    addImage,
    handleFiles,
    versionId,
    insertVariableIntoSelected,
    token               // ✅ FIX: token is received here
}) {

    const [variables, setVariables] = useState([]);
    const [loadingVars, setLoadingVars] = useState(false);
    const [varError, setVarError] = useState("");

    // -----------------------------------------
    // LOAD VARIABLES (AUTH REQUIRED)
    // -----------------------------------------
    const loadVariables = async () => {
        if (!versionId) {
            setVarError("version_id missing");
            return;
        }

        if (!token) {
            setVarError("Token missing. Cannot authenticate.");
            return;
        }

        setLoadingVars(true);
        setVarError("");

        try {
            const res = await fetch(`${BASE_URL}/admin/variables/${versionId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,     // ✅ FIXED
                },
            });
            
            if (res.status === 401) {
                setVarError("Authentication failed (401). Invalid / expired token.");
                return;
            }

            const data = await res.json();

            if (Array.isArray(data)) {
                setVariables(data);
            } else {
                setVariables([]);
            }

        } catch (err) {
            console.error("Variable API error:", err);
            setVarError("Failed to load variables");
        } finally {
            setLoadingVars(false);
        }
    };

    // -----------------------------------------
    // PANEL HANDLERS
    // -----------------------------------------
    const openTextPanel = () => {
        setPanelType("text");
        setShowPanel((s) => !s);
    };

    const openUploadsPanel = () => {
        setPanelType("uploads");
        setShowPanel((s) => !s);
    };

    const openVariablesPanel = () => {
        setPanelType("variables");
        setShowPanel((s) => !s);
        loadVariables(); // 🟢 API call when panel opens
    };

    return (
        <aside className="sidebar" ref={sidebarRef}>
            <div className="sidebar-inner">

                {/* TEXT */}
                <div
                    className="sidebar-item sidebar-item--pretty"
                    onClick={openTextPanel}
                >
                    <div className="icon"><Type size={22} /></div>
                    <div className="label">Text</div>
                </div>

                {/* UPLOADS */}
                <div
                    className="sidebar-item sidebar-item--pretty"
                    onClick={openUploadsPanel}
                >
                    <div className="icon"><ImageUp size={22} /></div>
                    <div className="label">Uploads</div>
                </div>

                {/* VARIABLES */}
                <div
                    className="sidebar-item sidebar-item--pretty"
                    onClick={openVariablesPanel}
                >
                    <div className="icon">{`{}`}</div>
                    <div className="label">Variables</div>
                </div>
            </div>

            {/* FLOATING PANEL */}
            {showPanel && (
                <div className="sidebar-panel sidebar-panel--float" ref={panelRef}>

                    {/* TEXT PANEL */}
                    {panelType === "text" && (
                        <div className="panel-inner">
                            <div className="panel-title">Text</div>
                            <button className="panel-btn" onClick={addText}>Add Text</button>
                        </div>
                    )}

                    {/* UPLOADS PANEL */}
                    {panelType === "uploads" && (
                        <div className="panel-inner uploads">
                            <div className="panel-title">Uploads</div>

                            <label className="panel-btn file-label">
                                Upload files
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFiles}
                                />
                            </label>

                            <button className="panel-btn" onClick={() => setUploads([])}>
                                Clear
                            </button>

                            <div className="thumbs-grid">
                                {uploads.length === 0 && (
                                    <div className="muted">No uploads yet.</div>
                                )}

                                {uploads.map((u) => (
                                    <div className="thumb" key={u.id} onClick={() => addImage(u)}>
                                        <img src={u.src} alt={u.name} />
                                        <div className="tname">{u.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* VARIABLES PANEL */}
                    {panelType === "variables" && (
                        <div className="panel-inner">
                            <div className="panel-title">Dynamic Variables</div>

                            {loadingVars && <div className="muted">Loading...</div>}
                            {varError && <div className="error">{varError}</div>}

                            {!loadingVars && !varError && variables.length === 0 && (
                                <div className="muted">No variables found.</div>
                            )}

                            {variables.map((v) => (
                                <div
                                    key={v.variable_id}
                                    className="var-item"
                                    onClick={() => insertVariableIntoSelected(v.variable_name)}
                                >
                                    {`{{${v.variable_name}}}`}
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            )}
        </aside>
    );
}


// before design
// import React from "react";
// import { Type, ImageUp } from "lucide-react";

// export default function CanvasSidebar({
//     sidebarRef,
//     panelRef,
//     showPanel,
//     setShowPanel,
//     panelType,
//     setPanelType,
//     uploads,
//     setUploads,
//     addText,
//     addImage,
//     handleFiles,
//     // changes for adding placeholders
//     variableMap,
// insertVariableIntoSelected
// }) {
//     return (
//         <aside className="sidebar" ref={sidebarRef}>
//             <div className="sidebar-inner">

//                 {/* TEXT BUTTON */}
//                 <div
//                     className="sidebar-item sidebar-item--pretty"
//                     title="Text"
//                     onClick={() => {
//                         setShowPanel(s => !s);
//                         setPanelType("text");
//                     }}
//                 >
//                     <div className="icon">
//                         <Type size={22} strokeWidth={2.2} />
//                     </div>
//                     <div className="label">Text</div>
//                 </div>

//                 {/* UPLOADS BUTTON */}
//                 <div
//                     className="sidebar-item sidebar-item--pretty"
//                     title="Uploads"
//                     onClick={() => {
//                         setShowPanel(s => !s);
//                         setPanelType("uploads");
//                     }}
//                 >
//                     <div className="icon">
//                         <ImageUp size={22} strokeWidth={2.2} />
//                     </div>
//                     <div className="label">Uploads</div>
//                 </div>
//                 {/* changes for adding plaeholder */}
//                 {/* VARIABLES BUTTON */}
// <div
//     className="sidebar-item sidebar-item--pretty"
//     title="Variables"
//     onClick={() => {
//         setShowPanel(s => !s);
//         setPanelType("variables");
//     }}
// >
//     <div className="icon">{`{}`}</div>
//     <div className="label">Variables</div>
// </div>


//             </div>

//             {/* FLOATING PANEL */}
//             {showPanel && (
//                 <div className="sidebar-panel sidebar-panel--float" ref={panelRef}>

//                     {/* TEXT PANEL */}
//                     {panelType === "text" && (
//                         <div className="panel-inner">
//                             <div className="panel-title">Text</div>
//                             <div className="panel-row">
//                                 <button className="panel-btn" onClick={addText}>
//                                     Add Text
//                                 </button>
//                             </div>
//                             <div className="panel-note">
//                                 Click Add Text to place a text box on the certificate.
//                             </div>
//                         </div>
//                     )}

//                     {/* UPLOADS PANEL */}
//                     {panelType === "uploads" && (
//                         <div className="panel-inner uploads">
//                             <div className="panel-title">Uploads</div>

//                             <div className="panel-row">
//                                 <label className="panel-btn file-label">
//                                     Upload files
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         multiple
//                                         onChange={handleFiles}
//                                     />
//                                 </label>

//                                 <button
//                                     className="panel-btn"
//                                     onClick={() => setUploads([])}
//                                 >
//                                     Clear
//                                 </button>
//                             </div>

//                             <div className="thumbs-grid">
//                                 {uploads.length === 0 && (
//                                     <div className="muted">
//                                         No uploads yet — upload images to use
//                                     </div>
//                                 )}

//                                 {uploads.map(u => (
//                                     <div
//                                         className="thumb"
//                                         key={u.id}
//                                         onClick={() => addImage(u)}
//                                     >
//                                         <img src={u.src} alt={u.name} />
//                                         <div className="tname">{u.name}</div>
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="panel-note">
//                                 Click a thumbnail to insert into the certificate.
//                             </div>
//                         </div>
//                     )}
//                     {/* changes for adding placeholder */}
//                     {panelType === "variables" && (
//     <div className="panel-inner">
//         <div className="panel-title">Dynamic Variables</div>

//         {Object.keys(variableMap).map(group => (
//             <div key={group} className="var-group">
//                 <div className="var-group-title">{group.toUpperCase()}</div>

//                 {Object.values(variableMap[group]).map(v => (
//                     <div
//                         key={v}
//                         className="var-item"
//                         onClick={() => insertVariableIntoSelected(v)}
//                     >
//                         {`{{${v}}}`}

//                     </div>
//                 ))}
//             </div>
//         ))}

//         <div className="panel-note">
//             Click to insert into selected text element.
//         </div>
//     </div>
// )}


//                 </div>
//             )}
//         </aside>
//     );
// }
