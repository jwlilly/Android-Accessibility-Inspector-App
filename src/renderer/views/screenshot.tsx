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
  overlappingViews,
  showTargetSize,
}: any) {
  const [screencapHeight, setScreencapHeight] = useState(0);
  const [screencapWidth, setScreencapWidth] = useState(0);
  const [width, setWidth] = useState(0);
  const [flatTree, setFlatTree] = useState<INode<IFlatMetadata>[] | null>(null);
  const [hoveredView, setHoveredView] = useState<INode | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // A view hovered in the previous tree must not be selectable in the new one
  useEffect(() => {
    setHoveredView(null);
    setFlatTree(flattenTree(dataTree));
  }, [dataTree]);

  // Wait for the image to decode before reading its size. Reading it right
  // after setting src gives 0 for a new screenshot, which threw off hovering
  // until a resize re-ran this.
  useEffect(() => {
    if (!screencap) {
      return undefined;
    }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) {
        setScreencapWidth(img.naturalWidth);
        setScreencapHeight(img.naturalHeight);
      }
    };
    img.src = `data:image/png;base64,${screencap}`;
    return () => {
      cancelled = true;
    };
  }, [screencap]);

  // Track the rendered size of the screenshot for stroke widths and markers
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return undefined;
    }
    const resizeObserver = new ResizeObserver(() => {
      setWidth(svg.getBoundingClientRect().width);
    });
    resizeObserver.observe(svg);
    return () => resizeObserver.disconnect();
  }, [screencap]);

  const getArea = (view: AndroidView) => {
    const viewHeight = view.metadata.y2! - view.metadata.y1!;
    const viewWidth = view.metadata.x2! - view.metadata.x1!;
    return viewHeight * viewWidth;
  };

  const hoverCallback = useCallback(
    (event: MouseEvent) => {
      if (event) {
        // Map the mouse into screenshot pixels with the svg's own transform,
        // which accounts for scaling and letterboxing
        const ctm = (event.currentTarget as SVGSVGElement).getScreenCTM();
        if (!ctm) {
          return;
        }
        const { x: mouseX, y: mouseY } = new DOMPoint(
          event.clientX,
          event.clientY,
        ).matrixTransform(ctm.inverse());
        let foundView: any = null;
        const filteredArray = flatTree?.filter((item) => {
          const { metadata } = item as unknown as AndroidView;
          if (metadata) {
            return (
              metadata.x1! <= mouseX &&
              mouseX <= metadata.x2! &&
              metadata.y1! <= mouseY &&
              mouseY <= metadata.y2!
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
    [flatTree, hoverCoord],
  );

  const svgClick = useCallback(() => {
    if (hoveredView) {
      onViewSelected(hoveredView);
    }
  }, [hoveredView, onViewSelected]);
  return (
    <div className="m-auto mx-4">
      <div className="relative mx-auto border-base-content bg-base-content border-[14px] rounded-xl max-h-[calc(100vh-150px)] h-full w-full shadow-xl">
        <div className="h-[10%] w-[1%] bg-base-content absolute -end-[17px] top-[20%] rounded-s-lg" />
        <div className="h-[7%] w-[1%] bg-base-content  absolute -end-[17px] top-[35%] rounded-s-lg" />
        <div className="h-[7%] w-[1%] bg-base-content absolute -end-[17px] top-[44%] rounded-s-lg" />
        <div className="overflow-hidden rounded-xl contents bg-base-100">
          {screencap ? (
            <svg
              ref={svgRef}
              aria-hidden="true"
              viewBox={`0 0 ${screencapWidth - 2} ${screencapHeight - 2}`}
              width="100%"
              height="100%"
              className="max-h-[calc(100vh-178px)]"
              onMouseMove={hoverCallback}
              onClick={svgClick}
            >
              <image href={`data:image/png;base64,${screencap}`} />
              {showTargetSize
                ? overlappingViews.map((overlappingView: any) => (
                    <circle
                      r={((screencapWidth / width) * 10).toFixed(0)}
                      cx={
                        (overlappingView.metadata.x2 +
                          overlappingView.metadata.x1) /
                        2
                      }
                      cy={
                        (overlappingView.metadata.y2 +
                          overlappingView.metadata.y1) /
                        2
                      }
                      fill="rgba(255, 0, 0, 0.3)"
                    />
                  ))
                : null}

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
          ) : (
            <div className="m-auto">
              <div className="relative m-auto bg-white h-[400px] w-[200px]">
                <img
                  className="max-h-[calc(100vh-178px)]"
                  src={placeholder}
                  alt=""
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Screenshot;
