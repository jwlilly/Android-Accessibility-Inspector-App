/* eslint-disable no-undef */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable prettier/prettier */
/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useResizable } from "react-resizable-layout";
import SampleSplitter from "./splitter-view";
import { cn } from "../utils/cn";
import { BasicTreeView, testData } from "./basic-tree-view";
import ConnectDevice from "./connect-device";

const IdeClone = (): JSX.Element => {
  const {
    isDragging: isDeviceDragging,
    position: deviceH,
    separatorProps: deviceDragBarProps
  } = useResizable({
    axis: "y",
    initial: 150,
    min: 100,
    reverse: false
  });
  const {
    isDragging: isTreeDragging,
    position: treeW,
    separatorProps: treeDragBarProps
  } = useResizable({
    axis: "x",
    initial: 250,
    min: 100,
    max: 500
  });
  const {
    isDragging: isDetailsDragging,
    position: detailsW,
    separatorProps: detailsDragBarProps
  } = useResizable({
    axis: "x",
    initial: 200,
    min: 50,
    reverse: true
  });

  return (
    <div
      className={
        "flex flex-column h-screen bg-dark font-mono color-white overflow-hidden"
      }
    >

      <div
        className={cn(
          "shrink-0 bg-darker contents",
          isDeviceDragging && "dragging"
        )}
        style={{ height: deviceH }}
      >
        <ConnectDevice />
      </div>
      <SampleSplitter
        dir={"horizontal"}
        isDragging={isDeviceDragging}
        {...deviceDragBarProps}
      />
      <div className={"flex grow"} style={{maxHeight: `calc(100vh - (${deviceH}px + 5px))` }}>
        <div
          className={`shrink-0 contents ${isTreeDragging ? 'dragging' : ''}` }
          style={{ width: treeW }}
        >
          Screenshot
        </div>
        <SampleSplitter isDragging={isTreeDragging} {...treeDragBarProps} />
        <div className={"flex grow"}>
          <div className="overflow-auto grow">
            <BasicTreeView  tree={testData}/>
          </div>
          <SampleSplitter
            isDragging={isDetailsDragging}
            {...detailsDragBarProps}
          />
          <div
            className={cn("shrink-0 contents", isDetailsDragging && "dragging")}
            style={{ width: detailsW }}
          >
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeClone;
