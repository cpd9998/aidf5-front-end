import { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

const CategoryDetail = ({
  category: { name, images = [], description, amenities = [], _id },
  checkInDate,
  checkOutDate,
  hotelId,
  maxAdults,
  maxChildren,
  totalPrice,
}) => {
  console.log("images", images);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const handleNavigateBooking = () => {
    navigate("/bookings", {
      state: {
        hotelId,
        categoryId: _id,
        categoryName: name,
        checkInDate,
        checkOutDate,
        maxAdults,
        maxChildren,
        totalPrice,
        images,
      },
    });
  };

  return (
    <div className="w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Section */}
      <div>
        <div className="w-full h-[260px] md:h-[320px] rounded-2xl overflow-hidden shadow">
          <img src={images[active]} className="w-full h-full object-cover" />
        </div>

        <div className="flex gap-3 mt-4 ">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActive(i)}
              className={`w-24 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                active === i
                  ? "border-blue-500 scale-105"
                  : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="space-y-4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>

          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>

          <Section title="Amenities:" items={amenities} />
        </div>

        <Button
          type="submit"
          className="mt-4 bg-black text-white"
          onClick={handleNavigateBooking}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default CategoryDetail;

const Section = ({ title, items }) => {
  return (
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <ul className="grid grid-cols-2 gap-1 text-sm text-gray-700">
        {items.map((item, i) => (
          <li key={i}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
};
