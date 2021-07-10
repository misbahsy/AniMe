import {LOADING} from '../reducers/app';

export const loading = (loading) => {
  return async (dispatch) => {
    dispatch({
      type: LOADING,
      payload: {loading},
    });
  }
}


