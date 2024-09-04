const DashBoardSkeleton = () => {
  return (
    <div className="flex flex-col h-screen">
      <div>
        <div className="w-full h-14 skeleton" />
      </div>
      <div className="mt-3 skeleton h-[calc(100vh-28px)]" />
      <div className="mt-3 skeleton h-14" />
    </div>
  );
};

export default DashBoardSkeleton;
