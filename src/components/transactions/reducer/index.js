import { SET_TRANSACTIONS_STATE } from "../action";

const transactions = (
  state = { isFetching: false, items: [], details: [] },
  action
) => {
  switch (action.type) {
    case SET_TRANSACTIONS_STATE:
      return {
        ...state,
        ...action.state,
      };

    default:
      return state;
  }
};

export default transactions;
