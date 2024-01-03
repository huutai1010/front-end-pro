import { API, fetch } from "../../../api";

export const SET_FEEDBACKS_STATE = "SET_FEEDBACKS_STATE";

const setState = (state) => ({
  type: SET_FEEDBACKS_STATE,
  state,
});

export const getFeedbacks = (payload) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().bookings,
      dispatch,
      setState,
      "portal/feedbacks",
      payload
    );
  };
};

export const getFeedbackDetails = async (feedbackId) => {
  try {
    const { data } = await API.get(`portal/feedbacks/detail/${feedbackId}`);
    return Promise.resolve(data.feedback);
  } catch (e) {
    return Promise.reject(e);
  }
};
