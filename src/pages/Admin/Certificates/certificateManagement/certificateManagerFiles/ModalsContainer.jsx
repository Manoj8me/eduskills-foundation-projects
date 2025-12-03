/* -----------------------------
File: ModalsContainer.jsx
------------------------------*/
import React from 'react';
import { findNode } from './helpers';

import { AddCategoryModal } from '../certficateManagementModals/AddCategoryModal';
import { AddSubcategoryModal } from '../certficateManagementModals/AddSubcategoryModal';
import { EditCategoryModal } from '../certficateManagementModals/EditCategoryModal';
import { CreateTemplateModal } from '../certficateManagementModals/CreateTemplateModal';
import { EditTemplateDetailsModal } from '../certficateManagementModals/EditTemplateModal';
import { DeleteConfirmModal } from '../certficateManagementModals/DeleteConfirmModal';

export default function ModalsContainer({ ctx }) {
  const {
    // state + setters
    nodes,
    showAddCategoryModal,
    setShowAddCategoryModal,
    addCategoryParent,
    setAddCategoryParent,

    showAddSubModal,
    setShowAddSubModal,
    subParent,
    setSubParent,

    activeEditNode,
    setActiveEditNode,

    activeDeleteNode,
    setActiveDeleteNode,

    showCreateTemplateModal,
    createTemplateFor,
    setShowCreateTemplateModal,

    editTemplateFor,
    setEditTemplateFor,

    // actions from hook
    addNode,
    saveEditedName,
    deleteNodeConfirmed,
    createTemplateForNode,
    saveEditedTemplate
  } = ctx;

  return (
    <>
      {/* Add Category */}
      {showAddCategoryModal && (
        <AddCategoryModal
          onCancel={() => {
            setShowAddCategoryModal(false);
            setAddCategoryParent(null);
          }}
          onSave={(payload) => {
            // payload: { name, type }
            addNode(addCategoryParent, payload);
            setShowAddCategoryModal(false);
            setAddCategoryParent(null);
          }}
        />
      )}

      {/* Add Subcategory */}
      {showAddSubModal && (
        <AddSubcategoryModal
          onCancel={() => {
            setShowAddSubModal(false);
            setSubParent(null);
          }}
          onSave={(payload) => {
            // payload: { name, type }
            addNode(subParent, payload);
            setShowAddSubModal(false);
            setSubParent(null);
          }}
        />
      )}

      {/* Edit Category Name */}
      {activeEditNode && (
        <EditCategoryModal
          categoryName={findNode(nodes, activeEditNode)?.name || ''}
          onCancel={() => setActiveEditNode(null)}
          onSave={(newName) => {
            // saveEditedName(nodeId, newName)
            saveEditedName(activeEditNode, newName);
            setActiveEditNode(null);
          }}
        />
      )}

      {/* Delete Confirm */}
      {activeDeleteNode && (
        <DeleteConfirmModal
          title="Delete Category"
          message="Are you sure you want to delete this category? (Must be empty of templates and subcategories)"
          onCancel={() => setActiveDeleteNode(null)}
          onConfirm={() => {
            deleteNodeConfirmed();
            setActiveDeleteNode(null);
          }}
        />
      )}

      {/* Create Template */}
      {showCreateTemplateModal && createTemplateFor && (
        <CreateTemplateModal
          onClose={() => {
            setShowCreateTemplateModal(false);
            // keep createTemplateFor cleared in hook if it manages it; ensure consistent cleanup:
            // if hook exposes setter for createTemplateFor, call it; here we rely on setShowCreateTemplateModal and createTemplateFor usage
          }}
          onCreate={(tpl) => {
            // ensure domain default is applied by hook if required (original code handled initialDomain)
            createTemplateForNode(createTemplateFor.nodeId, tpl);
            setShowCreateTemplateModal(false);
          }}
          domains={['Frontend', 'Backend', 'HR', 'Finance', 'Operations']}
          showDomainDropdown={createTemplateFor.showDomainDropdown}
          initialDomain={createTemplateFor.initialDomain}
        />
      )}

      {/* Edit Template Details */}
      {editTemplateFor && (
        <EditTemplateDetailsModal
          template={editTemplateFor.template}
          showDomainField={true}
          onCancel={() => setEditTemplateFor(null)}
          onSave={(updatedTemplate) => {
            saveEditedTemplate(updatedTemplate);
            setEditTemplateFor(null);
          }}
        />
      )}
    </>
  );
}
