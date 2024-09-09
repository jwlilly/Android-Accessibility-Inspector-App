/* eslint-disable react/jsx-props-no-spreading */
import { useResizable } from 'react-resizable-layout';
import React, { useState } from 'react';
import { ITreeViewOnSelectProps } from 'react-accessible-treeview';
import Splitter from './splitter-view';
import { BasicTreeView, testData } from './basic-tree-view';
import ConnectDevice from './connect-device';
import ViewDetails from './view-details';
import { Tabs } from 'react-daisyui';

function MainView(): React.JSX.Element {
  const [selectedView, setSelectedView] = useState<number>(0);
  const {
    isDragging: isTreeDragging,
    position: treeW,
    separatorProps: treeDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 250,
    min: 100,
    max: 500,
  });
  const {
    isDragging: isDetailsDragging,
    position: detailsW,
    separatorProps: detailsDragBarProps,
  } = useResizable({
    axis: 'x',
    initial: 200,
    min: 50,
    reverse: true,
  });

  const viewSelected = (data: ITreeViewOnSelectProps) => {
    setSelectedView(parseInt(data.element.id.toString(), 10));
    console.log(data.element.id);
  };

  return (
    <div className="flex h-screen overflow-hidden font-mono flex-column">
      <Tabs variant="lifted" size="md">
        <Tabs.RadioTab
          name="my_tabs_2"
          label="Device"
          contentClassName="bg-base-100 border-base-300 rounded-box p-6 h-full"
          defaultChecked
          color="primary"
        >
          <ConnectDevice />
        </Tabs.RadioTab>
        <Tabs.RadioTab
          name="my_tabs_2"
          label="View Hierarchy"
          contentClassName="bg-base-100 border-base-300 rounded-box p-6"
          color="primary"
          defaultChecked
        >
          <div
            className="flex grow"
            style={{ maxHeight: `calc(100vh - 25px)` }}
          >
            <div
              className={`shrink-0 contents ${isTreeDragging ? 'dragging' : ''}`}
              style={{ width: treeW }}
            >
              Screenshot
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
                className={`overflow-auto shrink-0 ${isDetailsDragging ? 'dragging' : ''}`}
                style={{ width: detailsW }}
              >
                <ViewDetails
                  selectedView={selectedView}
                  viewHierarchy={testData}
                />
              </div>
            </div>
          </div>
        </Tabs.RadioTab>
        <Tabs.RadioTab
          name="my_tabs_2"
          label="Logs"
          contentClassName="bg-base-100 border-base-300 rounded-box p-6"
          color="primary"
        >
          Logs
        </Tabs.RadioTab>
      </Tabs>
    </div>
  );
}

export default MainView;
