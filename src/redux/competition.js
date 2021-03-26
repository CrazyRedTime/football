import {
  FETCH_COMPETITION_START,
  FETCH_COMPETITION_SUCCESS,
  FETCH_COMPETITION_FAILURE,
  FETCH_SEASON_SUCCESS,
  FETCH_SEASON_START,
  FETCH_SEASON_FAILURE,
  FETCH_SEASON_MATCHES_START,
  FETCH_SEASON_MATCHES_SUCCESS,
  FETCH_SEASON_MATCHES_FAILURE,
  CHANGE_SEASON_IN_COMPETITION,
} from "./actionTypes";
import api from "../api/api";

const initialState = {
  league: {},
  season: {
    teams: [],
  },
  activeYear: null,
  matches: [],
};

const competition = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_COMPETITION_SUCCESS:
      return {
        ...state,
        league: { ...payload },
      };

    case FETCH_SEASON_SUCCESS:
      return {
        ...state,
        season: { ...payload },
      };

    case FETCH_SEASON_MATCHES_SUCCESS:
      return {
        ...state,
        matches: [...payload]
      }

    case CHANGE_SEASON_IN_COMPETITION:
      return {
        ...state,
        activeYear: payload
      }

    default:
      return state;
  }
};

export const fetchCompetition = (leagueId) => async (dispatch) => {
  dispatch({
    type: FETCH_COMPETITION_START,
  });
  try {
    const competition = await api.getCompetition(leagueId);
    dispatch({
      type: FETCH_COMPETITION_SUCCESS,
      payload: competition,
    });
  } catch (error) {
    dispatch({
      type: FETCH_COMPETITION_FAILURE,
      payload: error,
      error: true,
    });
  }
};

export const fetchSeason = (leagueId, year) => async (dispatch) => {
  dispatch({
    type: FETCH_SEASON_START,
  });
  try {
    const season = await api.getSeason(leagueId, year);
    dispatch({
      type: FETCH_SEASON_SUCCESS,
      payload: season,
    });
  } catch (error) {
    dispatch({
      type: FETCH_SEASON_FAILURE,
      payload: error,
      error: true,
    });
  }
};

export const fetchSeasonMatches = (leagueId, year, dateFrom, dateTo) => async (dispatch) => {
  dispatch({
    type: FETCH_SEASON_MATCHES_START,
  });
  try {
    const matches = await api.getSeasonMatches(leagueId, year, dateFrom, dateTo);
    dispatch({
      type: FETCH_SEASON_MATCHES_SUCCESS,
      payload: matches,
    });
  } catch (error) {
    dispatch({
      type: FETCH_SEASON_MATCHES_FAILURE,
      payload: error,
      error: true,
    });
  }
};

export const changeSeason = (year) => (dispatch) => {
  const newActiveYear = year;

  dispatch({
    type: CHANGE_SEASON_IN_COMPETITION,
    payload: newActiveYear
  })
};



export default competition;
