const RoomCategoryListLoading = () => {
  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5  "> Room Categories</h1>

        <div className="flex flex-col justify-between gap-3 min-h-[700px]">
          <RoomCategory />
          <RoomCategory />
          <RoomCategory />
        </div>
      </div>
    </div>
  );
};

export default RoomCategoryListLoading;

const RoomCategory = () => {
  return (
    <div className="w-full flex justify-between items-end max-w-[900px] mt-10 gap-5   py-3 rounded-lg px-2  ">
      <div className="flex  gap-2   ">
        <div className="w-[150px] h-[150px] bg-gray-300 "></div>

        <div className="flex flex-col   gap-2 lg:text-base text-xs pl-4 w-[570px] h-[150px] bg-gray-300  "></div>
      </div>
    </div>
  );
};
