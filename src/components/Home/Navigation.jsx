import { IoMdMenu } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { Link } from "react-router";

import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import * as React from "react";

import { Plus, Hotel } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/components/theme-provider";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MdOutlineBedroomParent } from "react-icons/md";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const dispatch = useDispatch();
  const { user } = useUser();
  const isMobile = useIsMobile();
  const { setTheme } = useTheme();

  return (
    <nav className="bg-black/90 mx-6  rounded-2xl mt-3  px-6! py-3!  flex justify-between relative ">
      <NavigationMenu viewport={isMobile} className="text-white z-50">
        <NavigationMenuList className="flex-wrap">
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Link to="/">Home</Link>
            </NavigationMenuTrigger>
          </NavigationMenuItem>

          {user?.publicMetadata.role === "admin" && (
            <>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger> Hotel</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid w-[200px] gap-4  text-black">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/create-hotel"
                          className="flex-row items-center gap-2"
                        >
                          <Plus />
                          Create Hotel
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/hotel-list"
                          className="flex-row items-center gap-2"
                        >
                          <Hotel />
                          List Of Hotels
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger> Room Category</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid w-[200px] gap-4  text-black">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/hotel/create-category"
                          className="flex-row items-center gap-2"
                        >
                          <Plus />
                          Create Room Category
                        </Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/hotel/room-category-list"
                          className="flex-row items-center gap-2"
                        >
                          <MdOutlineBedroomParent />
                          List of Room Category
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger> Room </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid w-[200px] gap-4  text-black">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/hotel/create-room"
                          className="flex-row items-center gap-2"
                        >
                          <Plus />
                          Create Room
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/hotel/room-list"
                          className="flex-row items-center gap-2"
                        >
                          <MdOutlineBedroomParent />
                          List of Rooms
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem className="hidden md:block">
                <NavigationMenuTrigger> Booking</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-white">
                  <ul className="grid w-[200px] gap-4  text-black">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/admin/bookings/booking-list"
                          className="flex-row items-center gap-2"
                        >
                          <Plus />
                          Booking List
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      <div className=" cursor-pointer flex  font-bold text-white absolute top-2 right-6 gap-3">
        <Menu>
          <button className="flex h-10 w-10 rounded-md hover:bg-slate-200 hover:text-black   justify-center items-center text-white md:hidden transition-all duration-300 ease-in-out">
            <IoMdMenu onClick={() => setIsMenuOpen((prev) => !prev)} />
          </button>
        </Menu>

        <button className="cursor-pointer text-sm font-extralight h-10  w-18 rounded-md hover:bg-slate-200 hover:text-black   justify-center items-center text-white  hidden md:flex gap-2 transition-all duration-300 ease-in-out">
          <AiOutlineGlobal />
          <span>En</span>
        </button>
        <SignedOut>
          <Link
            className=" text-sm h-10 w-14 font-extralight rounded-md hover:bg-slate-200 hover:text-black   justify-center items-center text-white  hidden md:flex transition-all duration-300 ease-in-out"
            to="/sign-in"
          >
            Sign In
          </Link>

          <Link
            className=" text-xs font-light h-10 w-16  rounded-md bg-slate-200 text-black   justify-center items-center   hidden md:flex transition-all duration-300 ease-in-out"
            to="/sign-up"
          >
            Sign Up
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
      {isMenuOpen && <Menu />}
    </nav>
  );
};

export default Navigation;

const Menu = ({ children }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-40 bg-black text-white">
        <ul className="">
          <li className="py-2! px-3! hover:bg-slate-200 hover:text-black    transition-all duration-300 ease-in-out">
            <a href="">Home</a>
          </li>
          <li className="py-2! px-3! hover:bg-slate-200 hover:text-black    transition-all duration-300 ease-in-out">
            <a href="">En</a>
          </li>
          <li className="py-2! px-3! hover:bg-slate-200 hover:text-black    transition-all duration-300 ease-in-out">
            <a href="">Login</a>
          </li>
          <li className="py-2! px-3! hover:bg-slate-200 hover:text-black    transition-all duration-300 ease-in-out">
            <a href="">Sign Up</a>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};
