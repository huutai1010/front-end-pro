import { API, fetch } from "../../../api";

export const SET_USERS_STATE = "SET_USERS_STATE";

const setState = (state) => ({
  type: SET_USERS_STATE,
  state,
});

export const getUsers = (payload) => {
  return async (dispatch, getState) => {
    return fetch(getState().users, dispatch, setState, "portal/users", payload);
  };
};

export const getUserDetails = async (userId) => {
  try {
    const { data } = await API.get(`portal/users/${userId}`);
    return Promise.resolve(data.account);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const changeState = async (api, userId) => {
  try {
    const { data } = await API.put(`${api}/${userId}`);
    return Promise.resolve(data);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
