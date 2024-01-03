import { SET_BOOKINGS_STATE } from "../action";

const bookings = (
  state = { isFetching: false, items: [], details: [] },
  action
) => {
  switch (action.type) {
    case SET_BOOKINGS_STATE:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
};

export default bookings;
