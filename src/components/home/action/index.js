import { fetch } from "../../../api";

export const SET_HOMEPAGE_STATE = "SET_HOMEPAGE_STATE";

const setState = (state) => ({
  type: SET_HOMEPAGE_STATE,
  state,
});

export const getTotalData = (values) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().homepage,
      dispatch,
      setState,
      "portal/charts/statictical",
      values
    );
  };
};

export const getOrdersData = (values) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().homepage,
      dispatch,
      setState,
      "portal/charts/order",
      values
    );
  };
};

export const getLanguagesData = () => {
  return async (dispatch, getState) => {
    return fetch(
      getState().homepage,
      dispatch,
      setState,
      "portal/charts/language"
    );
  };
};

export const getReveneData = (values) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().homepage,
      dispatch,
      setState,
      "portal/charts/booking",
      values
    );
  };
};

export const getTopPlace = (values) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().homepage,
      dispatch,
      setState,
      "portal/charts/top/place",
      values
    );
  };
};

export const getTotalDataAdmin = (values) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().homepage,
      dispatch,
      setState,
      "portal/charts/statictical/admin",
      values
    );
  };
};

export const getNationalRank = () => {
  return async (dispatch, getState) => {
    return fetch(
      getState().homepage,
      dispatch,
      setState,
      "portal/charts/national"
    );
  };
};

export const getUserData = (values) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().homepage,
      dispatch,
      setState,
      "portal/charts/user",
      values
    );
  };
};
