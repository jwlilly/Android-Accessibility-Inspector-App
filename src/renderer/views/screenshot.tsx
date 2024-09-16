/* eslint-disable import/named */
/* eslint-disable import/no-duplicates */
// eslint-disable-next-line import/no-duplicates
/* eslint-disable import/named */
import { useCallback, useEffect, useRef, useState, MouseEvent } from 'react';
import { flattenTree, INode } from 'react-accessible-treeview';
import { IFlatMetadata } from 'react-accessible-treeview/dist/TreeView/utils';
import placeholder from '../images/screenshot.png';
import { AndroidView } from '../models/AndroidView';

const Screenshot = function Screenshot({
  screencap,
  hoverCoord,
  selectCoord,
  dataTree,
  onViewSelected,
}: any) {
  const [screencapHeight, setScreencapHeight] = useState(0);
  const [screencapWidth, setScreencapWidth] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [flatTree, setFlatTree] = useState<INode<IFlatMetadata>[] | null>(null);
  const [hoveredView, setHoveredView] = useState<INode | null>(null);

  // useRef allows us to "store" the div in a constant,
  // and to access it via observedDiv.current
  const observedDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setFlatTree(flattenTree(dataTree));
    const img = document.createElement('img');
    img.setAttribute('src', `data:image/png;base64,${screencap}`);
    setTimeout(() => {
      setScreencapHeight(img.height);
      setScreencapWidth(img.width);
    }, 0);

    if (!observedDiv.current) {
      // we do not initialize the observer unless the ref has
      // been assigned
      return;
    }

    // we also instantiate the resizeObserver and we pass
    // the event handler to the constructor
    const resizeObserver = new ResizeObserver(() => {
      if (observedDiv.current && observedDiv.current.offsetWidth !== width) {
        setWidth(observedDiv.current.offsetWidth);
        setHeight(observedDiv.current.offsetHeight);
      }
    });

    // the code in useEffect will be executed when the component
    // has mounted, so we are certain observedDiv.current will contain
    // the div we want to observe
    resizeObserver.observe(observedDiv.current);

    // if useEffect returns a function, it is called right before the
    // component unmounts, so it is the right place to stop observing
    // the div
    // eslint-disable-next-line consistent-return
    return function cleanup() {
      resizeObserver.disconnect();
    };
  }, [screencap, selectCoord, width, dataTree]);

  const getArea = (view: AndroidView) => {
    const viewHeight = view.metadata.y2! - view.metadata.y1!;
    const viewWidth = view.metadata.x2! - view.metadata.x1!;
    return viewHeight * viewWidth;
  };

  const hoverCallback = useCallback(
    (event: MouseEvent) => {
      if (event) {
        const offset = event.currentTarget.getBoundingClientRect();
        const mouseX = event.clientX - offset.left;
        const mouseY = event.clientY - offset.top;
        let foundView: any = null;
        const filteredArray = flatTree?.filter((item) => {
          const { metadata } = item as unknown as AndroidView;
          if (metadata) {
            const scaleX = width / screencapWidth;
            const scaleY = height / screencapHeight;
            const scaledX1 = metadata.x1! * scaleX;
            const scaledX2 = metadata.x2! * scaleX;
            const scaledY1 = metadata.y1! * scaleY;
            const scaledY2 = metadata.y2! * scaleY;
            return (
              scaledX1 <= mouseX &&
              mouseX <= scaledX2 &&
              scaledY1 <= mouseY &&
              mouseY <= scaledY2
            );
          }
          return false;
        });
        if (filteredArray?.length === 1) {
          hoverCoord.x = filteredArray[0].metadata?.x1;
          hoverCoord.y = filteredArray[0].metadata?.y1;
          hoverCoord.width =
            Number(filteredArray[0].metadata?.x2) -
            Number(filteredArray[0].metadata?.x1);
          hoverCoord.height =
            Number(filteredArray[0].metadata?.y2) -
            Number(filteredArray[0].metadata?.y1);
          setHoveredView(filteredArray[0]);
        } else if (filteredArray && filteredArray?.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          foundView = filteredArray[0];
          filteredArray.forEach((item) => {
            if (
              foundView !== item &&
              getArea(item as unknown as AndroidView) <=
                getArea(foundView as unknown as AndroidView)
            ) {
              foundView = item;
            }
          });
          hoverCoord.x = foundView.metadata?.x1;
          hoverCoord.y = foundView.metadata?.y1;
          hoverCoord.width =
            Number(foundView.metadata?.x2) - Number(foundView.metadata?.x1);
          hoverCoord.height =
            Number(foundView.metadata?.y2) - Number(foundView.metadata?.y1);
          setHoveredView(foundView);
        }
      }
    },
    [flatTree, hoverCoord, screencapWidth, screencapHeight, width, height],
  );

  const svgClick = useCallback(() => {
    onViewSelected(hoveredView);
  }, [hoveredView, onViewSelected]);

  if (screencap) {
    return (
      <div className="m-auto mx-4">
        <div className="relative mx-auto border-base-content bg-base-content border-[14px] rounded-xl max-h-[calc(100vh-150px)] h-full w-full shadow-xl">
          <div className="h-[10%] w-[1%] bg-base-content absolute -end-[17px] top-[20%] rounded-s-lg" />
          <div className="h-[7%] w-[1%] bg-base-content  absolute -end-[17px] top-[35%] rounded-s-lg" />
          <div className="h-[7%] w-[1%] bg-base-content absolute -end-[17px] top-[44%] rounded-s-lg" />
          <div
            className="overflow-hidden rounded-xl contents bg-base-100"
            ref={observedDiv}
          >
            <svg
              aria-hidden="true"
              viewBox={`0 0 ${screencapWidth - 2} ${screencapHeight - 2}`}
              width="100%"
              height="100%"
              className="max-h-[calc(100vh-178px)]"
              onMouseMove={hoverCallback}
              onClick={svgClick}
            >
              <image href={`data:image/png;base64,${screencap}`} />
              {hoverCoord.x !== 0 ||
              hoverCoord.y !== 0 ||
              hoverCoord.width !== 0 ||
              hoverCoord.height !== 0 ? (
                <>
                  <rect
                    x={hoverCoord.x + 5}
                    y={hoverCoord.y + 5}
                    rx={15}
                    className="stroke-white fill-transparent"
                    style={{
                      strokeWidth: ((screencapWidth / width) * 3).toFixed(0),
                      width:
                        hoverCoord.width - 10 > 0 ? hoverCoord.width - 10 : 10,
                      height:
                        hoverCoord.height - 10 > 0
                          ? hoverCoord.height - 10
                          : 10,
                    }}
                  />
                  <rect
                    x={hoverCoord.x - 5}
                    y={hoverCoord.y - 5}
                    rx={15}
                    className="stroke-black fill-transparent"
                    style={{
                      strokeWidth: ((screencapWidth / width) * 3).toFixed(0),
                      width: hoverCoord.width + 10,
                      height: hoverCoord.height + 10,
                    }}
                  />
                  <rect
                    x={hoverCoord.x}
                    y={hoverCoord.y}
                    rx={15}
                    className="stroke-success fill-transparent"
                    style={{
                      strokeWidth: ((screencapWidth / width) * 3).toFixed(0),
                      width: hoverCoord.width !== 0 ? hoverCoord.width : 1,
                      height: hoverCoord.height !== 0 ? hoverCoord.height : 1,
                    }}
                  />
                </>
              ) : null}
              {selectCoord.x !== 0 ||
              selectCoord.y !== 0 ||
              selectCoord.width !== 0 ||
              selectCoord.height !== 0 ? (
                <>
                  <rect
                    x={selectCoord.x + 5}
                    y={selectCoord.y + 5}
                    rx={15}
                    className="stroke-white fill-transparent"
                    style={{
                      strokeWidth: ((screencapWidth / width) * 3).toFixed(0),
                      width:
                        selectCoord.width - 10 > 0 ? selectCoord.width - 10 : 0,
                      height:
                        selectCoord.height - 10 > 0
                          ? selectCoord.height - 10
                          : 10,
                    }}
                  />
                  <rect
                    x={selectCoord.x - 5}
                    y={selectCoord.y - 5}
                    rx={15}
                    className="stroke-black fill-transparent"
                    style={{
                      strokeWidth: ((screencapWidth / width) * 3).toFixed(0),
                      width: selectCoord.width + 10,
                      height: selectCoord.height + 10,
                    }}
                  />
                  <rect
                    x={selectCoord.x}
                    y={selectCoord.y}
                    rx={15}
                    className="stroke-error fill-transparent"
                    style={{
                      strokeWidth: ((screencapWidth / width) * 3).toFixed(0),
                      width: selectCoord.width !== 0 ? selectCoord.width : 1,
                      height: selectCoord.height !== 0 ? selectCoord.height : 1,
                    }}
                  />
                </>
              ) : null}
            </svg>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="m-auto">
      <div className="relative mx-auto border-base-content bg-base-content border-[14px] rounded-xl h-[400px] w-[200px] shadow-xl">
        <div className="h-[10%] w-[1%] bg-base-content absolute -end-[17px] top-[20%] rounded-s-lg" />
        <div className="h-[7%] w-[1%] bg-base-content  absolute -end-[17px] top-[35%] rounded-s-lg" />
        <div className="h-[7%] w-[1%] bg-base-content absolute -end-[17px] top-[44%] rounded-s-lg" />
        <div className="w-full h-full overflow-hidden rounded-xl contents bg-base-100">
          <img className="max-h-[calc(100vh-178px)]" src={placeholder} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Screenshot;
