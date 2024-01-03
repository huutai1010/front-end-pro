import {
  SET_STAFFS_STATE,
  ADD_STAFF_PROCESS,
  REMOVE_STAFF_PROCESS,
} from "../action";

const staffs = (
  state = { isFetching: false, isUpdating: false, items: [], details: [] },
  action
) => {
  switch (action.type) {
    case SET_STAFFS_STATE:
      return {
        ...state,
        ...action.state,
      };
    case ADD_STAFF_PROCESS:
      return {
        ...state,
        processings: [...state.processings, action.identifier],
      };
    case REMOVE_STAFF_PROCESS:
      return {
        ...state,
        processings: state.processings.filter(
          (processing) => processing !== action.identifier
        ),
      };

    default:
      return state;
  }
};

export default staffs;
