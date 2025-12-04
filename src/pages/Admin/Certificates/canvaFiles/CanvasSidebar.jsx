// after design
// CanvasSidebar.jsx
import React, { useState } from "react";
import { Type, ImageUp, Pencil, Trash2, Plus } from "lucide-react";
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
    token
}) {

    const [variables, setVariables] = useState([]);
    const [loadingVars, setLoadingVars] = useState(false);
    const [varError, setVarError] = useState("");

    const [addMode, setAddMode] = useState(false);
    const [newVarName, setNewVarName] = useState("");

    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");

    // -------------------------------------------------------
    // FETCH VARIABLES
    // -------------------------------------------------------
    const loadVariables = async () => {
        if (!versionId || !token) return;

        setLoadingVars(true);
        setVarError("");

        try {
            const res = await fetch(`${BASE_URL}/admin/variables/${versionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setVarError("Failed to load variables");
                return;
            }

            const data = await res.json();
            setVariables(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Variable fetch error:", err);
            setVarError("Error loading variables.");
        } finally {
            setLoadingVars(false);
        }
    };

    // -------------------------------------------------------
    // ADD VARIABLE
    // -------------------------------------------------------
    const addVariable = async () => {
        if (!newVarName.trim()) return;

        try {
            const res = await fetch(`${BASE_URL}/admin/certificate/variable`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    version_id: versionId,
                    variable: newVarName.trim(),
                }),
            });

            if (!res.ok) {
                alert("Failed to add variable");
                return;
            }

            setNewVarName("");
            setAddMode(false);
            loadVariables();

        } catch (err) {
            console.error("Add variable error:", err);
        }
    };

    // -------------------------------------------------------
    // EDIT VARIABLE
    // -------------------------------------------------------
    const saveEditVariable = async () => {
        if (!editName.trim()) return;

        try {
            const res = await fetch(`${BASE_URL}/admin/certificate/variable`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    version_id: versionId,
                    variable_id: editId,
                    new_variable: editName.trim(),
                }),
            });

            if (!res.ok) {
                alert("Failed to edit variable");
                return;
            }

            setEditId(null);
            setEditName("");
            loadVariables();

        } catch (err) {
            console.error("Edit variable error:", err);
        }
    };

    // -------------------------------------------------------
    // DELETE VARIABLE
    // -------------------------------------------------------
    const deleteVariable = async (id) => {
        if (!window.confirm("Delete this variable?")) return;

        try {
            const res = await fetch(`${BASE_URL}/admin/certificate/variable`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    version_id: versionId,
                    variable_id: id,
                }),
            });

            if (!res.ok) {
                alert("Failed to delete variable");
                return;
            }

            loadVariables();

        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    // -------------------------------------------------------
    // PANEL HANDLERS
    // -------------------------------------------------------
    const openVariablesPanel = () => {
        setPanelType("variables");
        setShowPanel((s) => !s);
        loadVariables();
    };

    return (
        <aside className="sidebar" ref={sidebarRef}>
            <div className="sidebar-inner">

                {/* TEXT */}
                <div className="sidebar-item sidebar-item--pretty" onClick={() => {
                    setPanelType("text");
                    setShowPanel((s) => !s);
                }}>
                    <div className="icon"><Type size={22} /></div>
                    <div className="label">Text</div>
                </div>

                {/* UPLOADS */}
                <div className="sidebar-item sidebar-item--pretty" onClick={() => {
                    setPanelType("uploads");
                    setShowPanel((s) => !s);
                }}>
                    <div className="icon"><ImageUp size={22} /></div>
                    <div className="label">Uploads</div>
                </div>

                {/* VARIABLES */}
                <div className="sidebar-item sidebar-item--pretty" onClick={openVariablesPanel}>
                    <div className="icon">{`{}`}</div>
                    <div className="label">Variables</div>
                </div>
            </div>

            {/* FLOATING PANEL */}
            {showPanel && (
                <div className="sidebar-panel sidebar-panel--float" ref={panelRef}>

                    {/* ------------------------------ */}
                    {/* VARIABLES PANEL */}
                    {/* ------------------------------ */}
                    {panelType === "variables" && (
                        <div className="panel-inner">
                            <div className="panel-title-row">
                                <div className="panel-title">Dynamic Variables</div>

                                {/* ADD VARIABLE BUTTON */}
                                <button
                                    className="panel-btn small"
                                    onClick={() => {
                                        setAddMode(!addMode);
                                        setEditId(null);
                                        setNewVarName("");
                                    }}
                                >
                                    <Plus size={16} /> Add
                                </button>
                            </div>

                            {addMode && (
                                <div className="add-box">
                                    <input
                                        type="text"
                                        placeholder="New variable name..."
                                        value={newVarName}
                                        onChange={(e) => setNewVarName(e.target.value)}
                                    />
                                    <button onClick={addVariable}>Save</button>
                                </div>
                            )}

                            {loadingVars && <div className="muted">Loading...</div>}
                            {varError && <div className="error">{varError}</div>}

                            {variables.map((v) => (
                                // <div className="var-row" key={v.variable_id}>
                                <div className="var-row flex items-center justify-between bg-gray-100 p-2 rounded" key={v.variable_id}>

                                    {/* DRAG + INSERT */}
                                    <div
                                        className="var-item"
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData("variableName", v.variable_name);
                                        }}
                                        onClick={() => insertVariableIntoSelected(v.variable_name)}
                                    >
                                        {editId === v.variable_id ? (
                                            <input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        ) : (
                                            `{{${v.variable_name}}}`
                                        )}
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="var-actions flex gap-2">
                                        {/* <div className="var-actions"> */}

                                        {/* EDIT */}
                                        {editId === v.variable_id ? (
                                            <button className="icon-btn" onClick={saveEditVariable}>
                                                Save
                                            </button>
                                        ) : (
                                            <Pencil
                                                className="cursor-pointer text-gray-600 hover:text-black"
                                                size={16}
                                                // className="icon-btn"
                                                // size={16}
                                                onClick={() => {
                                                    setEditId(v.variable_id);
                                                    setEditName(v.variable_name);
                                                    setAddMode(false);
                                                }}
                                            />
                                        )}

                                        {/* DELETE */}
                                        <Trash2
                                            className="cursor-pointer text-red-500 hover:text-red-700"
                                            size={16}
                                            // className="icon-btn delete"
                                            // size={16}
                                            onClick={() => deleteVariable(v.variable_id)}
                                        />
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}

                    {/* ------------------------------ */}
                    {/* TEXT & UPLOADS PANELS UNCHANGED */}
                    {/* ------------------------------ */}

                    {panelType === "text" && (
                        <div className="panel-inner">
                            <div className="panel-title">Text</div>
                            <button className="panel-btn" onClick={addText}>Add Text</button>
                        </div>
                    )}

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
