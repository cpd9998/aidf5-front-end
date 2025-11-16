import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./page/home-page";
import { BrowserRouter, Routes, Route } from "react-router";
import SignIn from "./page/sign-in.page.jsx";
import SignUp from "./page/sign-up.page.jsx";
import RootLayoutPage from "./components/layout/root-layout.page.jsx";
import NotFoundPage from "@/page/not-found.page.jsx";
import Hotel from "@/page/hotel.page.jsx";
import HotelDetailPage from "@/page/hotel-detail.page.jsx";
import { store } from "./lib/store.js";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";
import ProtectLayout from "./components/layout/protect-layout.jsx";
import AdminProtectLayout from "./components/layout/AdminProtectLayout";
import CreateHotel from "./page/admin/create-hotel";
import Dashboard from "./page/admin/dashboard";
import HotelList from "./page/admin/hotel-list";
import UpdateHotel from "./page/admin/update-hotel";
import CreateRoomCategory from "./page/admin/create-room-category";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootLayoutPage />}>
              <Route index element={<HomePage />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/hotels" element={<Hotel />} />
              <Route element={<ProtectLayout />}>
                <Route path="/hotels/:_id" element={<HotelDetailPage />} />

                <Route element={<AdminProtectLayout />}>
                  <Route path="/admin" element={<Dashboard />} />
                  <Route path="/admin/create-hotel" element={<CreateHotel />} />
                  <Route path="/admin/hotel-list" element={<HotelList />} />
                  <Route path="/admin/hotel/:id" element={<UpdateHotel />} />
                  <Route
                    path="/admin/hotel/create-category"
                    element={<CreateRoomCategory />}
                  />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
  </StrictMode>
);
