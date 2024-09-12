import placeholder from '../images/screenshot.png';

const Screenshot = function Screenshot({ screencap }: any) {
  if (screencap) {
    return (
      <div className="m-auto mx-4">
        <div className="relative mx-auto border-base-content bg-base-content border-[14px] rounded-xl max-h-[calc(100vh-150px)] h-full w-full shadow-xl">
          <div className="h-[10%] w-[1%] bg-base-content absolute -end-[17px] top-[20%] rounded-s-lg" />
          <div className="h-[7%] w-[1%] bg-base-content  absolute -end-[17px] top-[35%] rounded-s-lg" />
          <div className="h-[7%] w-[1%] bg-base-content absolute -end-[17px] top-[44%] rounded-s-lg" />
          <div className="overflow-hidden rounded-xl contents bg-base-100">
            <img
              className="max-h-[calc(100vh-178px)]"
              src={
                screencap ? `data:image/png;base64,${screencap}` : placeholder
              }
              alt=""
            />
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
