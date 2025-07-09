/* eslint-disable guard-for-in */
import TreeView, {
  flattenTree,
  INode,
  ITreeViewOnExpandProps,
  ITreeViewOnSelectProps,
  NodeId,
} from 'react-accessible-treeview';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { useCallback, useEffect, useState } from 'react';
import {
  GlobeAltIcon,
  MagnifyingGlassIcon,
  ViewfinderCircleIcon,
} from '@heroicons/react/24/outline';
import { IFlatMetadata } from 'react-accessible-treeview/dist/TreeView/utils';

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
  searchTerm,
  showTargetSize,
  overlappingViews,
}: any) {
  const [key, setKey] = useState(0);
  const [expandedIds, setExpandedIds] = useState(
    tree && tree.children ? [tree.children[0].id] : [],
  );
  const [searchResults, setSearchResults] = useState<INode<IFlatMetadata>[]>(
    [],
  );

  const viewSelected = (selectedData: ITreeViewOnSelectProps) => {
    if (selectedData.isSelected) {
      onViewSelected(selectedData);
      const expandIds: NodeId[] = [];
      let nodeParent = selectedData.element.parent;
      const info = flattenTree(tree);
      while (nodeParent !== 0) {
        expandIds.push(nodeParent!);
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

  const renderSupplementalInfo = (element: INode<IFlatMetadata>) => {
    if (element !== undefined && element.metadata !== undefined) {
      if (element.metadata.content !== undefined) {
        return (
          <div className="overflow-hidden text-xs font-thin max-w-44 text-ellipsis whitespace-nowrap">
            {element.metadata.content}
          </div>
        );
      }
      if (element.metadata.text !== undefined) {
        return (
          <div className="overflow-hidden text-xs font-thin max-w-44 text-ellipsis whitespace-nowrap">
            {element.metadata.text}
          </div>
        );
      }
    }
    return null;
  };

  const viewExpanded = useCallback((expandedData: ITreeViewOnExpandProps) => {
    if (expandedData.isExpanded) {
      setExpandedIds((expandArray) => [
        ...expandArray,
        expandedData.element.id,
      ]);
    } else {
      setExpandedIds((expandArray) =>
        expandArray.filter((element) => {
          return element !== expandedData.element.id;
        }),
      );
    }
  }, []);

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

  const searchTree = useCallback(
    (term: string) => {
      if (!term || (term && term.trim() === '')) {
        setSearchResults([]);
      } else {
        const flatTree = flattenTree(tree);
        const results = flatTree.filter((item) => {
          if (item.metadata) {
            // eslint-disable-next-line no-unreachable-loop, no-restricted-syntax
            for (const [, value] of Object.entries(item.metadata)) {
              const propertyValue = value?.toString().toLocaleLowerCase();
              if (propertyValue?.includes(term.toLocaleLowerCase())) {
                setExpandedIds([...expandedIds, item.parent]);
                return true;
              }
            }
          }
          return false;
        });
        const expandIds: NodeId[] = [];
        results.forEach((node) => {
          let nodeParent = node.parent;
          const info = flattenTree(tree);
          while (nodeParent !== 0) {
            expandIds.push(nodeParent!);
            // eslint-disable-next-line no-loop-func
            const view = info.find((element) => element.id === nodeParent);
            nodeParent = view?.parent;
          }
          const currentExpand = expandedIds;
          setExpandedIds(expandIds.concat(Array.from(currentExpand)));
        });

        setSearchResults(results);
      }
    },
    [tree, setExpandedIds, expandedIds],
  );

  useEffect(() => {
    setExpandedIds(tree && tree.children ? [tree.children[0].id] : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-param-reassign
    selectedView = null;
    setKey(Math.random());
  }, [tree]);

  useEffect(() => {
    searchTree(searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div key={key}>
      <TreeView
        data={flattenTree(tree)}
        className="mt-4 tree-view"
        aria-label="View hierarchy"
        clickAction="EXCLUSIVE_SELECT"
        onSelect={viewSelected}
        onExpand={viewExpanded}
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
            className={`indicator ${
              searchResults.find((item) => {
                return item.id === element.id;
              })
                ? 'search-term'
                : ''
            } ${element.name.includes('WebView') && 'webview'}`}
          >
            <span
              aria-hidden="true"
              title="search term found"
              className="indicator-item badge badge-warning badge-sm top-[5px]"
            >
              <MagnifyingGlassIcon className="h-4 text-warning-content stroke-2" />
            </span>
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
              <span
                role="img"
                aria-label="search term found"
                className="search-term-label"
              />

              {showTargetSize &&
              overlappingViews.find((item: any) => {
                return item.id === element.id;
              }) ? (
                <span
                  role="img"
                  aria-label="possible target size overlap"
                  title="possible target size overlap"
                  className="indicator indicator-item badge badge-error badge-sm top-[5px] left-[4px] !flex"
                >
                  <ViewfinderCircleIcon className="h-4 text-error-content stroke-2" />
                </span>
              ) : null}
              {isBranch && (
                <ArrowIcon
                  isOpen={isExpanded}
                  className="inline h-[24px] relative left-[-1px]"
                />
              )}

              <span
                className={`justify-start max-w-60 text-start btn ${isSelected ? 'btn-secondary' : 'btn-neutral btn-outline'}`}
              >
                <div className="flex flex-row overflow-hidden whitespace-nowrap">
                  <div className="flex-col">
                    {element.name}
                    {renderSupplementalInfo(element)}
                    <span className="sr-only">
                      {isSelected ? 'selected' : ''}
                    </span>
                  </div>
                  <div
                    className="content-center hidden w-full ml-2 webview-icon"
                    id={`${element.id}-webview`}
                  >
                    <GlobeAltIcon
                      aria-hidden="false"
                      role="img"
                      aria-label="WebView"
                      title="WebView"
                      className="h-4"
                    />
                  </div>
                </div>
              </span>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default BasicTreeView;
