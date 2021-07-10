export const LOADING = '/app/loading';
const defaultState = {
  loading: false
};
const appReducer = (state = defaultState, action) => {
  switch (action.type) {
    case LOADING:
      return Object.assign({}, state, {
        loading: action.payload.loading,
      });
    default:
      return state;
  }
};
export default appReducer;
