import { Skeleton } from "@/components/ui/skeleton";

const AdminHoteListLoading = () => {
  return (
    <div className="mx-7 pb-6">
      <h1 className="text-3xl font-bold mt-5">Hotel List</h1>
      <div className="flex flex-col gap-3 min-h-[700px]">
        <div className="flex gap-2  max-w-[900px] mt-10    py-3 rounded-lg px-2  ">
          <Skeleton className="w-[150px] h-[150px] bg-gray-300  " />
          <Skeleton className="w-[680px] h-[150px] bg-gray-300  " />
        </div>
        <div className="flex gap-2  max-w-[900px] mt-10    py-3 rounded-lg px-2  ">
          <Skeleton className="w-[150px] h-[150px] bg-gray-300  " />
          <Skeleton className="w-[680px] h-[150px] bg-gray-300  " />
        </div>
        <div className="flex gap-2  max-w-[900px] mt-10    py-3 rounded-lg px-2  ">
          <Skeleton className="w-[150px] h-[150px] bg-gray-300  " />
          <Skeleton className="w-[680px] h-[150px] bg-gray-300  " />
        </div>
      </div>
    </div>
  );
};

export default AdminHoteListLoading;
