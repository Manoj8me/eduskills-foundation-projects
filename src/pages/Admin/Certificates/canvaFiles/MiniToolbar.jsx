import React from "react";

export default function MiniToolbar({
    selectedId,
    elements,
    miniToolbarRef,
    duplicate,
    remove,
    rotate,
    setTextProp,
    commitElementChange,
    toggleFit,
    fitToContainer,
    cropImage
}) {

    if (!selectedId) return null;

    const sel = elements.find(e => e.id === selectedId);
    if (!sel) return null;

    return (
        <div
            className="mini-toolbar"
            ref={miniToolbarRef}
            style={{ top: 70, textAlign: "center" }}
        >
            <div className="mini-row">
                <button className="mt-btn" onClick={() => duplicate(selectedId)}>
                    Duplicate
                </button>

                <button className="mt-btn danger" onClick={() => remove(selectedId)}>
                    Delete
                </button>

                <button className="mt-btn" onClick={() => rotate(selectedId, -15)}>⟲</button>
                <button className="mt-btn" onClick={() => rotate(selectedId, 15)}>⟳</button>

                {/* TEXT CONTROLS */}
                {sel.type === "text" && (
                    <>
                        <label className="lbl">Font</label>
                        <select
                            className="font-select"
                            value={sel.props.fontFamily}
                            onChange={(e) =>
                                setTextProp(selectedId, "fontFamily", e.target.value)
                            }
                        >
                            <option value="Inter">Inter</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Playfair Display">Playfair Display</option>
                            <option value="Georgia">Georgia</option>
                        </select>

                        <label className="lbl">Size</label>
                        <input
                            type="number"
                            min="8"
                            max="120"
                            value={sel.props.fontSize}
                            onChange={(e) =>
                                setTextProp(selectedId, "fontSize", Number(e.target.value))
                            }
                            className="size-input"
                        />

                        <button
                            className="mt-btn"
                            onClick={() =>
                                setTextProp(
                                    selectedId,
                                    "fontWeight",
                                    sel.props.fontWeight === 700 ? 400 : 700
                                )
                            }
                        >
                            {sel.props.fontWeight === 700 ? "Unbold" : "Bold"}
                        </button>

                        <button
                            className="mt-btn"
                            onClick={() =>
                                setTextProp(selectedId, "italic", !sel.props.italic)
                            }
                        >
                            {sel.props.italic ? "Italic ✓" : "Italic"}
                        </button>

                        <button
                            className="mt-btn"
                            onClick={() => {
                                const next =
                                    sel.props.align === "left"
                                        ? "center"
                                        : sel.props.align === "center"
                                            ? "right"
                                            : "left";

                                setTextProp(selectedId, "align", next);
                            }}
                        >
                            Align
                        </button>

                        <button
                            className="mt-btn"
                            onClick={() =>
                                setTextProp(
                                    selectedId,
                                    "uppercase",
                                    !sel.props.uppercase
                                )
                            }
                        >
                            Aa
                        </button>

                        <input
                            type="color"
                            className="color-input"
                            value={sel.props.color}
                            onChange={(e) =>
                                setTextProp(selectedId, "color", e.target.value)
                            }
                        />
                    </>
                )}

                {/* IMAGE CONTROLS */}
                {sel.type === "image" && (
                    <>
                        <button
                            className="mt-btn"
                            onClick={() =>
                                commitElementChange(selectedId, {
                                    props: {
                                        ...sel.props,
                                        flipH: !sel.props.flipH
                                    }
                                })
                            }
                        >
                            Flip H
                        </button>

                        <button
                            className="mt-btn"
                            onClick={() =>
                                commitElementChange(selectedId, {
                                    props: {
                                        ...sel.props,
                                        flipV: !sel.props.flipV
                                    }
                                })
                            }
                        >
                            Flip V
                        </button>

                        <button
                            className="mt-btn"
                            onClick={() => toggleFit(selectedId)}
                        >
                            Fit
                        </button>

                        <button
                            className="mt-btn"
                            onClick={() => fitToContainer(selectedId)}
                        >
                            Fit to Container
                        </button>

                        <button
                            className="mt-btn"
                            onClick={() => cropImage(selectedId)}
                        >
                            Crop
                        </button>
                        {/* changes for adding placeholder */}
                        <button
    className="mt-btn"
    onClick={() => alert("Use sidebar to insert variables")}
>
    Variables
</button>

                    </>
                )}
            </div>
        </div>
    );
}
