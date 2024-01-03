import { API, fetch, process } from "../../../api";

export const SET_CATEGORIES_STATE = "SET_CATEGORIES_STATE";

export const ADD_CATEGORIE = "ADD_CATEGORIE";

const setState = (state) => ({
  type: SET_CATEGORIES_STATE,
  state,
});

export const getCategories = (payload) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().categories,
      dispatch,
      setState,
      "portal/categories",
      payload
    );
  };
};

export const getCategoriesAll = (payload) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().categories,
      dispatch,
      setState,
      "portal/categories/all",
      payload
    );
  };
};

export const getCategoryDetails = async (categoryId) => {
  try {
    const { data } = await API.get(`portal/categories/${categoryId}`);
    return Promise.resolve(data.category);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};

export const processCategory = (category) => {
  return async (dispatch, getState) => {
    return process(
      getState().categories,
      dispatch,
      setState,
      "portal/categories",
      category
    );
  };
};

export const updateCategory = async (categoryId, values) => {
  try {
    const { data } = await API.put(`portal/categories/${categoryId}`, values);
    return Promise.resolve(data);
  } catch (e) {
    console.log(e);
    return Promise.reject(e);
  }
};
