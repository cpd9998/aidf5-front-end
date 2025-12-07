import { useParams } from "react-router";
import RoomCategory from "@/components/Admin/RoomCategory";
import Loading from "@/components/Loading";
import AlertDialogBox from "@/components/AlertDialogBox";
import { useGetRoomCategoryByIdQuery } from "@/lib/api";

const UpdateRoomCategory = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetRoomCategoryByIdQuery(id);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <AlertDialogBox title="Error" desc={extractErrorMessage(error)} />;
    return;
  }

  return <RoomCategory roomCategoryData={data} />;
};

export default UpdateRoomCategory;
