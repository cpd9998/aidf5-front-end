import { useParams } from "react-router-dom";
import { useGetHotelByIdQuery } from "../../lib/api";
import Hotel from "@/components/Admin/Hotel";
import Loading from "@/components/Loading";
import AlertDialogBox from "@/components/AlertDialogBox";
import { extractErrorMessage } from "../../lib/errorUtils.js";

const UpdateHotel = () => {
  const { id } = useParams();
  const { data: hotel, isLoading, isError, error } = useGetHotelByIdQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <AlertDialogBox title="Error" desc={extractErrorMessage(error)} />;
    return;
  }

  return <Hotel hotel={hotel} />;
};

export default UpdateHotel;
