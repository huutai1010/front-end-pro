import { SET_HOMEPAGE_STATE } from "../action";

const homepage = (
  state = {
    isFetching: false,
    items: {},
  },
  action
) => {
  switch (action.type) {
    case SET_HOMEPAGE_STATE:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
};

export default homepage;
