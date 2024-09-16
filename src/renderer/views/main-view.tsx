/* eslint-disable react/jsx-props-no-spreading */
import { useResizable } from 'react-resizable-layout';
import React, { useCallback, useState } from 'react';
import { INode, ITreeViewOnSelectProps } from 'react-accessible-treeview';
import { Navbar } from 'react-daisyui';
import {
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { IDevice } from 'adb-ts/lib/util';
import Splitter from './splitter-view';
import BasicTreeView from './basic-tree-view';
import ConnectDevice from './connect-device';
import ViewDetails from './view-details';
import Logs from './log-view';
import Screenshot from './screenshot';
import MainIcon from '../images/icon';
import RefreshTree from './refresh-tree';

function MainView(): React.JSX.Element {
  const [selectedView, setSelectedView] = useState<number>(0);
  const [viewHierarchy, setViewHierarchy] = useState({ name: '' });
  const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null);
  const [screencap, setScreencap] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [hoveredCoord, setHoveredCoord] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
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
    max: 700,
  });

  const viewSelected = (data: ITreeViewOnSelectProps) => {
    setSelectedView(parseInt(data.element.id.toString(), 10));
    if (data.element.metadata !== null && data.element.metadata !== undefined) {
      setSelectedCoord({
        x: data.element.metadata!.x1! as number,
        y: data.element.metadata!.y1! as number,
        width:
          (data.element.metadata!.x2! as number) -
          (data.element.metadata!.x1! as number),
        height:
          (data.element.metadata!.y2! as number) -
          (data.element.metadata!.y1! as number),
      });
    }
  };

  const viewHovered = (element: INode) => {
    setHoveredCoord({
      x: element.metadata!.x1! as number,
      y: element.metadata!.y1! as number,
      width:
        (element.metadata!.x2! as number) - (element.metadata!.x1! as number),
      height:
        (element.metadata!.y2! as number) - (element.metadata!.y1! as number),
    });
  };

  const onHoveredViewSelected = (view: INode) => {
    if (view) {
      setSelectedView(Number(view.id));
    }
  };

  const messageReceived = useCallback((data: any) => {
    if (!data.announcement) {
      setSelectedView(0);
      setViewHierarchy(data);
    }
  }, []);

  const deviceSelected = (device: IDevice) => {
    setSelectedDevice(device);
  };

  const screencapReceived = (received: string) => {
    setScreencap(received);
    setSelectedCoord({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    setHoveredCoord({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
  };

  return (
    <div className="flex w-screen h-screen flex-column bg-base-200">
      <Navbar
        aria-label="main"
        className="mx-2 mt-2 shadow-md bg-base-100 rounded-box max-w-[calc(100vw-1rem)]"
      >
        <Navbar.Start>
          <RefreshTree
            onMessageReceived={messageReceived}
            device={selectedDevice}
            onScreencapReceived={screencapReceived}
          />
        </Navbar.Start>
        <Navbar.Center>
          <h1 className="text-xl">
            <MainIcon className="inline w-10 h-10 mr-3" aria-hidden="true" />
            Accessibility Inspector
          </h1>
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

          <details
            className="dropdown"
            open={expanded}
            onToggle={(e) =>
              setExpanded((e.currentTarget as HTMLDetailsElement).open)
            }
          >
            <summary
              className="text-xl font-medium btn btn-ghost"
              aria-label="Select a device"
            >
              <div className="indicator">
                <div>
                  <DevicePhoneMobileIcon
                    className="h-[24px]"
                    title="Select a device"
                  />
                </div>
                <span
                  className={`indicator-item badge badge-error badge-xs ${selectedDevice ? 'hidden' : ''}  ${selectedDevice || expanded ? '' : 'motion-safe:animate-bounce top-[-6px] right-[-6px]'}`}
                >
                  <span className="sr-only">No device is connected</span>
                </span>
              </div>
            </summary>
            <ul
              className="p-2 shadow dropdown-content menu bg-base-100 rounded-box right-0 w-[500px] z-10"
              role="presentation"
            >
              <ConnectDevice onDeviceConnected={deviceSelected} />
            </ul>
          </details>

          <Logs />
        </Navbar.End>
      </Navbar>

      <div className="overflow-hidden flex grow max-w-[calc(100vw-1rem)]">
        <div
          className={`shrink-0 contents pt-4 ${isTreeDragging ? 'dragging' : ''}`}
          style={{ width: treeW, maxWidth: treeW }}
        >
          <Screenshot
            screencap={screencap}
            selectCoord={selectedCoord}
            hoverCoord={hoveredCoord}
            dataTree={viewHierarchy}
            onViewSelected={onHoveredViewSelected}
          />
        </div>
        <Splitter
          isDragging={isTreeDragging}
          {...treeDragBarProps}
          label="Resize between screenshot and view hierarchy"
        />
        <div className="flex grow">
          <div className="overflow-x-auto overflow-y-auto grow">
            <BasicTreeView
              tree={viewHierarchy}
              onViewSelected={viewSelected}
              onViewHovered={viewHovered}
              selectedView={selectedView}
            />
          </div>
          <Splitter
            isDragging={isDetailsDragging}
            {...detailsDragBarProps}
            label="Resize between view hierarchy and view details"
          />
          <div
            className={`overflow-y-auto overflow-x-auto shrink-0 mt-4 ${isDetailsDragging ? 'dragging select-none' : ''}`}
            style={{ width: detailsW }}
          >
            <ViewDetails
              selectedView={selectedView}
              viewHierarchy={viewHierarchy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainView;
