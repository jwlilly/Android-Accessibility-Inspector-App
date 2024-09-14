import TreeView, {
  flattenTree,
  INode,
  ITreeViewOnSelectProps,
} from 'react-accessible-treeview';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';

function ArrowIcon({ isOpen, ...props }: any) {
  if (isOpen) {
    return <ChevronDownIcon className={props.className} />;
  }
  return <ChevronRightIcon className={props.className} />;
}

// eslint-disable-next-line react/prop-types
const BasicTreeView = function BasicTreeView({
  tree,
  onViewSelected,
  onViewHovered,
}: any) {
  const [key, setKey] = useState(0);

  const viewSelected = (selectedData: ITreeViewOnSelectProps) => {
    if (selectedData.isSelected) {
      onViewSelected(selectedData);
    }
  };

  const viewHovered = (hoveredData: INode) => {
    onViewHovered(hoveredData);
  };

  const branchFocusCallback = () => {
    const nodeId = document.activeElement
      ?.querySelector('[data-id]')
      ?.getAttribute('data-id');
    if (nodeId) {
      const node = flattenTree(tree).find(
        (element) => element.id === parseInt(nodeId, 10),
      );
      if (node) {
        onViewHovered(node);
      }
    }
  };

  useEffect(() => {
    setKey(Math.random());
  }, [tree]);

  return (
    <div key={key}>
      <TreeView
        data={flattenTree(tree)}
        className="mt-4 tree-view"
        aria-label="View hierarchy"
        clickAction="EXCLUSIVE_SELECT"
        onSelect={viewSelected}
        defaultExpandedIds={tree && tree.children ? [tree.children[0].id] : []}
        onFocus={branchFocusCallback}
        // eslint-disable-next-line react/no-unstable-nested-components
        nodeRenderer={({
          element,
          getNodeProps,
          isBranch,
          isExpanded,
          isSelected,
        }) => (
          <div
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...getNodeProps({})}
            className={`${!isBranch ? 'ml-1' : ''} pl-[10px] my-1`}
            onMouseOver={() => {
              viewHovered(element);
            }}
            onFocus={() => {
              if (!isBranch) {
                viewHovered(element);
              }
            }}
            data-id={element.id}
          >
            {isBranch && (
              <ArrowIcon
                isOpen={isExpanded}
                className="inline h-[24px] relative left-[-1px]"
              />
            )}
            <span
              className={`justify-start max-w-60 text-start btn ${isSelected ? 'btn-outline btn-secondary' : 'btn-ghost'}`}
            >
              <div className="overflow-hidden whitespace-nowrap">
                {element.name}
                {element.metadata !== undefined &&
                element.metadata.text !== undefined ? (
                  <div className="overflow-hidden text-xs font-thin text-ellipsis whitespace-nowrap">
                    {element.metadata.text}
                  </div>
                ) : null}
                <span className="sr-only">{isSelected ? 'selected' : ''}</span>
              </div>
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default BasicTreeView;
