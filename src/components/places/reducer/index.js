import { SET_PLACES_STATE } from "../action";

const places = (
  state = { isFetching: false, items: [], details: [] },
  action
) => {
  switch (action.type) {
    case SET_PLACES_STATE:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
};

export default places;
