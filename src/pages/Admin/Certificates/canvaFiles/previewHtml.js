/* PREVIEW HTML builder
   - uses the canvasSize object (width/height in mm & numeric mm) to compute px sizes for accurate display
   - injects Google Fonts for fonts present in elements
   - shows certificate name and dimensions above the page
*/

import { useLocation } from "react-router-dom";

// Google Fonts mapping used only for preview HTML
const FONT_GOOGLE_MAP = {
    "Inter": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap",
    "Roboto": "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
    "Poppins": "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap",
    "Montserrat": "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap",
    "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
    // Georgia: system serif - no Google import
};
// helper to convert mm to pixels for preview container sizing (1in = 25.4 mm, 1in ~ 96px)
function mmToPx(mm) {
    return Math.round((Number(mm) * 96) / 25.4);
}

export function previewHtml(elements, canvasSize, certificateName,variableValues = {}) {
  // Fonts used by elements
  const fonts = Array.from(
    new Set(
      elements
        .filter((e) => e.type === "text")
        .map((t) => t.props.fontFamily || "Inter")
    )
  );
  const links = fonts
    .map((f) => FONT_GOOGLE_MAP[f])
    .filter(Boolean)
    .map((href) => `<link href="${href}" rel="stylesheet">`)
    .join("\n");

  // px sizes of canvas
  const wPx = canvasSize.wMm ? mmToPx(canvasSize.wMm) : 794; // fallback to A4 portrait px
  const hPx = canvasSize.hMm ? mmToPx(canvasSize.hMm) : 1123;

  // build element HTML
  const bodyElems = elements.map(el => {
    // TEXT
    if (el.type === "text") {
        const s = el.props;

        const fontFamily = (s.fontFamily || "Inter").replace(/"/g, '\\"');
        const align = s.align || "left";
        const italic = s.italic ? "italic" : "normal";
        const transform = s.uppercase ? "uppercase" : "none";

        const style = `
            position:absolute;
            left:${el.x}px;
            top:${el.y}px;
            width:${el.width}px;
            height:${el.height}px;
            transform: rotate(${el.rotation}deg);
            font-size:${s.fontSize}px;
            font-weight:${s.fontWeight};
            font-style:${italic};
            color:${s.color};
            text-transform:${transform};
            font-family:"${fontFamily}";
            display:flex;
            align-items:center;
            justify-content:${
                align === "center" ? "center" :
                align === "right" ? "flex-end" :
                "flex-start"
            };
            padding:6px;
            box-sizing:border-box;
        `;

        // placeholder resolver
        function resolvePlaceholders(text) {
            if (!text) return "";
            return text.replace(/{{\s*([^}]+)\s*}}/g, (m, name) => {
                const val = variableValues[name];
                if (val != null) {
                    return String(val)
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;");
                }
                return `{{${name}}}`;
            });
        }

        const raw = s.uppercase ? s.text.toUpperCase() : s.text;
        const replaced = resolvePlaceholders(raw).replace(/</g, "&lt;");

        return `<div style="${style}">${replaced}</div>`;
    }

    // IMAGE
    if (el.type === "image") {
        const style = `
            position:absolute;
            left:${el.x}px;
            top:${el.y}px;
            width:${el.width}px;
            height:${el.height}px;
            transform: rotate(${el.rotation}deg);
            overflow:hidden;
        `;

        return `
            <div style="${style}">
                <img src="${el.props.src}"
                     style="width:100%; height:100%; object-fit:${
                        el.props.fit === "contain" ? "contain" : "cover"
                     };
                     transform:${el.props.flipH ? "scaleX(-1)" : ""} ${
                        el.props.flipV ? "scaleY(-1)" : ""
                     };" />
            </div>
        `;
    }

    return "";
}).join("\n");


  // header with correct dimensions
  const header = `<div style="width:100%; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-family: Inter, Roboto, Arial, sans-serif;">
        <div style="font-weight:700;">${certificateName}</div>
        <div style="color:#64748b;">(${wPx}px × ${hPx}px)</div>
    </div>`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>${certificateName}</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
${links}
<style>
    html,body { height:100%; margin:0; font-family: Inter, Roboto, Arial, sans-serif; background:#f3f5f9; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; padding:30px; box-sizing:border-box; }
    .container { width: ${wPx}px; max-width: calc(100% - 60px); }
    .frame { width:${wPx}px; height:${hPx}px; background:#fff; position:relative; box-shadow:0 10px 30px rgba(0,0,0,0.12); border-radius:6px; overflow:hidden; }
    .actions { margin-top:18px; display:flex; gap:12px; align-items:center; justify-content:center; }
    .btn { padding:10px 14px; border-radius:8px; cursor:pointer; border:none; font-weight:600; }
    .btn.primary { background:#6366f1; color:white; }
    .btn.ghost { background:transparent; border:1px solid #cbd5e1; color:#475569; }
</style>
</head>
<body>
    <div class="container">
        ${header}
        <div class="frame">
            ${bodyElems}
        </div>

        <div class="actions">
            <button class="btn primary" onclick="alert('Submit placeholder')">Submit</button>
            <button class="btn ghost" onclick="window.close()">Go back</button>
        </div>
    </div>
</body>
</html>`;
}
