import { visit } from 'unist-util-visit';

export default function rehypeBlogHide() {
  return (tree) => {
    let hideStart = false;
    const nodesToRemove = [];

    visit(tree, 'comment', (node, index, parent) => {
      if (node.value.includes('blog-hide-start')) {
        hideStart = true;
        nodesToRemove.push({ node, parent, index });
      } else if (node.value.includes('blog-hide-end')) {
        hideStart = false;
        nodesToRemove.push({ node, parent, index });
      }
    });

    // Remove hide markers
    nodesToRemove.forEach(({ parent, index }) => {
      if (parent && index !== undefined) {
        parent.children.splice(index, 1);
      }
    });

    // Remove content between markers
    hideStart = false;
    const toRemove = [];

    visit(tree, (node, index, parent) => {
      if (node.type === 'comment' && node.value.includes('blog-hide-start')) {
        hideStart = true;
      } else if (node.type === 'comment' && node.value.includes('blog-hide-end')) {
        hideStart = false;
      } else if (hideStart) {
        toRemove.push({ parent, index });
      }
    });

    // Remove in reverse order to maintain indices
    toRemove.reverse().forEach(({ parent, index }) => {
      if (parent && index !== undefined) {
        parent.children.splice(index, 1);
      }
    });
  };
}
