import { GET_LANGUAGES_CODE, SET_LANGUAGES_STATE } from "../action";

const languages = (
  state = { isFetching: false, items: [], details: [], languagesCode: [] },
  action
) => {
  switch (action.type) {
    case SET_LANGUAGES_STATE:
      return {
        ...state,
        ...action.state,
      };
    case GET_LANGUAGES_CODE:
      return state;

    default:
      return state;
  }
};

export default languages;
