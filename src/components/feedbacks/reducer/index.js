import { SET_FEEDBACKS_STATE } from "../action";

const feedbacks = (
  state = { isFetching: false, items: [], details: [] },
  action
) => {
  switch (action.type) {
    case SET_FEEDBACKS_STATE:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
};

export default feedbacks;
