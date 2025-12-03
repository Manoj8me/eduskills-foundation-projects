import React from "react";
import { Rnd } from "react-rnd";

    // change for adding placeholers
// CanvasPage.jsx (add at top, after imports)
function highlightPlaceholders(text) {
  if (!text) return "";
  // replace {{var}} with span wrappers (escape HTML first)
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/{{\s*([^}]+)\s*}}/g, (m, name) => {
    return `<span class="ph">{{${name}}}</span>`;
  });
}

export default function CanvasPage({
    canvasSize,
    elements,
    selectedId,
    setSelectedId,
    paperRef,
    onPaperMouseDown,
    applyLive,
    commitElementChange,
    editingRefs,
    finishTextEdit,
    onTextKeyDown,
})

{
    return (
        <main className="canvas-area flex justify-center w-full">
            <div className="canvas-stage flex justify-center w-full">
                <div
                    className="canvas-paper"
                    onMouseDown={onPaperMouseDown}
                    ref={paperRef}
                >
                    <div
                        className="paper-inner"
                        style={{
                            width: canvasSize.width,
                            height: canvasSize.height
                        }}
                    >
                        {elements.map(el => {
                            const isSelected = selectedId === el.id;

                            const commonProps = {
                                key: el.id,
                                className: "element",
                                onMouseDown: ev => {
                                    ev.stopPropagation();
                                    setSelectedId(el.id);
                                },
                            };

                            const enableResizing = isSelected
                                ? {
                                    top: true,
                                    right: true,
                                    bottom: true,
                                    left: true,
                                    topRight: true,
                                    bottomRight: true,
                                    bottomLeft: true,
                                    topLeft: true,
                                }
                                : false;

                            // ----------------------
                            // TEXT ELEMENT
                            // ----------------------
                            if (el.type === "text") {
                                return (
                                    <Rnd
                                        {...commonProps}
                                        size={{ width: el.width, height: el.height }}
                                        position={{ x: el.x, y: el.y }}
                                        bounds="parent"
                                        enableResizing={enableResizing}
                                        onDrag={(e, d) =>
                                            applyLive(el.id, { x: d.x, y: d.y })
                                        }
                                        onDragStop={(e, d) =>
                                            commitElementChange(el.id, {
                                                x: d.x,
                                                y: d.y,
                                            })
                                        }
                                        onResize={(e, dir, ref, delta, pos) =>
                                            applyLive(el.id, {
                                                width: parseInt(ref.style.width),
                                                height: parseInt(ref.style.height),
                                                x: pos.x,
                                                y: pos.y,
                                            })
                                        }
                                        onResizeStop={(e, dir, ref, delta, pos) =>
                                            commitElementChange(el.id, {
                                                width: parseInt(ref.style.width),
                                                height: parseInt(ref.style.height),
                                                x: pos.x,
                                                y: pos.y,
                                            })
                                        }
                                        style={{
                                            zIndex: isSelected ? 50 : 20,
                                            border: isSelected
                                                ? "1px dashed #60a5fa"
                                                : "none",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                transform: `rotate(${el.rotation}deg)`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent:
                                                    el.props.align === "center"
                                                        ? "center"
                                                        : el.props.align === "right"
                                                            ? "flex-end"
                                                            : "flex-start",
                                                padding: 6,
                                            }}
                                        >
                                            {/* change for adding placeholders */}
                                            <div
  ref={r => (editingRefs.current[el.id] = r)}
  contentEditable
  suppressContentEditableWarning
  onDoubleClick={() => {
    const r = editingRefs.current[el.id];
    if (r) {
      r.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(r);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }}
  onBlur={e => finishTextEdit(el.id, e.target.innerText)}
  onKeyDown={e => onTextKeyDown(e, el.id)}
  // NOTE: we set innerHTML to highlighted HTML so placeholders are visually distinct.
  dangerouslySetInnerHTML={{ __html: highlightPlaceholders(el.props.text) }}
  style={{
    outline: "none",
    background: "transparent",
    fontSize: `${el.props.fontSize}px`,
    fontWeight: el.props.fontWeight,
    fontStyle: el.props.italic ? "italic" : "normal",
    color: el.props.color,
    textTransform: el.props.uppercase ? "uppercase" : "none",
    width: "100%",
    minHeight: 24,
    cursor: "text",
    fontFamily: el.props.fontFamily || "Inter",
    textAlign: el.props.align || "left",
    // ensure that highlighted spans wrap and behave like text
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    boxSizing: "border-box",
  }}
/>

                                            {/* <div
                                                ref={r =>
                                                    (editingRefs.current[el.id] = r)
                                                }
                                                contentEditable
                                                suppressContentEditableWarning
                                                onBlur={e =>
                                                    finishTextEdit(
                                                        el.id,
                                                        e.target.innerText
                                                    )
                                                }
                                                onKeyDown={e =>
                                                    onTextKeyDown(e, el.id)
                                                }
                                                style={{
                                                    outline: "none",
                                                    background: "transparent",
                                                    fontSize: `${el.props.fontSize}px`,
                                                    fontWeight: el.props.fontWeight,
                                                    fontStyle: el.props.italic
                                                        ? "italic"
                                                        : "normal",
                                                    color: el.props.color,
                                                    textTransform: el.props.uppercase
                                                        ? "uppercase"
                                                        : "none",
                                                    width: "100%",
                                                    minHeight: 24,
                                                    cursor: "text",
                                                    fontFamily:
                                                        el.props.fontFamily || "Inter",
                                                    textAlign:
                                                        el.props.align || "left",
                                                }}
                                            >
                                                {el.props.text}
                                            </div> */}
                                        </div>
                                    </Rnd>
                                );
                            }

                            // ----------------------
                            // IMAGE ELEMENT
                            // ----------------------
                            if (el.type === "image") {
                                return (
                                    <Rnd
                                        {...commonProps}
                                        size={{
                                            width: el.width,
                                            height: el.height,
                                        }}
                                        position={{ x: el.x, y: el.y }}
                                        bounds="parent"
                                        enableResizing={enableResizing}
                                        onDrag={(e, d) =>
                                            applyLive(el.id, { x: d.x, y: d.y })
                                        }
                                        onDragStop={(e, d) =>
                                            commitElementChange(el.id, {
                                                x: d.x,
                                                y: d.y,
                                            })
                                        }
                                        onResize={(e, dir, ref, delta, pos) =>
                                            applyLive(el.id, {
                                                width: parseInt(ref.style.width),
                                                height: parseInt(ref.style.height),
                                                x: pos.x,
                                                y: pos.y,
                                            })
                                        }
                                        onResizeStop={(e, dir, ref, delta, pos) =>
                                            commitElementChange(el.id, {
                                                width: parseInt(ref.style.width),
                                                height: parseInt(ref.style.height),
                                                x: pos.x,
                                                y: pos.y,
                                            })
                                        }
                                        style={{
                                            zIndex: isSelected ? 50 : 20,
                                            border: isSelected
                                                ? "1px dashed #60a5fa"
                                                : "none",
                                            background: "transparent",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                transform: `rotate(${el.rotation}deg)
                                                    ${el.props.flipH
                                                        ? "scaleX(-1)"
                                                        : ""
                                                    }
                                                    ${el.props.flipV
                                                        ? "scaleY(-1)"
                                                        : ""
                                                    }`,
                                            }}
                                        >
                                            <img
                                                src={el.props.src}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit:
                                                        el.props.fit === "contain"
                                                            ? "contain"
                                                            : "cover",
                                                    pointerEvents: "none",
                                                    display: "block",
                                                }}
                                            />
                                        </div>
                                    </Rnd>
                                );
                            }

                            return null;
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}
