import { SET_USERS_STATE } from "../action";

const users = (
  state = { isFetching: false, items: [], details: [] },
  action
) => {
  switch (action.type) {
    case SET_USERS_STATE:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
};

export default users;
