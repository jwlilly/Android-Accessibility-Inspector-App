import TreeView, { ITreeViewOnSelectProps } from 'react-accessible-treeview';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';

function ArrowIcon({ isOpen, ...props }: any) {
  if (isOpen) {
    return <ChevronDownIcon className={props.className} />;
  }
  return <ChevronRightIcon className={props.className} />;
}

// eslint-disable-next-line react/prop-types
const BasicTreeView = function basicTreeView({ tree, onViewSelected }: any) {
  const viewSelected = (selectedData: ITreeViewOnSelectProps) => {
    if (selectedData.isSelected) {
      onViewSelected(selectedData);
    }
  };
  return (
    <TreeView
      data={tree}
      className="mt-4 tree-view"
      aria-label="View hierarchy"
      clickAction="EXCLUSIVE_SELECT"
      onSelect={viewSelected}
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
          {...getNodeProps()}
          className={`${!isBranch ? 'ml-1' : ''} pl-[10px] my-1`}
        >
          {isBranch && (
            <ArrowIcon
              isOpen={isExpanded}
              className="inline h-[24px] relative left-[-1px]"
            />
          )}
          <span
            className={`btn ${isSelected ? 'btn-outline btn-secondary' : 'btn-ghost'} `}
          >
            {element.name}
            <span className="sr-only">{isSelected ? 'selected' : ''}</span>
          </span>
        </div>
      )}
    />
  );
};

export default BasicTreeView;
