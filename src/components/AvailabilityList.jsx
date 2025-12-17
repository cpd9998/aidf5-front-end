import { useState } from "react";
import { DialogComponent } from "./DialogComponent";
import CategoryDetail from "./CategoryDetail";
const AvailabilityList = ({ availabilityList }) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();

  console.log("xsdxsalcsc", selectedCategory);

  const handleClick = (cate) => {
    console.log("cate", cate);
    setSelectedCategory({
      ...cate,
      ...availabilityList.searchParams,
      totalPrice: cate.totalPrice,
    });
    setOpen(true);
  };

  return (
    <div className="w-full mt-5 px-2 pb-2 ">
      <div className="flex flex-col gap-4">
        {availabilityList?.categories.map((item, index) => {
          return (
            <AvailabilityItem key={index} {...item} handleClick={handleClick} />
          );
        })}
      </div>

      <DialogComponent
        isOpen={open}
        onOpenChange={setOpen}
        title=""
        description=""
      >
        <CategoryDetail {...selectedCategory} />
      </DialogComponent>
    </div>
  );
};

export default AvailabilityList;

const AvailabilityItem = ({ category, totalPrice, handleClick }) => {
  return (
    <div className="border border-gray-300 rounded-md p-2 hover:bg-gray-50 hover:scale-[1.02] transition-all duration-200 ">
      <div className="flex gap-2">
        <img
          src={category.images[0]}
          className="object-cover object-center lg:w-[150px] lg:h-[150px] w-[100px] h-[100px] rounded-md"
          alt={category.name}
        />
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-4">
            <h2
              className="font-bold text-blue-500 underline cursor-pointer"
              onClick={() => handleClick({ category, totalPrice })}
            >
              {category.name}
            </h2>
            <h4 className="font-semibold whitespace-nowrap">
              $ {totalPrice.toLocaleString()}
            </h4>
          </div>
          <p className="max-w-[600px] text-gray-500 text-sm mt-1">
            {category.description}
          </p>
        </div>
      </div>
    </div>
  );
};
