/* -----------------------------
File: Breadcrumbs.jsx
------------------------------*/
import React from 'react';

export default function Breadcrumbs({ ctx }) {
  const { stack, goToLevel } = ctx;
  return (
    <div className="flex items-center gap-2 mb-4 text-sm">
      {stack.map((lvl, idx) => (
        <span key={lvl.id} className="flex items-center gap-2">
          <button onClick={() => goToLevel(idx)} className="text-blue-600 hover:underline">{lvl.name}</button>
          {idx < stack.length - 1 && <span>/</span>}
        </span>
      ))}
    </div>
  );
}