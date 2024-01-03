import { API, fetch, process, uploadFile } from "../../../api";

export const SET_LANGUAGES_STATE = "SET_LANGUAGES_STATE";
export const GET_LANGUAGES_CODE = "GET_LANGUAGES_CODE";

const setState = (state) => ({
  type: SET_LANGUAGES_STATE,
  state,
});

const getState = () => ({
  type: GET_LANGUAGES_CODE,
});

export const getLanguages = (payload) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().languages,
      dispatch,
      setState,
      "portal/languages",
      payload
    );
  };
};

export const getAllLanguages = (payload) => {
  return async (dispatch, getState) => {
    return fetch(
      getState().languages,
      dispatch,
      setState,
      "languages",
      payload
    );
  };
};

export const getLanguageDetails = async (languageId) => {
  try {
    const { data } = await API.get(`languages/${languageId}`);
    return Promise.resolve(data.language);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getLanguageCode = async () => {
  try {
    if (getState.languagesCode !== undefined) {
      return Promise.resolve(getState.languagesCode);
    }
    setState({ isFetching: true });
    const { data } = await API.get("portal/nationalities");
    setState({ isFetching: false, languageCode: data.nationalities });
    return Promise.resolve(data.nationalities);
  } catch (e) {
    setState({ isFetching: false });
    return Promise.reject(e);
  }
};

export const processLanguage = (language) => {
  return async (dispatch, getState) => {
    return process(
      getState().languages,
      dispatch,
      setState,
      "languages",
      language
    );
  };
};

export const updateLanguage = async (languageId, values) => {
  try {
    if (values.fileLink instanceof File) {
      let formData = new FormData();
      formData.append("file", values.fileLink);

      const { data } = await uploadFile(formData, "Language/FileTranslate");
      values.fileLink = data.link;
    }

    const { data } = await API.put(`portal/languages/${languageId}`, values);
    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const changeLanguageState = async (languageId, value) => {
  try {
    const { data } = await API.put(
      `portal/languages/changestatus/${languageId}`,
      null,
      { params: value }
    );
    return Promise.resolve(data);
  } catch (e) {
    return Promise.reject(e);
  }
};
