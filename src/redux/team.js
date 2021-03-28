import api from "../api/api";
import {
  FETCH_TEAM_START,
  FETCH_TEAM_SUCCESS,
  FETCH_TEAM_FAILURE,
  FETCH_TEAM_MATCHES_FAILURE,
  FETCH_TEAM_MATCHES_START,
  FETCH_TEAM_MATCHES_SUCCESS,
} from "./actionTypes";

const initialState = {
  team: {},
  matches: [],
  matchesIsFetching: false
};

const team = (state = initialState, { type, payload }) => {
  switch (type) {

    case FETCH_TEAM_SUCCESS:
      return {
        ...state,
        team: {...payload}
      }

    case FETCH_TEAM_MATCHES_START:
      return {
        ...state,
        matchesIsFetching: true
      }

    case FETCH_TEAM_MATCHES_SUCCESS:
      return {
        ...state,
        matches: [...payload],
        matchesIsFetching: false
      };

    default:
      return state;
  }
};

export const fetchTeam = (teamId) => async (dispatch) => {
  dispatch({
    type: FETCH_TEAM_START,
  });
  try {
    const team = await api.getTeam(teamId);
    dispatch({
      type: FETCH_TEAM_SUCCESS,
      payload: team,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TEAM_FAILURE,
      payload: error,
      error: true,
    });
  }
};

export const fetchTeamMatches = (teamId, from, to) => async (dispatch) => {
  dispatch({
    type: FETCH_TEAM_MATCHES_START,
  });
  try {
    const matches = await api.getTeamMatches(teamId, from, to);
    dispatch({
      type: FETCH_TEAM_MATCHES_SUCCESS,
      payload: matches,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TEAM_MATCHES_FAILURE,
      payload: error,
      error: true,
    });
  }
};

export default team;
