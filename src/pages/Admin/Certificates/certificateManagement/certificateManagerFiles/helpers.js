/* -----------------------------
File: helpers.js
------------------------------*/
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function findNode(list, id) {
  const stack = [...list];
  while (stack.length) {
    const n = stack.shift();
    if (n.id === id) return n;
    if (n.children) stack.push(...n.children);
  }
  return null;
}

export function isTemplateObject(item) {
  return (
    !!item &&
    ("orientation" in item ||
      "variables" in item ||
      "issueDate" in item ||
      "validityDate" in item ||
      "templateName" in item ||
      "name" in item)
  );
}

export function isDeletable(node) {
  if (!node) return true;
  let count = 0;
  if (node.domains) {
    for (const k of Object.keys(node.domains || {})) {
      count += (node.domains[k] || []).length;
    }
  }
  if (node.templates) count += (node.templates || []).length;
  if (node.children) {
    for (const c of node.children) {
      if (!isDeletable(c)) return false;
    }
  }
  return count === 0 && !(node.children && node.children.length > 0);
}

export function actionsFor(item) {
  if (!item) return [];
  if (isTemplateObject(item))
    return ["View Template", "Edit Template", "Edit Template Details"];
  if (item.type === "certificate-category")
    return ["View Categorywise Template", "Edit Category Name"];
  const list = [];
  if (item.type === "domains") list.push("View Domains");
  if (item.type === "subcategories") list.push("View Subcategories");
  list.push("Edit Category Name");
  if (isDeletable(item)) list.push("Delete Category");
  return list;
}
