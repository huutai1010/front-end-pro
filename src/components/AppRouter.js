import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CssBaseline } from "@mui/material";

import { getProfile } from "./auth/action";

import Layout from "./common/Layout";
import Login from "./login";
import HomePage from "./home";
import ManageTours from "./tours";
import TourDetails from "./tours/details";
import CreateNewTour from "./tours/create";
import ManagePlaces from "./places";
import PlaceDetails from "./places/details";
import AddPlace from "./places/add";
import ImportPlaces from "./places/import";
import ManageBookings from "./bookings";
import BookingDetails from "./bookings/details";
import ManageFeedbacks from "./feedbacks";
import { FeedbackDetails } from "./feedbacks/details";
import ManageTransactions from "./transactions";
import TransactionDetails from "./transactions/details";
import Profile from "./auth";

import ManageUsers from "./users";
import UserDetails from "./users/details";
import ManageStaffs from "./staffs";
import StaffDetails from "./staffs/details";
import ManageCategories from "./categories";
import CategoryDetails from "./categories/details";
import ManageLanguages from "./languages";
import LanguageDetails from "./languages/details";

import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

const AppRouter = () => {
  const state = useSelector((state) => state.auth);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      await dispatch(getProfile());
    }
    setIsFetching(false);
    fetchData();
  }, [dispatch]);

  if (isFetching) {
    return <div />;
  }

  if (!state.profile) {
    return (
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Navigate to="/" />} />
            <Route path="/" element={<Login />} exact />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }

  if (state.profile.roleName === "Moderator") {
    return (
      <div className="app">
        <BrowserRouter>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/*" element={<Navigate to="/dashboard" />} exact />
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/itineraries" element={<ManageTours />} />
              <Route path="/itineraries/details" element={<TourDetails />} />
              <Route path="/itineraries/create" element={<CreateNewTour />} />
              <Route path="/places/" element={<ManagePlaces />} />
              <Route path="/places/details" element={<PlaceDetails />} />
              <Route path="/places/add" element={<AddPlace />} />
              <Route path="/places/import" element={<ImportPlaces />} />
              <Route path="/bookings" element={<ManageBookings />} />
              <Route path="/bookings/details" element={<BookingDetails />} />
              <Route path="/feedbacks" element={<ManageFeedbacks />} />
              <Route path="/feedbacks/details" element={<FeedbackDetails />} />
              <Route path="/bookings/details" element={<BookingDetails />} />
              <Route path="/transactions" element={<ManageTransactions />} />
              <Route
                path="/transactions/details"
                element={<TransactionDetails />}
              />
              <Route path="/settings" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
  } else if (state.profile.roleName === "Administrator") {
    return (
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/*" element={<Navigate to="/dashboard" />} exact />
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/users" element={<ManageUsers />} />
              <Route path="/users/details" element={<UserDetails />} />
              <Route path="/moderators" element={<ManageStaffs />} />
              <Route path="/moderators/details" element={<StaffDetails />} />
              <Route path="/categories" element={<ManageCategories />} />
              <Route path="/categories/details" element={<CategoryDetails />} />
              <Route path="/languages" element={<ManageLanguages />} />
              <Route path="/languages/details" element={<LanguageDetails />} />
              <Route path="/settings" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
  } else {
    return (
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Navigate to="/" />} />
            <Route path="/" element={<Login />} exact />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
};

export default AppRouter;
