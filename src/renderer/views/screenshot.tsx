const Screenshot = function Screenshot() {
  return (
    <div className="m-auto">
      <div className="relative mx-auto border-base-content bg-base-content border-[14px] rounded-xl h-[600px] w-[300px] shadow-xl">
        <div className="h-[64px] w-[3px] bg-base-content absolute -end-[17px] top-[120px] rounded-s-lg" />
        <div className="h-[46px] w-[3px] base-content  absolute -end-[17px] top-[214px] rounded-s-lg" />
        <div className="h-[46px] w-[3px] base-content absolute -end-[17px] top-[266px] rounded-s-lg" />
        <div className="rounded-xl overflow-hidden w-[272px] h-[572px] contents bg-base-100">
          Screenshot
        </div>
      </div>
    </div>
  );
};

export default Screenshot;
