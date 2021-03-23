import { useState } from "react";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router";
import { useEffect } from "react/cjs/react.development";
import { compose } from "redux";
import {
  getTeamFromState,
  getTeamMatchesFromState,
} from "../../redux/selectors";
import { fetchTeamMatches, fetchTeam } from "../../redux/team";
import Matches from "../Matches/Matches";
import queryString from "query-string";
import styles from './Team.module.scss';

const Team = ({ team, matches, match, location, fetchTeamMatches, fetchTeam }) => {
  useEffect(() => {
    fetchTeam(match.params.teamId);
  }, [match.params.teamId, fetchTeam]);

  let history = useHistory();

  const [fromDate, changeFromDate] = useState('');
  const [toDate, changeToDate] = useState('');

  useEffect(() => {
    const search = queryString.parse(location.search);
    console.log(search);
    const from = search.dateFrom;
    const to = search.dateTo;
    fetchTeamMatches(match.params.teamId, from, to);
  }, [match.params.teamId, fetchTeamMatches, location.search]);

  useEffect(() => {
    changeFromDate(
      queryString.parse(location.search).dateFrom
        ? queryString.parse(location.search).dateFrom
        : ''
    );
    changeToDate(
      queryString.parse(location.search).dateTo
        ? queryString.parse(location.search).dateTo
        : ''
    );
  }, [
    location.search,
    changeFromDate,
    changeToDate,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/team/${team.id}/matches?dateFrom=${fromDate}&dateTo=${toDate}`)
  }

  const setRange = (date, operation) => {
    let result = new Date(date);
    if (operation === 'add') {
      result.setDate(result.getDate() + 750);
    } else if (operation === 'reduce') {
      result.setDate(result.getDate() - 750);
    }
    return result.toISOString().slice(0, 10);
  }

  return (
    <div>
      <div className={styles.title}>
        <span className={styles.name}>{team.name}</span>
        <img className={styles.flag} src={team.crestUrl} alt={team.name} />
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="date"
          value={fromDate}
          min={toDate ? setRange(toDate, 'reduce') : ''}
          max={toDate}
          required
          onChange={(e) => changeFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          min={fromDate}
          max={fromDate ? setRange(fromDate, 'add') : ''}
          required
          onChange={(e) => changeToDate(e.target.value)}
        />
        <button>Показать</button>
      </form>
      <Matches matches={matches}/>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    team: getTeamFromState(state),
    matches: getTeamMatchesFromState(state),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { fetchTeamMatches, fetchTeam })
)(Team);
