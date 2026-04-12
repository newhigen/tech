export default function rehypeBlogHide() {
  return (tree) => {
    const nodesToRemove = [];
    let hideStart = -1;

    // Find all comment nodes and content between hide markers
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];

      if (node.type === 'comment' && node.value.includes('blog-hide-start')) {
        hideStart = i;
      } else if (node.type === 'comment' && node.value.includes('blog-hide-end') && hideStart !== -1) {
        // Remove from hideStart to current index (inclusive)
        for (let j = i; j >= hideStart; j--) {
          nodesToRemove.push(j);
        }
        hideStart = -1;
      }
    }

    // Remove nodes in reverse order to maintain indices
    nodesToRemove.sort((a, b) => b - a);
    const uniqueIndices = [...new Set(nodesToRemove)];
    uniqueIndices.forEach(index => {
      tree.children.splice(index, 1);
    });
  };
}
