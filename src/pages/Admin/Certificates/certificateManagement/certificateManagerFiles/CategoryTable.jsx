/* -----------------------------
File: CategoryTable.jsx  (FIXED)
------------------------------*/
import React from 'react';
import { findNode } from './helpers';

import CategoryRow from './CategoryRow';
import TemplateRow from './TemplateRow';

export default function CategoryTable({ ctx }) {
  const {
    top,
    isDomainPage,
    currentList,
    nodes,
    viewingNodeId,
    openDropdown,
    topMeta,
  } = ctx;

  /* -----------------------------------------------------
     ACTION GENERATOR BASED ON CATEGORY TYPE + CONTENT
  ------------------------------------------------------*/
  function getCategoryActions(node) {
    let actions = [];

    if (node.type === "domains") {
      actions.push("View Domains");
      actions.push("Edit Category Name");

      const isEmpty =
        !node.domains ||
        Object.values(node.domains).every(arr => arr.length === 0);

      if (isEmpty) actions.push("Delete Category");
    }

    else if (node.type === "subcategories") {
      actions.push("View Sub Categories");
      actions.push("Edit Category Name");

      const isEmpty = !node.children || node.children.length === 0;
      if (isEmpty) actions.push("Delete Category");
    }

    else if (node.type === "choose-template") {
      actions.push("View Categorywise Templates");
      actions.push("Edit Category Name");

      const isEmpty = !node.templates || node.templates.length === 0;
      if (isEmpty) actions.push("Delete Category");
    }

    else {
      actions = ["Edit Category Name", "Delete Category"];
    }

    return actions;
  }

  /* -----------------------------------------------------
     TEMPLATE ACTIONS
  ------------------------------------------------------*/
  const TEMPLATE_ACTIONS = [
    "Edit Template",
    "Delete Template",
    "Open in Canvas",
  ];

  return (
    <div>
      <table className="min-w-full bg-white shadow rounded border">
        <thead className="bg-gray-100">
          <tr>
            {top.id === "root" ? (
              <>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </>
            ) : isDomainPage ? (
              <>
                <th className="py-3 px-6 text-left">Template Name</th>
                <th className="py-3 px-6 text-left">Domain</th>
                <th className="py-3 px-6 text-left">Issue Date</th>
                <th className="py-3 px-6 text-left">End Date</th>
                <th className="py-3 px-6 text-left">Validity</th>
                <th className="py-3 px-6 text-left">Orientation</th>
                <th className="py-3 px-6 text-left">Variables</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </>
            ) : (
              <>
                <th className="py-3 px-6 text-left">Item</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {/* ---------------- ROOT PAGE ---------------- */}
          {top.id === "root" ? (
            currentList.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-6 px-6 text-center">
                  No categories yet
                </td>
              </tr>
            ) : (
              currentList.map((node) => {
                const actions = getCategoryActions(node);
                return (
                  <CategoryRow
                    key={node.id}
                    node={node}
                    onOpenDropdown={(n, el, a) =>
                      openDropdown(node, el, actions)
                    }
                  />
                );
              })
            )
          ) : (
            /* ---------------- NON-ROOT ---------------- */
            (function renderNonRoot() {

              /* ---------- DOMAIN PAGE ---------- */
              if (isDomainPage) {
                const parent = findNode(nodes, topMeta.nodeId);
                const templates =
                  parent?.domains?.[topMeta.domainName] || [];

                if (templates.length === 0)
                  return (
                    <tr>
                      <td colSpan={8} className="py-6 px-6 text-center">
                        No templates
                      </td>
                    </tr>
                  );

                return templates.map((t) => (
                  <TemplateRow
                    key={t.id}
                    template={t}
                    nodeId={topMeta.nodeId}
                    domainName={topMeta.domainName}
                    onOpenDropdown={(template, el) =>
                      openDropdown(template, el, TEMPLATE_ACTIONS)
                    }
                  />
                ));
              }

              const node = findNode(nodes, viewingNodeId);
              if (!node) return null;

              /* ---------- SUBCATEGORIES PAGE ---------- */
              if (node.type === "subcategories") {
                const list = node.children || [];

                if (list.length === 0)
                  return (
                    <tr>
                      <td colSpan={2} className="py-6 px-6 text-center">
                        No items yet
                      </td>
                    </tr>
                  );

                return list.map((child) => {
                  const actions = getCategoryActions(child);
                  return (
                    <CategoryRow
  key={node.id}
  node={node}
  actions={actions}
  onOpenDropdown={openDropdown}
/>

                  );
                });
              }

              /* ---------- DOMAINS TYPE PAGE ---------- */
              if (node.type === "domains") {
                const domainNames = Object.keys(node.domains || {});

                if (domainNames.length === 0)
                  return (
                    <tr>
                      <td colSpan={2} className="py-6 px-6 text-center">
                        No domains yet
                      </td>
                    </tr>
                  );

                return domainNames.map((d) => (
                  <tr key={d} className="hover:bg-gray-50 border-b">
                    <td className="py-3 px-6">
                      {d === "_ungrouped" ? "Ungrouped" : d}
                    </td>
                    <td className="py-3 px-6">
                      <button className="px-2 py-1 rounded bg-blue-600 text-white">
                        View Domainwise Certificates
                      </button>
                    </td>
                  </tr>
                ));
              }

              /* ---------- CHOOSE-TEMPLATE PAGE ---------- */
              if (node.type === "choose-template") {
                const list = node.templates || [];

                if (list.length === 0)
                  return (
                    <tr>
                      <td colSpan={7} className="py-6 px-6 text-center">
                        No Templates Yet
                      </td>
                    </tr>
                  );

                return list.map((t) => (
                  <TemplateRow
  key={t.id}
  template={t}
  nodeId={topMeta.nodeId}
  domainName={topMeta.domainName}
  onOpenDropdown={openDropdown}
/>

                ));
              }

              return null;
            })()
          )}
        </tbody>
      </table>
    </div>
  );
}
