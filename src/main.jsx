import { lazy, Suspense } from "react";
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
import Dashboard from "./page/admin/dashboard";
import { ThemeProvider } from "./components/theme-provider";
import UpdateHotel from "@/page/admin/update-hotel";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const LazyCreateHotel = lazy(() => import("./page/admin/create-hotel"));
const LazyHotelList = lazy(() => import("./page/admin/hotel-list"));
const LazyUpdateHotel = lazy(() => import("@/page/admin/update-hotel"));
const LazyCreateRoomCategory = lazy(() =>
  import("./page/admin/create-room-category")
);
const LazyRoomCategoryList = lazy(() =>
  import("./page/admin/room-category-list")
);

const LazyUpdateRoomCategory = lazy(() =>
  import("./page/admin/update-room-category")
);

const LazyCreateRoom = lazy(() => import("./page/admin/create-room"));
const LazyRoomList = lazy(() => import("./page/admin/room-list"));
const LazyBookingList = lazy(() => import("./page/admin/booking-list"));
const LazyHotelDetail = lazy(() => import("@/page/hotel-detail.page"));
const LazyBookingDetail = lazy(() => import("@/components/BookingDetail"));
const LazyPayment = lazy(() => import("@/page/payment"));
const LazyPaymentSuccess = lazy(() => import("@/page/payment-success"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<RootLayoutPage />}>
                <Route index element={<HomePage />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/hotels" element={<Hotel />} />
                <Route element={<ProtectLayout />}>
                  <Route path="/hotels/:_id" element={<LazyHotelDetail />} />

                  <Route element={<AdminProtectLayout />}>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route
                      path="/admin/create-hotel"
                      element={<LazyCreateHotel />}
                    />
                    <Route
                      path="/admin/hotel-list"
                      element={<LazyHotelList />}
                    />
                    <Route path="/admin/hotel/:id" element={<UpdateHotel />} />
                    <Route
                      path="/admin/hotel/create-category"
                      element={<LazyCreateRoomCategory />}
                    />
                    <Route
                      path="/admin/hotel/room-category-list"
                      element={<LazyRoomCategoryList />}
                    />
                    <Route
                      path="/admin/hotel/update-room-category/:id"
                      element={<LazyUpdateRoomCategory />}
                    />
                    <Route
                      path="/admin/hotel/create-room"
                      element={<LazyCreateRoom />}
                    />
                    <Route
                      path="/admin/hotel/room-list"
                      element={<LazyRoomList />}
                    />
                    <Route
                      path="/admin/bookings/booking-list"
                      element={<LazyBookingList />}
                    />
                  </Route>
                  <Route path="/bookings" element={<LazyBookingDetail />} />
                  <Route path="/payments" element={<LazyPayment />} />
                  <Route
                    path="/payments-success"
                    element={<LazyPaymentSuccess />}
                  />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </ClerkProvider>
  </StrictMode>
);
