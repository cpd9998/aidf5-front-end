import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const HotelLoading = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-[425px] h-[300px] bg-gray-300 overflow-hidden " />
      <div className="flex flex-col">
        <Skeleton className="w-[300px] h-[28px] bg-gray-300 mt-3 " />
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-[200px] h-[24px] bg-gray-300 mt-3 " />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="w-[100px] h-[24px] bg-gray-300  " />
        </div>
        <Skeleton className="w-[300px] h-[28px] bg-gray-300" />
      </div>
    </div>
  );
};

export default HotelLoading;
