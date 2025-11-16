import TrendingHotels from "./TrendingHotels";
import HotelSearchAI from "./HotelSearchAI";
import { useSelector } from "react-redux";
const HotelView = () => {
  const { query } = useSelector((state) => state.search);
  console.log("Current search query from Redux store:", query);

  if (!query) {
    return <TrendingHotels />;
  } else {
    return <HotelSearchAI />;
  }
};

export default HotelView;
