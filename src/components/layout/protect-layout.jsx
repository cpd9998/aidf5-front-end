import { Outlet } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";

const ProtectLayout = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  console.log("users", user);
  if (!isLoaded) {
    return null;
  }
  if (isLoaded && !isSignedIn) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default ProtectLayout;
