import { Navigate, Outlet } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";

const AdminProtectLayout = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  if (user?.publicMetadata.role !== "admin") {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default AdminProtectLayout;
