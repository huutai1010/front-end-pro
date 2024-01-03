import { LOG_OUT, SET_PROFILE_STATE, UPDATE_PROFILE } from "../action";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const auth = (
  state = {
    shouldFetch: true,
    isLoggingIn: false,
    profile: null,
    isUpdating: false,
  },
  action
) => {
  switch (action.type) {
    case SET_PROFILE_STATE:
      return {
        ...state,
        ...action.state,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: { ...state.profile, ...action.updates },
      };

    case LOG_OUT:
      cookies.set("profile", null, { path: "/" });
      return {
        ...state,
        profile: null,
      };

    default:
      return state;
  }
};

export default auth;
