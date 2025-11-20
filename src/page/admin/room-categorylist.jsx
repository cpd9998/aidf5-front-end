import { Combobox } from "@/components/ComboBox";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLazyGetHotelBySearchQuery } from "../../lib/api";

const RoomCategoryList = () => {
  const [value, setValue] = useState("");
  const [catagoryList, setCategoryList] = useState([]);
  const [triggerSearch, { data, isLoading }] = useLazyGetHotelBySearchQuery();

  const handleSearch = useDebounce((searchTerm) => {
    triggerSearch(searchTerm);
  }, 500);

  const handleChange = (e) => {
    handleSearch(e.target.value);
  };

  useEffect(() => {
    if (data) {
      setCategoryList(data);
    }
  }, [data]);

  console.log("selected value", value);

  return (
    <div className="flex justify-center py-10 bg-gray-50 min-h-screen">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-5  "> Room Categories</h1>
        <Combobox
          list={catagoryList}
          value={value || ""}
          setValue={setValue}
          placeholder="Search hotel..."
          handleChange={handleChange}
          // field={field}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default RoomCategoryList;
