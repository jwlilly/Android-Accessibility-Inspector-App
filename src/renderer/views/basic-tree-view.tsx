import TreeView, {
  flattenTree,
  INode,
  ITreeViewOnSelectProps,
  NodeId,
} from 'react-accessible-treeview';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

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
  selectedView,
}: any) {
  const [key, setKey] = useState(0);
  const [expandedIds, setExpandedIds] = useState(
    tree && tree.children ? [tree.children[0].id] : [],
  );

  const viewSelected = (selectedData: ITreeViewOnSelectProps) => {
    if (selectedData.isSelected) {
      onViewSelected(selectedData);
      const expandIds: NodeId[] = [];
      let nodeParent = selectedData.element.parent;
      const info = flattenTree(tree);
      while (nodeParent !== 0) {
        expandIds.push(nodeParent);
        // eslint-disable-next-line no-loop-func
        const view = info.find((element) => element.id === nodeParent);
        nodeParent = view?.parent;
      }
      const currentExpand = selectedData.treeState.expandedIds;
      setExpandedIds(expandIds.concat(Array.from(currentExpand)));
      setTimeout(() => {
        const focusElement = document.querySelector(
          '[role="tree"] [tabindex="0"]',
        ) as HTMLElement;
        if (focusElement) {
          focusElement.focus();
        }
      }, 100);
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
    setExpandedIds(tree && tree.children ? [tree.children[0].id] : []);
    selectedView = null;
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
        expandedIds={expandedIds}
        defaultExpandedIds={tree && tree.children ? [tree.children[0].id] : []}
        onFocus={branchFocusCallback}
        selectedIds={selectedView ? [selectedView] : []}
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
            className={`${!isBranch ? 'ml-1' : ''} pl-[10px] my-1 ${element.name.includes('WebView') && 'webview'}`}
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
            <div className="indicator">
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
                  <span className="sr-only">
                    {isSelected ? 'selected' : ''}
                  </span>
                </div>
                <span className="hidden indicator-item indicator-middle badge badge-success badge-xs">
                  <GlobeAltIcon
                    aria-hidden="false"
                    role="img"
                    aria-label="WebView"
                    title="WebView"
                    className="h-3 stroke-success-content"
                  />
                  {/* <span className="text-xs">WebView</span> */}
                </span>
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default BasicTreeView;
