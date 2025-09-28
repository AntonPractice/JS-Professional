function getPath(element) {
  let path = [];

  while (element && element.nodeType === 1) {
    let selector = element.tagName.toLowerCase();

    if (element.id) {
      selector = "#" + element.id;
      path.unshift(selector);
      break;
    }

    if (element.className) {
      selector += "." + element.className.trim().split(/\s+/).join(".");
    }

    if (element.parentNode) {
      const children = Array.from(element.parentNode.children);
      const index = children.indexOf(element) + 1;
      selector += `:nth-child(${index})`;
    }

    path.unshift(selector);
    element = element.parentNode;
  }

  return path.join(" > ");
}

module.exports = getPath;
