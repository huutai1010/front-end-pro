import { SET_TOURS_STATE } from "../action";

const tours = (state = { isFetching: false, items: [] }, action) => {
  switch (action.type) {
    case SET_TOURS_STATE:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
};

export default tours;
