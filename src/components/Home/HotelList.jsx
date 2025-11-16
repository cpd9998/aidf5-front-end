import { CiLocationOn } from "react-icons/ci";
import { PiStarThin } from "react-icons/pi";
import { Link } from "react-router";

const HotelList = ({ hotels }) => {
  console.log("hotels", hotels);
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-3 ">
      {hotels.map((hotel) => (
        <HotelCard key={hotel._id} {...hotel} />
      ))}
    </div>
  );
};

export default HotelList;

const HotelCard = ({ name, city, price, rating, image, _id, review }) => {
  console.log(name, city, price, rating, image, _id, review);

  return (
    <Link to={`/hotels/${_id}`} key={_id} className="mt-6 cursor-pointer">
      <div className="h-[300px]  ">
        <img
          src={image}
          alt={name}
          className="h-full w-full rounded-md  object-cover object-center transform duration-300 hover:scale-110 "
        />
      </div>
      <div className="flex flex-col">
        <h3 className="font-semibold text-lg my-3">{name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <CiLocationOn />
          <span className="text-gray-500 font-light capitalize">{city}</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <PiStarThin />
          <span className="text-gray-500 font-light">
            {rating} {`(${review.length === 0 ? "0" : review.length} Reviews)`}{" "}
          </span>
        </div>
        <div className="text-bold text-lg font-bold">${price}</div>
      </div>
    </Link>
  );
};
