import { visit } from 'unist-util-visit';

export default function remarkBlogHide() {
  return (tree) => {
    const nodesToRemove = [];
    let inHideBlock = false;

    visit(tree, (node, index, parent) => {
      // Check for HTML comment nodes
      if (node.type === 'html' && typeof node.value === 'string') {
        if (node.value.includes('blog-hide-start')) {
          inHideBlock = true;
          nodesToRemove.push({ parent, index });
          return;
        } else if (node.value.includes('blog-hide-end')) {
          inHideBlock = false;
          nodesToRemove.push({ parent, index });
          return;
        }
      }

      if (inHideBlock) {
        nodesToRemove.push({ parent, index });
      }
    });

    // Remove in reverse order to maintain indices
    nodesToRemove.reverse().forEach(({ parent, index }) => {
      if (parent?.children && index !== undefined) {
        parent.children.splice(index, 1);
      }
    });
  };
}
