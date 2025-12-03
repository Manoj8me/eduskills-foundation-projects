/* -----------------------------
File: Header.jsx
------------------------------*/
import React from 'react';
import { findNode } from './helpers';

export default function Header({ ctx }) {
  const { top, setAddCategoryParent, setShowAddCategoryModal, isDomainPage, topMeta, viewingNodeId, setSubParent, setShowAddSubModal, openCreateTemplate, nodes } = ctx;

  if (top.id === 'root') {
    return (
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{top.name}</h1>
        <button onClick={() => { setAddCategoryParent(null); setShowAddCategoryModal(true); }} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">+ Add Category</button>
      </div>
    );
  }

  const node = findNode(nodes, viewingNodeId);
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">{top.name}</h1>
      {isDomainPage ? (
        <button onClick={() => openCreateTemplate(topMeta.nodeId, false, topMeta.domainName)} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">+ Add Template</button>
      ) : node?.type === 'subcategories' ? (
        <button onClick={() => { setSubParent(viewingNodeId); setShowAddSubModal(true); }} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">+ Add Subcategory</button>
      ) : (
        <button onClick={() => openCreateTemplate(viewingNodeId, node?.type === 'domains')} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">+ Add Template</button>
      )}
    </div>
  );
}