import { API, fetch } from "../../../api";

export const SET_BOOKINGS_STATE = "SET_BOOKINGS_STATE";

const setState = (state) => ({
  type: SET_BOOKINGS_STATE,
  state,
});

export const getBookings = (payload) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().bookings,
      dispatch,
      setState,
      "portal/bookings",
      payload
    );
  };
};

export const getBookingDetails = async (bookingId) => {
  try {
    const { data } = await API.get(`portal/bookings/${bookingId}`);
    return Promise.resolve(data.booking);
  } catch (e) {
    return Promise.reject(e);
  }
};
