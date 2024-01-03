import { SET_CATEGORIES_STATE } from "../action";

const categories = (
  state = { isFetching: false, items: [], details: [] },
  action
) => {
  switch (action.type) {
    case SET_CATEGORIES_STATE:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
};

export default categories;
