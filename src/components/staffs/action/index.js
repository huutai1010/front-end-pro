import { API, fetch, process, uploadFile } from "../../../api";

export const SET_STAFFS_STATE = "SET_STAFFS_STATE";
export const ADD_STAFF_PROCESS = "ADD_STAFF_PROCESS";
export const REMOVE_STAFF_PROCESS = "REMOVE_STAFF_PROCESS";

export const ADD_STAFF = "ADD_STAFF";

const setState = (state) => ({
  type: SET_STAFFS_STATE,
  state,
});

export const getStaffs = (payload) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().staffs,
      dispatch,
      setState,
      "portal/users/operator",
      payload
    );
  };
};

export const getStaffDetails = async (staffId) => {
  try {
    const { data } = await API.get(`portal/users/operator/${staffId}`);
    return Promise.resolve(data.account);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const processStaff = (staff) => {
  return async (dispatch, getState) => {
    return process(
      getState().staffs,
      dispatch,
      setState,
      "portal/users/operator",
      staff
    );
  };
};

export const updateStaff = (staffId, staff) => {
  return async (dispatch, getState) => {
    const state = getState().staffs;
    if (state.isUpdating) {
      return Promise.reject(new Error("You are being updating.").message);
    }

    dispatch(setState({ isUpdating: true }));
    try {
      if (staff.image instanceof File) {
        let formData = new FormData();
        formData.append("file", staff.image);

        const { data } = await uploadFile(formData, "Account");
        staff.image = data.link;
      }

      const { data } = await API.put(`portal/users/staff/${staffId}`, staff);
      dispatch(setState({ isUpdating: false }));
      return Promise.resolve(data.account);
    } catch (e) {
      dispatch(setState({ isUpdating: false }));
      return Promise.reject(e);
    }
  };
};
