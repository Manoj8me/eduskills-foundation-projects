/* -----------------------------
File: useCategoryManager.js
------------------------------*/
import { useEffect, useState } from "react";
import { deepClone, findNode } from "./helpers";

export default function useCategoryManager(initialNodes = []) {
  const [nodes, setNodes] = useState(initialNodes);
  const [stack, setStack] = useState([{ id: "root", name: "Categories" }]);
  const top = stack[stack.length - 1];

  const [viewingNodeId, setViewingNodeId] = useState(null);
  const [dropdown, setDropdown] = useState(null);

  // Modals / UI state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [addCategoryParent, setAddCategoryParent] = useState(null);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [subParent, setSubParent] = useState(null);

  const [activeEditNode, setActiveEditNode] = useState(null);
  const [activeDeleteNode, setActiveDeleteNode] = useState(null);

  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [createTemplateFor, setCreateTemplateFor] = useState(null);

  const [editTemplateFor, setEditTemplateFor] = useState(null);

  // freeze body scroll while modals open
  useEffect(() => {
    const isOpen =
      showAddCategoryModal ||
      showAddSubModal ||
      activeEditNode ||
      activeDeleteNode ||
      showCreateTemplateModal ||
      editTemplateFor;
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [
    showAddCategoryModal,
    showAddSubModal,
    activeEditNode,
    activeDeleteNode,
    showCreateTemplateModal,
    editTemplateFor,
  ]);

  /* ----------------------------------------
      FIXED: dropdown helpers (no signature change)
  -----------------------------------------*/
  function openDropdown(nodeOrTemplate, el, actions) {
    if (!el || typeof el.getBoundingClientRect !== "function") {
      console.warn("Dropdown element is not valid:", el);
      return;
    }

    const rect = el.getBoundingClientRect();

    setDropdown({
      node: nodeOrTemplate,
      x: rect.left,
      y: rect.bottom + window.scrollY + 6,
      actions,
    });
  }

  function closeDropdown() {
    setDropdown(null);
  }

  // CRUD
  function addNode(parentId, payload) {
    const isTemplateCategory = payload.type === "choose-template";
    const newNode = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: payload.name,
      type: isTemplateCategory ? "certificate-category" : payload.type,
      children: payload.type === "subcategories" ? [] : undefined,
      templates: isTemplateCategory ? [] : undefined,
    };
    setNodes((prev) => {
      if (!parentId) return [...prev, newNode];
      const updated = deepClone(prev);
      const parent = findNode(updated, parentId);
      if (parent && parent.children) parent.children.push(newNode);
      return updated;
    });
  }

  function saveEditedName(nodeId, newName) {
    setNodes((prev) => {
      const copy = deepClone(prev);
      const node = findNode(copy, nodeId);
      if (node) node.name = newName;
      return copy;
    });
    setActiveEditNode(null);
  }

  function deleteNodeConfirmed() {
    const id = activeDeleteNode;
    setNodes((prev) => {
      const copy = deepClone(prev);
      function removeFrom(arr, idToRemove) {
        const idx = arr.findIndex((x) => x.id === idToRemove);
        if (idx !== -1) {
          arr.splice(idx, 1);
          return true;
        }
        for (const it of arr) {
          if (it.children && removeFrom(it.children, idToRemove)) return true;
        }
        return false;
      }
      removeFrom(copy, id);
      return copy;
    });
    if (viewingNodeId === id) {
      setStack([{ id: "root", name: "Categories" }]);
      setViewingNodeId(null);
    }
    setActiveDeleteNode(null);
  }

  // navigation
  function openNode(nodeId) {
    const node = findNode(nodes, nodeId);
    if (!node) return;
    if (node.type === "template") {
      setCreateTemplateFor({ nodeId, showDomainDropdown: false });
      setShowCreateTemplateModal(true);
      return;
    }
    setStack((s) => [...s, { id: nodeId, name: node.name }]);
    setViewingNodeId(nodeId);
    closeDropdown();
  }

  function goToLevel(idx) {
    const newStack = stack.slice(0, idx + 1);
    setStack(newStack);
    const topItem = newStack[newStack.length - 1];
    setViewingNodeId(topItem.id === "root" ? null : topItem.id);
    closeDropdown();
  }

  function openDomainView(nodeId, domainName) {
    const node = findNode(nodes, nodeId);
    const label = node
      ? `${node.name} / ${
          domainName === "_ungrouped" ? "Ungrouped" : domainName
        }`
      : domainName || "Domain";
    setStack((s) => [
      ...s,
      {
        id: `domain:${nodeId}:${domainName}`,
        name: label,
        meta: { type: "domain", nodeId, domainName },
      },
    ]);
    setViewingNodeId(nodeId);
    closeDropdown();
  }

  // templates
  function openCreateTemplate(nodeId, showDomainDropdown, initialDomain) {
    setCreateTemplateFor({ nodeId, showDomainDropdown, initialDomain });
    setShowCreateTemplateModal(true);
  }

  function createTemplateForNode(nodeId, template) {
    setNodes((prev) => {
      const copy = deepClone(prev);
      const node = findNode(copy, nodeId);
      if (!node) return prev;
      if (node.type === "certificate-category" || node.templates) {
        if (!node.templates) node.templates = [];
        node.templates.push({
          ...template,
          id: Date.now() + Math.floor(Math.random() * 1000),
        });
        return copy;
      }
      node.domains = node.domains || {};
      const domainName = template.domain || "_ungrouped";
      if (!node.domains[domainName]) node.domains[domainName] = [];
      node.domains[domainName].push({
        ...template,
        id: Date.now() + Math.floor(Math.random() * 1000),
      });
      return copy;
    });

    setShowCreateTemplateModal(false);
    setCreateTemplateFor(null);

    setStack((s) => {
      const topItem = s[s.length - 1];
      if (
        topItem.meta &&
        topItem.meta.type === "domain" &&
        topItem.meta.nodeId === nodeId
      ) {
        return s;
      }
      const node = findNode(nodes, nodeId);
      return [...s, { id: nodeId, name: node ? node.name : "..." }];
    });
    setViewingNodeId(nodeId);
  }

  function openEditTemplateDetails(nodeId, domainName, template) {
    setEditTemplateFor({ nodeId, domainName, template });
  }

  function saveEditedTemplate(updatedTemplate) {
    setNodes((prev) => {
      const copy = deepClone(prev);
      for (const rootNode of copy) {
        function scan(node) {
          if (node.domains) {
            for (const d of Object.keys(node.domains || {})) {
              const idx = node.domains[d].findIndex(
                (t) => t.id === updatedTemplate.id
              );
              if (idx !== -1) {
                node.domains[d][idx] = {
                  ...node.domains[d][idx],
                  ...updatedTemplate,
                };
                return true;
              }
            }
          }
          if (node.templates) {
            const idx = node.templates.findIndex(
              (t) => t.id === updatedTemplate.id
            );
            if (idx !== -1) {
              node.templates[idx] = {
                ...node.templates[idx],
                ...updatedTemplate,
              };
              return true;
            }
          }
          if (node.children) {
            for (const c of node.children) if (scan(c)) return true;
          }
          return false;
        }
        if (scan(rootNode)) break;
      }
      return copy;
    });
    setEditTemplateFor(null);
  }

  function goToCanvas(template, mode) {
    const params = new URLSearchParams({
      mode,
      templateId: template.id,
      certificateName: template.name || "",
      domain: template.domain || "",
      orientation: template.orientation || "Portrait",
      createdDate: template.issueDate || "",
      validityDate: template.validityDate || "",
    }).toString();
    window.open(`/certificate-canvas?${params}`, "_blank");
  }

  const topMeta = top.meta || null;
  const isDomainPage = !!(topMeta && topMeta.type === "domain");

  const currentList = (() => {
    if (top.id === "root") return nodes;
    if (isDomainPage) {
      const node = findNode(nodes, topMeta.nodeId);
      if (!node) return [];
      return (node.domains && node.domains[topMeta.domainName]) || [];
    }
    const node = findNode(nodes, viewingNodeId);
    if (!node) return [];
    if (node.type === "subcategories") return node.children || [];
    if (node.type === "domains") return Object.keys(node.domains || {});
    if (node.type === "certificate-category") return node.templates || [];
    if (node.templates) return node.templates;
    return [];
  })();

  return {
    // state
    nodes,
    setNodes,
    stack,
    setStack,
    top,
    topMeta,
    isDomainPage,
    viewingNodeId,
    setViewingNodeId,
    dropdown,

    // lists
    currentList,

    // modal flags
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
    editTemplateFor,

    // actions
    openDropdown,
    closeDropdown,
    addNode,
    saveEditedName,
    deleteNodeConfirmed,
    openNode,
    goToLevel,
    openDomainView,
    openCreateTemplate,
    createTemplateForNode,
    openEditTemplateDetails,
    saveEditedTemplate,
    goToCanvas,
  };
}
