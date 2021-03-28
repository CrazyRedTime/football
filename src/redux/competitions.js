import api from "../api/api";
import { CHANGE_YEAR_IN_COMPETITIONS, FETCH_COMPETITIONS_FAILURE, FETCH_COMPETITIONS_START, FETCH_COMPETITIONS_SUCCESS } from "./actionTypes";


const initialState = {
  leagues: [],
  activeYear: null,
  isFetching: false
};

const competitions = (state = initialState, {type, payload}) => {
  switch (type) {

    case FETCH_COMPETITIONS_START:
      return {
        ...state,
        isFetching: true
      }

    case FETCH_COMPETITIONS_SUCCESS:
      return {
        ...state,
        leagues: [...payload],
        isFetching: false
      }

    case CHANGE_YEAR_IN_COMPETITIONS:
      return {
        ...state,
        activeYear: payload
      }

    default:
      return state;
  }
};

export const fetchEuropianCompetitions = () => async(dispatch) => {
  dispatch({
    type: FETCH_COMPETITIONS_START
  })
  try {
    const competitions = await api.getEuropianCompetitions();
    dispatch({
      type: FETCH_COMPETITIONS_SUCCESS,
      payload: competitions
    })
  } catch(error) {
    dispatch({
      type: FETCH_COMPETITIONS_FAILURE,
      payload: error,
      error: true
    })
  }
};

export const changeYear = (year) => (dispatch) => {
  const newActiveYear = year;

  dispatch({
    type: CHANGE_YEAR_IN_COMPETITIONS,
    payload: newActiveYear
  })
};

export default competitions;