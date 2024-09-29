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
import { ToastContainer, toast } from 'react-toastify';
import Splitter from './splitter-view';
import BasicTreeView from './basic-tree-view';
import ConnectDevice from './connect-device';
import ViewDetails from './view-details';
import Logs from './log-view';
import Screenshot from './screenshot';
import MainIcon from '../images/icon';
import RefreshTree from './refresh-tree';
import 'react-toastify/dist/ReactToastify.css';
import SearchView from './search-view';

function MainView(): React.JSX.Element {
  const [selectedView, setSelectedView] = useState<number>(0);
  const [viewHierarchy, setViewHierarchy] = useState({ name: '' });
  const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [screencap, setScreencap] = useState<string | null>(null);
  const [deviceExpanded, setDeviceExpanded] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [logMessages, setLogMessages] = useState<
    { time: string; type: string; message: string, id:number }[]
  >([]);
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

  const onDisconnected = () => {
    setSelectedDevice(null);
  };

  const messageReceived = useCallback(
    (data: any) => {
      if (!data.announcement) {
        setSelectedView(0);
        setViewHierarchy(data);
        setSearchTerm('');
      } else if (data.announcement) {
        toast.info(
          <div className="flex flex-col">
            <h2 className="text-md">accessibility announcement </h2>
            <div className="text-sm">{data.announcement}</div>
          </div>,
        );
        const currentDate = new Date();
        const day = currentDate.getDay();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const hour = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const seconds = currentDate.getSeconds();
        const message = {
          time: `${month}/${day}/${year}-${hour}:${minutes}:${seconds}`,
          message: data.announcement,
          type: 'accessibility announcement',
          id: Math.random() * (5000 - 0) + 0,
        };

        setLogMessages(logMessages => [
          ...logMessages,
          message,
        ]);
      }
    },
    [],
  );

  const deviceSelected = (device: IDevice) => {
    setSelectedDevice(device);
  };

  const performSearch = (term: string) => {
    if (term !== null) {
      setSearchTerm(term);
    }
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
            onDisconnected={onDisconnected}
          />
        </Navbar.Start>
        <Navbar.Center>
          <h1 className="text-xl">
            <MainIcon className="inline w-10 h-10 mr-3" aria-hidden="true" />
            Accessibility Inspector
          </h1>
        </Navbar.Center>
        <Navbar.End>
          <details
            className="dropdown"
            open={searchExpanded}
            onToggle={(e) =>
              setSearchExpanded((e.currentTarget as HTMLDetailsElement).open)
            }
          >
            <summary
              className={`text-xl font-medium btn ${searchExpanded && 'btn-active'} btn-ghost`}
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
              <SearchView performSearch={performSearch} />
            </ul>

          </details>

          <details
            className="dropdown"
            open={deviceExpanded}
            onToggle={(e) =>
              setDeviceExpanded((e.currentTarget as HTMLDetailsElement).open)
            }
          >
            <summary
              className={`text-xl font-medium btn ${deviceExpanded && 'btn-active'} btn-ghost`}
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
                  className={`indicator-item badge badge-error badge-xs ${selectedDevice ? 'hidden' : ''}  ${selectedDevice || deviceExpanded ? '' : 'motion-safe:animate-bounce top-[-6px] right-[-6px]'}`}
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

          <Logs messages={logMessages} />
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
              searchTerm={searchTerm}
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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        role="status"
      />
    </div>
  );
}

export default MainView;
