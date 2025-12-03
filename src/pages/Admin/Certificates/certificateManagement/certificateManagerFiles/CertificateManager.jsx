/* -----------------------------
File: CertificateManager.jsx (root container)
------------------------------*/
import React from 'react';
import useCategoryManager from './useCategoryManager';
import { actionsFor, isTemplateObject } from './helpers';

import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import CategoryTable from './CategoryTable';
import DropdownPortal from './DropdownPortal';
import ModalsContainer from './ModalsContainer';

export default function CertificateManager({ initialNodes = [] }) {
    const ctx = useCategoryManager(initialNodes);

    return (
        <div className="max-w-6xl mx-auto p-4">
            <Header ctx={ctx} />
            <Breadcrumbs ctx={ctx} />
            <CategoryTable ctx={ctx} />

            {ctx.dropdown && (
                <DropdownPortal dropdown={ctx.dropdown} onClose={ctx.closeDropdown} onAction={(label, nodeOrTemplate) => {
                    // reuse original behaviour
                    ctx.closeDropdown();
                    const node = nodeOrTemplate;
                    if (isTemplateObject(node)) {
                        if (label === 'View Template') { ctx.goToCanvas(node, 'preview'); return; }
                        if (label === 'Edit Template') { ctx.goToCanvas(node, 'edit'); return; }
                        if (label === 'Edit Template Details') {
                            const parentNodeId = node._nodeId || ctx.viewingNodeId;
                            const domainName = node._domain || node.domain || null;
                            ctx.openEditTemplateDetails(parentNodeId, domainName, node);
                            return;
                        }
                        return;
                    }

                    if (label === 'View Domains' || label === 'View Subcategories') { ctx.openNode(node.id); return; }
                    if (label === 'View Categorywise Template') { ctx.setStack(s => [...s, { id: node.id, name: node.name }]); ctx.setViewingNodeId(node.id); return; }
                    if (label === 'Edit Category Name') { ctx.setActiveEditNode(node.id); return; }
                    if (label === 'Delete Category') {
                        const current = ctx.nodes && ctx.nodes.length ? (function find(nlist, id) {
                            const stack = [...nlist]; while (stack.length) { const n = stack.shift(); if (n.id === id) return n; if (n.children) stack.push(...n.children); } return null;
                        })(ctx.nodes, node.id) : null;
                        if (current && actionsFor(current).includes('Delete Category')) ctx.setActiveDeleteNode(node.id); else alert('Cannot delete: remove templates and/or subcategories first.');
                        return;
                    }
                }} />
            )}

            <ModalsContainer ctx={ctx} />
        </div>
    );
}