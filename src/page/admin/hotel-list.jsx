import { useGetAllHotelsByPaginationQuery } from "../../lib/api.js";
import { AiOutlineDelete } from "react-icons/ai";
import PaginationComponent from "../../components/PaginationComponent.jsx";
import { useState } from "react";
import AdminHoteListLoading from "../../components/LoadingTemplates/AdminHoteListLoading.jsx";
import { Link } from "react-router";
import { handleApiError } from "../../lib/errorUtils.js";
import { useEffect } from "react";
const HotelList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } =
    useGetAllHotelsByPaginationQuery(currentPage);

  const nextPage = () => {
    setCurrentPage((prev) => {
      if (data.pages >= currentPage) {
        return data.pages;
      } else {
        prev + 1;
      }
    });
  };

  const previousPage = () => {
    setCurrentPage((prev) => {
      if (currentPage === 1) {
        return 1;
      } else {
        return prev - 1;
      }
    });
  };

  useEffect(() => {
    if (isError && error) {
      handleApiError(error);
    }
  }, [isError, error]);

  if (isLoading) {
    return <AdminHoteListLoading />;
  }

  if (isError) {
    return null;
  }
  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mt-5">Hotel List</h1>
        {data && (
          <div>
            <div className="flex flex-col gap-3 min-h-[700px]">
              {data.hotels.map((hotel) => {
                return <HotelCard key={hotel._id} {...hotel} />;
              })}
            </div>

            <PaginationComponent
              currentPage={currentPage}
              totalPages={data.totalHotels}
              perPage={3}
              setCurrentPage={setCurrentPage}
              nextPage={nextPage}
              previousPage={previousPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelList;

export const HotelCard = ({ _id, name, price, image, desc }) => {
  console.log(name, price, image);
  return (
    <Link to={`/admin/hotel/${_id}`}>
      <div className="w-full flex justify-between items-end max-w-[900px] mt-10 gap-5  border border-gray-200 py-3 rounded-lg px-2  ">
        <div className="flex  gap-2   ">
          <img
            className="lg:w-[150px] lg:h-[150px] w-[100px] h-[100px]     object-cover object-center  rounded-lg"
            src={image}
          />

          <div className="flex flex-col   gap-2 lg:text-base text-xs pl-4  ">
            <p className="font-semibold text-gray-400">{name}</p>
            <p className=" min-h-[43px] text-gray-600   ">
              {desc.slice(0, 200)} ...
            </p>
            <p>LKR {price.toLocaleString()}</p>
          </div>
        </div>
        <AiOutlineDelete className="text-5xl text-red-500 cursor-pointer" />
      </div>
    </Link>
  );
};
