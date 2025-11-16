import Navigation from "../Home/Navigation";
import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";

const RootLayoutPage = () => {
  return (
    <>
      <Toaster />
      <div className="w-full">
        <Navigation />
        <Outlet />
      </div>
    </>
  );
};

export default RootLayoutPage;
