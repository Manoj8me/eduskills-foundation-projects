// new fullycorrected code
// CertificateCanvas.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Rnd } from "react-rnd";
import { ImageUp, Type } from "lucide-react";
import { previewHtml } from "./previewHtml";
import "./CanvaStyles.css";
import DiscardConfirmModal from "./DiscardConfirmModal";
import MiniToolbar from "./MiniToolbar";
import CanvasPage from "./CanvasPage";
import CanvasSidebar from "./CanvasSidebar";
import CanvasTopbar from "./CanvasTopbar";
import { BASE_URL } from "../../../../services/configUrls";

/*
  CertificateCanvas - fixes:
   - apply font family from dropdown to live text & preview (loads Google Fonts into preview)
   - mini-toolbar single-row, colored, pushed up (not overlapping canvas)
   - make inputs readable inside toolbar (white text issue fixed)
   - added text color picker in mini-toolbar
   - images: remove extraneous white wrapper and allow resizing from all sides; default fill with cover to avoid white gaps
   - Align now sets textAlign on text elements
   - preview uses exact A4 dimensions (mm -> px conversion) and displays certificate name + dimensions
   - topbar z-index increased to avoid elements appearing on top while scrolling
*/

const uid = () => Math.random().toString(36).slice(2, 9);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function CertificateCanvas() {
    // codes after design    
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
const { versionId } = useParams();

    // ---- URL PARAMS (must come AFTER searchParams declaration) ----
    const orientation =
        searchParams.get("orientation")?.toLowerCase() === "landscape"
            ? "landscape"
            : "portrait";

    const certificateName =
        searchParams.get("certificateName") || "Untitled Certificate";

    const issueDate = searchParams.get("issueDate") || "";
    const validityDate = searchParams.get("validityDate") || "";

    // version_id (MUST be declared ONLY ONCE)
    // const versionId = searchParams.get("version_id");

    // ---- A4 dimensions ----
    const A4 = { w: 794, h: 1123 };
    const canvasSize =
        orientation === "portrait"
            ? { width: A4.w, height: A4.h }
            : { width: A4.h, height: A4.w };

    // ---- API Variables State ----
    const [variables, setVariables] = useState([]);

    // changes for adding placeholder
    // const VARIABLE_MAP = {
    //     student: {
    //         name: "student.name",
    //         id: "student.id",
    //         department: "student.department",
    //     },
    //     course: {
    //         title: "course.title",
    //         duration: "course.duration",
    //     },
    // };    
 

//  // old code before design
    // const navigate = useNavigate();

//     // // incoming navigation state
//     // const query = useQuery();

//     // const orientation =
//     //     (query.get("orientation") || "portrait").toLowerCase() === "landscape"
//     //         ? "landscape"
//     //         : "portrait";

//     // const certificateName = query.get("certificateName") || "Untitled Certificate";
//     // const domain = query.get("domain") || "";
//     // const createdDate = query.get("createdDate") || "";
//     // const validityDate = query.get("validityDate") || "";

//     // // A4 dimensions (mm) -- keep mm as canonical, convert later for preview px
//     // // A4 at 96 DPI (px)
//     // const A4 = { w: 794, h: 1123 };

//     const canvasSize =
//         orientation === "portrait" ? { width: A4.w, height: A4.h } : { width: A4.h, height: A4.w };

    

    // new design code 
    useEffect(() => {
        if (!versionId) return;

        async function fetchVariables() {
            try {
                const res = await fetch(`http://127.0.0.1:8000/admin/variables/${versionId}`);
                const data = await res.json();

                // Expected response:
                // [
                //   { "variable_id": 11, "variable_name": "institute name" },
                //   ...
                // ]

                setVariables(data || []);
            } catch (err) {
                console.error("Failed to load variables", err);
            }
        }

        fetchVariables();
    }, [versionId]);
    // --------------------------------------------------------------
// new design code
    // Insert Variable Into Selected Text    
    // State
    const [elements, setElements] = useState([]); // element list
    const [selectedId, setSelectedId] = useState(null);
    const [uploads, setUploads] = useState([]); // uploaded images (base64 src stored)
    const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
    const [lastSavedSnapshot, setLastSavedSnapshot] = useState(null);

    


    // history stacks
    const [history, setHistory] = useState([]);
    const [future, setFuture] = useState([]);

    // panel state
    const [showPanel, setShowPanel] = useState(false);
    const [panelType, setPanelType] = useState(null); // 'text' | 'uploads'
    const sidebarRef = useRef(null);
    const panelRef = useRef(null);

    // refs
    const paperRef = useRef(null);
    const miniToolbarRef = useRef(null);
    const editingRefs = useRef({});

    // push snapshot to history
    const pushSnapshot = useCallback((newElements) => {
        setHistory((h) => {
            const next = [...h, JSON.parse(JSON.stringify(newElements))];
            if (next.length > 80) next.shift();
            return next;
        });
        setFuture([]);
        setElements(newElements);
    }, []);

    // Insert variable helper (moved below pushSnapshot to avoid use-before-define lint issues)
    function insertVariableIntoSelected(variable) {
        const el = elements.find((e) => e.id === selectedId);
        if (!el || el.type !== "text") return;

        const placeholder = `{{${variable}}}`;

        const next = elements.map((e) =>
            e.id === selectedId
                ? {
                    ...e,
                    props: {
                        ...e.props,
                        text: e.props.text ? e.props.text + " " + placeholder : placeholder,
                    },
                }
                : e
        );

        pushSnapshot(next);
        // keep selection
    }

    // Add text
    function addText() {
        const id = uid();
        const el = {
            id,
            type: "text",
            x: 40,
            y: 40,
            width: 220,
            height: 60,
            rotation: 0,
            props: {
                text: "Double-click to edit",
                fontSize: 20,
                fontWeight: 400,
                italic: false,
                align: "left",
                uppercase: false,
                color: "#0f172a",
                fontFamily: "Inter",
            },
        };
        const next = [...elements, el];
        pushSnapshot(next);
        setSelectedId(id);
        setShowPanel(false);
        setPanelType(null);
    }

    // add placeholders/variables
const addVariableObject = (variableName) => {
    const id = Date.now();
    const newVar = {
        id,
        type: "text",
        x: 100,
        y: 100,
        width: 150,
        height: 40,
        rotation: 0,
        props: {
            text: `{{${variableName}}}`,
            fontSize: 20,
            fontWeight: 400,
            italic: false,
            align: "left",
            uppercase: false,
            color: "#0f172a",
            fontFamily: "Inter",
        },
    };

    setElements((prev) => [...prev, newVar]);   // ✅ correct state
};



    // Add image
    function addImage(upload) {
        const src = upload.src; // keep compatibility with your existing uploader

        const img = new Image();
        img.onload = () => {
            const naturalW = img.naturalWidth;
            const naturalH = img.naturalHeight;

            // canvas wrapper
            const wrapper = document.querySelector(".paper-inner");
            const rect = wrapper.getBoundingClientRect();

            const maxW = rect.width * 0.9;
            const maxH = rect.height * 0.9;

            let w = naturalW;
            let h = naturalH;

            // scale to fit canvas but never crop
            const scale = Math.min(maxW / w, maxH / h, 1);
            w *= scale;
            h *= scale;

            const el = {
                id: uid(),
                type: "image",
                x: rect.width / 2 - w / 2,
                y: rect.height / 2 - h / 2,
                width: w,
                height: h,
                rotation: 0,
                props: {
                    src: upload.src,
                    name: upload.name,
                    flipH: false,
                    flipV: false,
                    fit: "contain", // 🚀 no cropping
                },
            };

            pushSnapshot([...elements, el]);
            setSelectedId(el.id);
        };

        img.src = src;
    }

    // Handle files -> base64
    function handleFiles(e) {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const reads = files.map((f) => new Promise((res) => {
            const fr = new FileReader();
            fr.onload = () => res({ id: uid(), name: f.name, src: fr.result });
            fr.readAsDataURL(f);
        }));
        Promise.all(reads).then((arr) => {
            setUploads((u) => [...arr, ...u]);
            setShowPanel(true);
            setPanelType("uploads");
        });
        e.target.value = "";
    }

    // Live updates (drag/resize)
    function applyLive(id, patch) {
        setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...patch, props: { ...el.props, ...(patch.props || {}) } } : el)));
    }

    // Commit element change to history
    function commitElementChange(id, patch) {
        setElements((prev) => {
            const newEls = prev.map((el) => (el.id === id ? { ...el, ...patch, props: { ...el.props, ...(patch.props || {}) } } : el));
            pushSnapshot(newEls);
            return newEls;
        });
    }

    function toggleFit(id) {
        const el = elements.find((e) => e.id === id);
        if (!el || el.type !== "image") return;

        const wrapper = document.querySelector(".paper-inner");
        if (!wrapper) return;

        const rect = wrapper.getBoundingClientRect();
        const canvasW = rect.width;
        const canvasH = rect.height;

        const img = new Image();
        img.onload = () => {
            const naturalW = img.naturalWidth;
            const naturalH = img.naturalHeight;

            const fitMode = el.props.fit === "contain" ? "cover" : "contain";

            let newW, newH;

            if (fitMode === "contain") {
                // Fit fully inside canvas
                const scale = Math.min(canvasW / naturalW, canvasH / naturalH);
                newW = naturalW * scale;
                newH = naturalH * scale;
            } else {
                // Fill entire canvas (some parts may crop)
                const scale = Math.max(canvasW / naturalW, canvasH / naturalH);
                newW = naturalW * scale;
                newH = naturalH * scale;
            }

            commitElementChange(id, {
                width: newW,
                height: newH,
                x: canvasW / 2 - newW / 2,
                y: canvasH / 2 - newH / 2,
                props: { ...el.props, fit: fitMode },
            });
        };
        img.src = el.props.src;
    }

    function cropImage(id) {
        const el = elements.find((e) => e.id === id);
        if (!el || el.type !== "image") return;

        const img = new Image();
        img.onload = () => {
            const cropX = 20;   // You can later make UI for this
            const cropY = 20;
            const cropW = img.naturalWidth - 40;
            const cropH = img.naturalHeight - 40;

            const canvas = document.createElement("canvas");
            canvas.width = cropW;
            canvas.height = cropH;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

            const croppedSrc = canvas.toDataURL();

            commitElementChange(id, {
                width: el.width,
                height: el.height,
                props: {
                    ...el.props,
                    src: croppedSrc,
                },
            });
        };
        img.src = el.props.src;
    }

    // fit to container
    function fitToContainer(id) {
        const el = elements.find((e) => e.id === id);
        if (!el || el.type !== "image") return;

        // Get px-size of canvas
        const wrapper = document.querySelector(".paper-inner");
        if (!wrapper) return;

        const rect = wrapper.getBoundingClientRect();
        const pxWidth = rect.width;
        const pxHeight = rect.height;
        commitElementChange(id, {
            x: 0,
            y: 0,
            width: pxWidth,
            height: pxHeight,
            props: { ...el.props, fit: "contain" }, // <- use contain to avoid cropping
        });
    }

    // Duplicate
    function duplicate(id) {
        const el = elements.find((e) => e.id === id);
        if (!el) return;
        const copy = JSON.parse(JSON.stringify(el));
        copy.id = uid();
        copy.x += 18;
        copy.y += 18;
        const next = [...elements, copy];
        pushSnapshot(next);
        setSelectedId(copy.id);
    }

    // Delete
    function remove(id) {
        const next = elements.filter((e) => e.id !== id);
        pushSnapshot(next);
        setSelectedId(null);
    }

    // Rotate
    function rotate(id, delta) {
        const el = elements.find((e) => e.id === id);
        if (!el) return;
        const updated = { ...el, rotation: (el.rotation + delta + 360) % 360 };
        commitElementChange(id, updated);
    }

    // Text property change
    function setTextProp(id, key, value) {
        const el = elements.find((e) => e.id === id);
        if (!el) return;
        const next = elements.map((e) => (e.id === id ? { ...e, props: { ...e.props, [key]: value } } : e));
        pushSnapshot(next);
    }

    // Finish text edit
    function finishTextEdit(id, content) {
        const el = elements.find((e) => e.id === id);
        if (!el) return;
        const next = elements.map((e) => (e.id === id ? { ...e, props: { ...el.props, text: content } } : e));
        pushSnapshot(next);
    }

    // Undo/Redo
    function undo() {
        setHistory((h) => {
            if (h.length === 0) return h;
            setFuture((f) => [JSON.parse(JSON.stringify(elements)), ...f]);
            const prev = h[h.length - 1];
            setElements(prev);
            return h.slice(0, -1);
        });
        setSelectedId(null);
    }
    function redo() {
        setFuture((f) => {
            if (f.length === 0) return f;
            setHistory((h) => [...h, JSON.parse(JSON.stringify(elements))]);
            const [next, ...rest] = f;
            setElements(next);
            return rest;
        });
        setSelectedId(null);
    }

    // 🔥 STEP 1: Get Canvas HTML
  const getCanvasHTML = () => {
    const canvasElement = document.getElementById("certificate-canvas");
    return canvasElement ? canvasElement.outerHTML : "";
  };

  // 🔥 STEP 2: Get Metadata JSON from your canvas state (layers, text, images)
  const getMetadata = () => {
    // ⬅ customize based on your project
    return {
      created_at: new Date().toISOString(),
      items: elements,   // your own canvas object list
      orientation,
      size: A4,
    };
  };

  // 🔥 STEP 3: SAVE API CALL
  const handleSave = async () => {
    try {
      const rawHTML = getCanvasHTML();
      const metadataJson = JSON.stringify(getMetadata());

      const formData = new FormData();
      formData.append("version_id", versionId);
      formData.append("raw_html", rawHTML);
      formData.append("metadata", metadataJson);

      const res = await fetch(`${BASE_URL}/admin/certificate-templates/upload-html`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        alert("Failed to save certificate template");
        return;
      }

      const saved = await res.json();
      console.log("Saved template:", saved);

      alert("Certificate template saved successfully!");

    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong while saving");
    }
  };


    // Preview -> open new tab with exact px sizing (mm -> px)
    // renamed to handlePreview to avoid potential linter collisions
    const handlePreview = () => {
        // Build a simple sample mapping from VARIABLE_MAP for preview purposes.
        // You can replace these values with real data fetched from backend before generating PDFs.
        const sampleVars = {};
        // Object.values(VARIABLE_MAP).forEach((group) => {
        //     Object.values(group).forEach((path) => {
        //         const last = path.split(".").pop();
        //         const pretty = last.replace(/[_\-]/g, " ");
        //         sampleVars[path] = pretty.charAt(0).toUpperCase() + pretty.slice(1) + " (sample2)";
        //     });
        // });
        variables.forEach((v) => {
    const pretty = v.variable_name.replace(/[_\-]/g, " ");
    const clean = pretty.charAt(0).toUpperCase() + pretty.slice(1);
    sampleVars[v.variable_name] = clean + " (sample)";
});


        const html = previewHtml(elements, canvasSize, certificateName, sampleVars);
        const w = window.open("", "_blank");
        if (!w) return alert("Popup blocked — allow popups for preview.");
        w.document.open();
        w.document.write(html);
        w.document.close();
    };


    // Back with prompt if dirty
    function back() {
        const dirty = JSON.stringify(elements) !== lastSavedSnapshot;
        if (!dirty) {
            navigate("/certificate-manager");
            return;
        }
        setShowDiscardConfirm(true);
    }
    function confirmDiscard(doSave) {
        if (doSave) handleSave();
        setShowDiscardConfirm(false);
        navigate("/certificate-manager");
    }

    // Click outside canvas clears selection
    function onPaperMouseDown(e) {
        if (e.target === paperRef.current || e.target.closest(".paper-inner")) {
            if (!e.target.closest(".element")) setSelectedId(null);
        }
    }

    // Commit text blur on Enter
    function onTextKeyDown(e, id) {
        if (e.key === "Enter") {
            e.preventDefault();
            const content = e.target.innerText;
            finishTextEdit(id, content);
            e.target.blur();
        }
    }

    // init history
    useEffect(() => {
        setHistory([]);
        setFuture([]);
    }, []);

    // close panel when clicking outside it
    useEffect(() => {
        function onDocClick(e) {
            if (!e.target.closest(".sidebar") && !e.target.closest(".sidebar-panel")) {
                setShowPanel(false);
                setPanelType(null);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);


    // --- Render ---
    return (
        <div className=" CanvasStyles cert-root">
            {/* Topbar */}
            <CanvasTopbar
                back={back}
                undo={undo}
                redo={redo}
                save={handleSave}
                preview={handlePreview} // <-- pass the renamed handler
                orientation={orientation}
                certificateName={certificateName}
                A4={A4}
            />

            {/* Main content */}
            <div className="main">
                {/* Sidebar */}
                <CanvasSidebar
                    sidebarRef={sidebarRef}
                    panelRef={panelRef}
                    showPanel={showPanel}
                    setShowPanel={setShowPanel}
                    panelType={panelType}
                    setPanelType={setPanelType}
                    uploads={uploads}
                    setUploads={setUploads}
                    addText={addText}
                    addImage={addImage}
                    handleFiles={handleFiles}
                    // new design code changes
                    variables={variables}           // ⬅️ NEW
                    // changes for adding placeholder
                    // variableMap={VARIABLE_MAP}
                    insertVariableIntoSelected={insertVariableIntoSelected}
                    versionId={versionId}     // ⭐ REQUIRED
                    token={token}   // ⭐ REQUIRED
                    addVariableObject={addVariableObject}   // ⬅️ NEW PROP
                />

                {/* Canvas */}
                <CanvasPage
                    canvasSize={canvasSize}
                    elements={elements}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    paperRef={paperRef}
                    onPaperMouseDown={onPaperMouseDown}
                    applyLive={applyLive}
                    commitElementChange={commitElementChange}
                    editingRefs={editingRefs}
                    finishTextEdit={finishTextEdit}
                    onTextKeyDown={onTextKeyDown}
                     addVariableObject={addVariableObject}   // ⬅️ NEW
                />
            </div>

            {/* MINI TOOLBAR */}
            <MiniToolbar
                selectedId={selectedId}
                elements={elements}
                miniToolbarRef={miniToolbarRef}
                duplicate={duplicate}
                remove={remove}
                rotate={rotate}
                setTextProp={setTextProp}
                commitElementChange={commitElementChange}
                toggleFit={toggleFit}
                fitToContainer={fitToContainer}
                cropImage={cropImage}
            />

            {/* Discard confirm modal */}
            <DiscardConfirmModal
                show={showDiscardConfirm}
                onConfirmDiscard={confirmDiscard}
                onCancel={() => setShowDiscardConfirm(false)}
            />
        </div>
    );
}



// code before editig but still placeholder only
// // CertificateCanvas.jsx
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Rnd } from "react-rnd";
// import { ImageUp, Type } from "lucide-react";
// import { previewHtml } from "./previewHtml";
// import "./CanvaStyles.css"
// import DiscardConfirmModal from "./DiscardConfirmModal";
// import MiniToolbar from "./MiniToolbar";
// import CanvasPage from "./CanvasPage";
// import CanvasSidebar from "./CanvasSidebar";
// import CanvasTopbar from "./CanvasTopbar";
// /*
//   CertificateCanvas - fixes:
//    - apply font family from dropdown to live text & preview (loads Google Fonts into preview)
//    - mini-toolbar single-row, colored, pushed up (not overlapping canvas)
//    - make inputs readable inside toolbar (white text issue fixed)
//    - added text color picker in mini-toolbar
//    - images: remove extraneous white wrapper and allow resizing from all sides; default fill with cover to avoid white gaps
//    - Align now sets textAlign on text elements
//    - preview uses exact A4 dimensions (mm -> px conversion) and displays certificate name + dimensions
//    - topbar z-index increased to avoid elements appearing on top while scrolling
// */

// const uid = () => Math.random().toString(36).slice(2, 9);

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }


// export default function CertificateCanvas() {
//     // changes for adding placeholder
//     const VARIABLE_MAP = {
//     student: {
//         name: "student.name",
//         id: "student.id",
//         department: "student.department",
//     },
//     course: {
//         title: "course.title",
//         duration: "course.duration",
//     }
// };


//     const navigate = useNavigate();

//     // incoming navigation state
//     const query = useQuery();

//     const orientation =
//         (query.get("orientation") || "portrait").toLowerCase() === "landscape"
//             ? "landscape"
//             : "portrait";

//     const certificateName = query.get("certificateName") || "Untitled Certificate";
//     const domain = query.get("domain") || "";
//     const createdDate = query.get("createdDate") || "";
//     const validityDate = query.get("validityDate") || "";

//     // A4 dimensions (mm) -- keep mm as canonical, convert later for preview px
//     // A4 at 96 DPI (px)
//     const A4 = { w: 794, h: 1123 };

//     const canvasSize = orientation === "portrait"
//         ? { width: A4.w, height: A4.h }
//         : { width: A4.h, height: A4.w };


//     // State
//     const [elements, setElements] = useState([]); // element list
//     const [selectedId, setSelectedId] = useState(null);
//     const [uploads, setUploads] = useState([]); // uploaded images (base64 src stored)
//     const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
//     const [lastSavedSnapshot, setLastSavedSnapshot] = useState(null);

//     // history stacks
//     const [history, setHistory] = useState([]);
//     const [future, setFuture] = useState([]);

//     // panel state
//     const [showPanel, setShowPanel] = useState(false);
//     const [panelType, setPanelType] = useState(null); // 'text' | 'uploads'
//     const sidebarRef = useRef(null);
//     const panelRef = useRef(null);

//     // refs
//     const paperRef = useRef(null);
//     const miniToolbarRef = useRef(null);
//     const editingRefs = useRef({});

//     // changes for adding placeholder
//     function insertVariableIntoSelected(variable) {
//     const el = elements.find(e => e.id === selectedId);
//     if (!el || el.type !== "text") return;

//     const placeholder = `{{${variable}}}`;

//     const next = elements.map(e =>
//         e.id === selectedId
//             ? {
//                 ...e,
//                 props: {
//                     ...e.props,
//                     text: e.props.text + " " + placeholder
//                 }
//               }
//             : e
//     );

//     pushSnapshot(next);
// }


//     // push snapshot to history
//     const pushSnapshot = useCallback((newElements) => {
//         setHistory(h => {
//             const next = [...h, JSON.parse(JSON.stringify(newElements))];
//             if (next.length > 80) next.shift();
//             return next;
//         });
//         setFuture([]);
//         setElements(newElements);
//     }, []);

//     // Add text
//     function addText() {
//         const id = uid();
//         const el = {
//             id,
//             type: "text",
//             x: 40,
//             y: 40,
//             width: 220,
//             height: 60,
//             rotation: 0,
//             props: {
//                 text: "Double-click to edit",
//                 fontSize: 20,
//                 fontWeight: 400,
//                 italic: false,
//                 align: "left",
//                 uppercase: false,
//                 color: "#0f172a",
//                 fontFamily: "Inter"
//             }
//         };
//         const next = [...elements, el];
//         pushSnapshot(next);
//         setSelectedId(id);
//         setShowPanel(false);
//         setPanelType(null);
//     }

//     // Add image
//     function addImage(upload) {
//         const src = upload.src; // keep compatibility with your existing uploader

//         const img = new Image();
//         img.onload = () => {
//             const naturalW = img.naturalWidth;
//             const naturalH = img.naturalHeight;

//             // canvas wrapper
//             const wrapper = document.querySelector(".paper-inner");
//             const rect = wrapper.getBoundingClientRect();

//             const maxW = rect.width * 0.9;
//             const maxH = rect.height * 0.9;

//             let w = naturalW;
//             let h = naturalH;

//             // scale to fit canvas but never crop
//             const scale = Math.min(maxW / w, maxH / h, 1);
//             w *= scale;
//             h *= scale;

//             const el = {
//                 id: uid(),
//                 type: "image",
//                 x: rect.width / 2 - w / 2,
//                 y: rect.height / 2 - h / 2,
//                 width: w,
//                 height: h,
//                 rotation: 0,
//                 props: {
//                     src: upload.src,
//                     name: upload.name,
//                     flipH: false,
//                     flipV: false,
//                     fit: "contain" // 🚀 no cropping
//                 }
//             };

//             pushSnapshot([...elements, el]);
//             setSelectedId(el.id);
//         };

//         img.src = src;
//     }


//     // Handle files -> base64
//     function handleFiles(e) {
//         const files = Array.from(e.target.files || []);
//         if (files.length === 0) return;
//         const reads = files.map(f => new Promise((res) => {
//             const fr = new FileReader();
//             fr.onload = () => res({ id: uid(), name: f.name, src: fr.result });
//             fr.readAsDataURL(f);
//         }));
//         Promise.all(reads).then(arr => {
//             setUploads(u => [...arr, ...u]);
//             setShowPanel(true);
//             setPanelType("uploads");
//         });
//         e.target.value = "";
//     }

//     // Live updates (drag/resize)
//     function applyLive(id, patch) {
//         setElements(prev => prev.map(el => el.id === id ? { ...el, ...patch, props: { ...el.props, ...(patch.props || {}) } } : el));
//     }

//     // Commit element change to history
//     function commitElementChange(id, patch) {
//         setElements(prev => {
//             const newEls = prev.map(el => el.id === id ? { ...el, ...patch, props: { ...el.props, ...(patch.props || {}) } } : el);
//             pushSnapshot(newEls);
//             return newEls;
//         });
//     }


//     function toggleFit(id) {
//         const el = elements.find(e => e.id === id);
//         if (!el || el.type !== "image") return;

//         const wrapper = document.querySelector(".paper-inner");
//         if (!wrapper) return;

//         const rect = wrapper.getBoundingClientRect();
//         const canvasW = rect.width;
//         const canvasH = rect.height;

//         const img = new Image();
//         img.onload = () => {
//             const naturalW = img.naturalWidth;
//             const naturalH = img.naturalHeight;

//             const fitMode = el.props.fit === "contain" ? "cover" : "contain";

//             let newW, newH;

//             if (fitMode === "contain") {
//                 // Fit fully inside canvas
//                 const scale = Math.min(canvasW / naturalW, canvasH / naturalH);
//                 newW = naturalW * scale;
//                 newH = naturalH * scale;
//             } else {
//                 // Fill entire canvas (some parts may crop)
//                 const scale = Math.max(canvasW / naturalW, canvasH / naturalH);
//                 newW = naturalW * scale;
//                 newH = naturalH * scale;
//             }

//             commitElementChange(id, {
//                 width: newW,
//                 height: newH,
//                 x: canvasW / 2 - newW / 2,
//                 y: canvasH / 2 - newH / 2,
//                 props: { ...el.props, fit: fitMode }
//             });
//         };
//         img.src = el.props.src;
//     }

//     function cropImage(id) {
//         const el = elements.find(e => e.id === id);
//         if (!el || el.type !== "image") return;

//         const img = new Image();
//         img.onload = () => {
//             const cropX = 20;   // You can later make UI for this
//             const cropY = 20;
//             const cropW = img.naturalWidth - 40;
//             const cropH = img.naturalHeight - 40;

//             const canvas = document.createElement("canvas");
//             canvas.width = cropW;
//             canvas.height = cropH;

//             const ctx = canvas.getContext("2d");
//             ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

//             const croppedSrc = canvas.toDataURL();

//             commitElementChange(id, {
//                 width: el.width,
//                 height: el.height,
//                 props: {
//                     ...el.props,
//                     src: croppedSrc
//                 }
//             });
//         };
//         img.src = el.props.src;
//     }



//     // fit to container
//     // Robust fitToContainer that accounts for CSS transform scale
//     function fitToContainer(id) {
//         const el = elements.find(e => e.id === id);
//         if (!el || el.type !== "image") return;

//         // Get px-size of canvas
//         const wrapper = document.querySelector(".paper-inner");
//         if (!wrapper) return;

//         const rect = wrapper.getBoundingClientRect();
//         const pxWidth = rect.width;
//         const pxHeight = rect.height;
//         commitElementChange(id, {
//             x: 0,
//             y: 0,
//             width: pxWidth,
//             height: pxHeight,
//             props: { ...el.props, fit: "contain" } // <- use contain to avoid cropping
//         });


//         // commitElementChange(id, {
//         //     x: 0,
//         //     y: 0,
//         //     width: pxWidth,
//         //     height: pxHeight,
//         //     props: {
//         //         ...el.props,
//         //         fit: "cover",
//         //         flipH: false,
//         //         flipV: false,
//         //     }
//         // });
//     }




//     // Duplicate
//     function duplicate(id) {
//         const el = elements.find(e => e.id === id);
//         if (!el) return;
//         const copy = JSON.parse(JSON.stringify(el));
//         copy.id = uid();
//         copy.x += 18;
//         copy.y += 18;
//         const next = [...elements, copy];
//         pushSnapshot(next);
//         setSelectedId(copy.id);
//     }

//     // Delete
//     function remove(id) {
//         const next = elements.filter(e => e.id !== id);
//         pushSnapshot(next);
//         setSelectedId(null);
//     }

//     // Rotate
//     function rotate(id, delta) {
//         const el = elements.find(e => e.id === id);
//         if (!el) return;
//         const updated = { ...el, rotation: (el.rotation + delta + 360) % 360 };
//         commitElementChange(id, updated);
//     }

//     // Text property change
//     function setTextProp(id, key, value) {
//         const el = elements.find(e => e.id === id);
//         if (!el) return;
//         const next = elements.map(e => e.id === id ? { ...e, props: { ...e.props, [key]: value } } : e);
//         pushSnapshot(next);
//     }

//     // Finish text edit
//     function finishTextEdit(id, content) {
//         const el = elements.find(e => e.id === id);
//         if (!el) return;
//         const next = elements.map(e => e.id === id ? { ...e, props: { ...el.props, text: content } } : e);
//         pushSnapshot(next);
//     }

//     // Undo/Redo
//     function undo() {
//         setHistory(h => {
//             if (h.length === 0) return h;
//             setFuture(f => [JSON.parse(JSON.stringify(elements)), ...f]);
//             const prev = h[h.length - 1];
//             setElements(prev);
//             return h.slice(0, -1);
//         });
//         setSelectedId(null);
//     }
//     function redo() {
//         setFuture(f => {
//             if (f.length === 0) return f;
//             setHistory(h => [...h, JSON.parse(JSON.stringify(elements))]);
//             const [next, ...rest] = f;
//             setElements(next);
//             return rest;
//         });
//         setSelectedId(null);
//     }

//     // Preview -> open new tab with exact px sizing (mm -> px)
//     // function preview() {
//     //     const html = previewHtml(elements, canvasSize, certificateName);
//     //     const w = window.open("", "_blank");
//     //     if (!w) return alert("Popup blocked — allow popups for preview.");
//     //     w.document.open();
//     //     w.document.write(html);
//     //     w.document.close();
//     // }
//     // change for adding placeholders
//     function preview() {
//   // Build a simple sample mapping from VARIABLE_MAP for preview purposes.
//   // You can replace these values with real data fetched from backend before generating PDFs.
//   const sampleVars = {};
//   Object.values(VARIABLE_MAP).forEach(group => {
//     Object.values(group).forEach(path => {
//       // create a readable sample: last segment of path (e.g. student.name -> Name Sample)
//       const last = path.split(".").pop();
//       const pretty = last.replace(/[_\-]/g, " ");
//       sampleVars[path] = pretty.charAt(0).toUpperCase() + pretty.slice(1) + " (sample)";
//     });
//   });

//   const html = previewHtml(elements, canvasSize, certificateName, sampleVars);
//   const w = window.open("", "_blank");
//   if (!w) return alert("Popup blocked — allow popups for preview.");
//   w.document.open();
//   w.document.write(html);
//   w.document.close();
// }


//     // Save (simulate)
//     function save() {
//         setLastSavedSnapshot(JSON.stringify(elements));
//         alert("Saved (simulation). Implement API call for persistence.");
//     }

//     // Back with prompt if dirty
//     function back() {
//         const dirty = JSON.stringify(elements) !== lastSavedSnapshot;
//         if (!dirty) {
//             navigate("/certificate-manager");
//             return;
//         }
//         setShowDiscardConfirm(true);
//     }
//     function confirmDiscard(doSave) {
//         if (doSave) save();
//         setShowDiscardConfirm(false);
//         navigate("/certificate-manager");
//     }

//     // Click outside canvas clears selection
//     function onPaperMouseDown(e) {
//         if (e.target === paperRef.current || e.target.closest(".paper-inner")) {
//             if (!e.target.closest(".element")) setSelectedId(null);
//         }
//     }

//     // Commit text blur on Enter
//     function onTextKeyDown(e, id) {
//         if (e.key === "Enter") {
//             e.preventDefault();
//             const content = e.target.innerText;
//             finishTextEdit(id, content);
//             e.target.blur();
//         }
//     }

//     // init history
//     useEffect(() => {
//         setHistory([]);
//         setFuture([]);
//     }, []);

//     // close panel when clicking outside it
//     useEffect(() => {
//         function onDocClick(e) {
//             if (!e.target.closest(".sidebar") && !e.target.closest(".sidebar-panel")) {
//                 setShowPanel(false);
//                 setPanelType(null);
//             }
//         }
//         document.addEventListener("mousedown", onDocClick);
//         return () => document.removeEventListener("mousedown", onDocClick);
//     }, []);

//     // --- Render ---
//     return (
//         <div className=" CanvasStyles cert-root">
//             {/* Topbar */}
//             <CanvasTopbar
//                 back={back}
//                 undo={undo}
//                 redo={redo}
//                 save={save}
//                 preview={preview}
//                 orientation={orientation}
//                 certificateName={certificateName}
//                 A4={A4}
//             />


//             {/* Main content */}
//             <div className="main">
//                 {/* Sidebar */}

//                 <CanvasSidebar
//                     sidebarRef={sidebarRef}
//                     panelRef={panelRef}
//                     showPanel={showPanel}
//                     setShowPanel={setShowPanel}
//                     panelType={panelType}
//                     setPanelType={setPanelType}
//                     uploads={uploads}
//                     setUploads={setUploads}
//                     addText={addText}
//                     addImage={addImage}
//                     handleFiles={handleFiles}
//                     // changes for adding placeholder
//                     variableMap={VARIABLE_MAP}
//     insertVariableIntoSelected={insertVariableIntoSelected}
//                 />


//                 {/* Canvas */}
//                 <CanvasPage
//                     canvasSize={canvasSize}
//                     elements={elements}
//                     selectedId={selectedId}
//                     setSelectedId={setSelectedId}
//                     paperRef={paperRef}
//                     onPaperMouseDown={onPaperMouseDown}
//                     applyLive={applyLive}
//                     commitElementChange={commitElementChange}
//                     editingRefs={editingRefs}
//                     finishTextEdit={finishTextEdit}
//                     onTextKeyDown={onTextKeyDown}
//                 />

//             </div>

//             {/* MINI TOOLBAR */}
//             <MiniToolbar
//                 selectedId={selectedId}
//                 elements={elements}
//                 miniToolbarRef={miniToolbarRef}
//                 duplicate={duplicate}
//                 remove={remove}
//                 rotate={rotate}
//                 setTextProp={setTextProp}
//                 commitElementChange={commitElementChange}
//                 toggleFit={toggleFit}
//                 fitToContainer={fitToContainer}
//                 cropImage={cropImage}
//             />


//             {/* Discard confirm modal */}
//             <DiscardConfirmModal
//                 show={showDiscardConfirm}
//                 onConfirmDiscard={confirmDiscard}
//                 onCancel={() => setShowDiscardConfirm(false)} />

//             {/* Styles */}

//         </div>
//     );
// }