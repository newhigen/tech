export default function remarkBlogHide() {
  return (tree) => {
    const nodesToRemove = [];
    let hideStart = -1;

    // First pass: find hide markers
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      // Check for blog-hide-start marker
      if (node.type === 'html' && typeof node.value === 'string' && node.value.includes('blog-hide-start')) {
        hideStart = i;
      }
      // Check for blog-hide-end marker
      else if (node.type === 'html' && typeof node.value === 'string' && node.value.includes('blog-hide-end') && hideStart !== -1) {
        // Mark all nodes from hideStart to current index (inclusive) for removal
        for (let j = hideStart; j <= i; j++) {
          nodesToRemove.push(j);
        }
        hideStart = -1;
      }
    }

    // Second pass: remove marked nodes in reverse order
    nodesToRemove.sort((a, b) => b - a);
    const uniqueIndices = [...new Set(nodesToRemove)];
    uniqueIndices.forEach(index => {
      tree.children.splice(index, 1);
    });
  };
}
