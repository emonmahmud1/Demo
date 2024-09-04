const TableSkeleton = () => {
  return (
    <div className=" min-h-[500px]">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-row gap-3">
          <div className="w-10 h-10 skeleton" />
          <div className="w-full h-10 flex-1 skeleton" />
          <div className="w-10 h-10 skeleton" />
        </div>
      </div>

        <div className="w-full mt-3 min-h-[300px] h-full rounded-lg skeleton" />
     
    </div>
  );
};

export default TableSkeleton;
