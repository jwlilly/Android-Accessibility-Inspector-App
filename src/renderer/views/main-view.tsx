/* eslint-disable react/jsx-props-no-spreading */
import { useResizable } from 'react-resizable-layout';
import React, { useState } from 'react';
import { ITreeViewOnSelectProps } from 'react-accessible-treeview';
import { Navbar, Button } from 'react-daisyui';
import {
  ArrowPathIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Splitter from './splitter-view';
import { BasicTreeView, testData } from './basic-tree-view';
import ConnectDevice from './connect-device';
import ViewDetails from './view-details';
import Logs from './log-view';
import Screenshot from './screenshot';

function MainView(): React.JSX.Element {
  const [selectedView, setSelectedView] = useState<number>(0);
  const {
    isDragging: isTreeDragging,
    position: treeW,
    separatorProps: treeDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 380,
    min: 310,
    max: 500,
  });
  const {
    isDragging: isDetailsDragging,
    position: detailsW,
    separatorProps: detailsDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 300,
    min: 100,
    reverse: true,
  });

  const viewSelected = (data: ITreeViewOnSelectProps) => {
    setSelectedView(parseInt(data.element.id.toString(), 10));
    console.log(data.element.id);
  };

  return (
    <div className="flex h-screen w-screen font-mono flex-column bg-base-200">
      <Navbar
        aria-label="main"
        className="shadow-md bg-base-100 rounded-box mt-2 mx-2"
        style={{ maxWidth: 'calc(100vw - 1rem)' }}
      >
        <Navbar.Start>
          <Button color="primary" aria-label="Refresh Tree">
            <ArrowPathIcon className="h-[24px]" title="Refresh Tree" />
          </Button>
        </Navbar.Start>
        <Navbar.Center>
          <h1 className="text-xl">Accessibility Inspector</h1>
        </Navbar.Center>
        <Navbar.End>
          <details className="dropdown">
            <summary
              className="text-xl font-medium btn btn-ghost"
              aria-label="Find text"
            >
              <div>
                <MagnifyingGlassIcon className="h-[24px]" title="Find text" />
              </div>
            </summary>
            <ul
              className="p-2 shadow dropdown-content menu bg-base-100 rounded-box right-0 w-[500px] z-10"
              role="presentation"
            >
              <div>Search for text</div>
            </ul>
          </details>
          <details className="dropdown">
            <summary
              className="text-xl font-medium btn btn-ghost"
              aria-label="Select a device"
            >
              <div>
                <DevicePhoneMobileIcon
                  className="h-[24px]"
                  title="Select a device"
                />
              </div>
            </summary>
            <ul
              className="p-2 shadow dropdown-content menu bg-base-100 rounded-box right-0 w-[500px] z-10"
              role="presentation"
            >
              <ConnectDevice />
            </ul>
          </details>
          <Logs />
        </Navbar.End>
      </Navbar>

      <div
        className="flex grow"
        style={{ maxHeight: `calc(100vh - (50px + 1rem))` }}
      >
        <div
          className={`shrink-0 contents pt-4 ${isTreeDragging ? 'dragging' : ''}`}
          style={{ width: treeW }}
        >
          <Screenshot />
        </div>
        <Splitter
          isDragging={isTreeDragging}
          {...treeDragBarProps}
          label="Resize between screenshot and view hierarchy"
        />
        <div className="flex grow">
          <div className="overflow-auto grow">
            <BasicTreeView tree={testData} onViewSelected={viewSelected} />
          </div>
          <Splitter
            isDragging={isDetailsDragging}
            {...detailsDragBarProps}
            label="Resize between view hierarchy and view details"
          />
          <div
            className={`overflow-auto shrink-0 mt-4 ${isDetailsDragging ? 'dragging' : ''}`}
            style={{ width: detailsW }}
          >
            <ViewDetails selectedView={selectedView} viewHierarchy={testData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainView;
