import { useEffect, useRef, useState } from 'react';
import placeholder from '../images/screenshot.png';

const Screenshot = function Screenshot({
  screencap,
  hoverCoord,
  selectCoord,
}: any) {
  const [screencapHeight, setScreencapHeight] = useState(0);
  const [screencapWidth, setScreencapWidth] = useState(0);
  const [width, setWidth] = useState(0);

  // useRef allows us to "store" the div in a constant,
  // and to access it via observedDiv.current
  const observedDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
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
  }, [screencap, selectCoord, width]);

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
                      width: hoverCoord.width - 10,
                      height: hoverCoord.height - 10,
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
                      width: hoverCoord.width,
                      height: hoverCoord.height,
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
                      width: selectCoord.width - 10,
                      height: selectCoord.height - 10,
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
                      width: selectCoord.width,
                      height: selectCoord.height,
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
      <div className="relative mx-auto border-base-content bg-base-content border-[14px] rounded-xl h-[600px] w-[300px] shadow-xl">
        <div className="h-[64px] w-[3px] bg-base-content absolute -end-[17px] top-[120px] rounded-s-lg" />
        <div className="h-[46px] w-[3px] bg-base-content  absolute -end-[17px] top-[214px] rounded-s-lg" />
        <div className="h-[46px] w-[3px] bg-base-content absolute -end-[17px] top-[266px] rounded-s-lg" />
        <div className="rounded-xl overflow-hidden w-[272px] h-[572px] contents bg-base-100">
          <img className="max-h-[calc(100vh-178px)]" src={placeholder} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Screenshot;
