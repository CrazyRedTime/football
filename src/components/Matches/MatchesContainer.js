import { useState } from "react";
import { connect } from "react-redux";
import { useHistory, withRouter } from "react-router";
import { useEffect } from "react/cjs/react.development";
import { compose } from "redux";
import {
  fetchCompetition,
  fetchSeason,
  fetchSeasonMatches,
} from "../../redux/competition";
import { fetchTeamMatches, fetchTeam } from "../../redux/team";
import {
  getCompetition,
  getCurrentCompetitionYears,
  getSelectedSeasonStartDate,
  getSelectedSeasonEndDate,
  getSelectedSeasonMatches,
  getTeamMatchesFromState,
  getCompetitionId,
  getTeamFromState,
} from "../../redux/selectors";
import queryString from "query-string";

import styles from "./Matches.module.scss";
import Matches from "./Matches";
import { Link } from "react-router-dom";

const CompetitionMatches = ({
  competition,
  selectedSeasonStartDate,
  selectedSeasonEndDate,
  seasonMatches,
  teamMatches,
  location,
  fetchSeason,
  fetchSeasonMatches,
  fetchTeamMatches,
  fetchCompetition,
  fetchTeam,
  seasons,
  competitionId,
  team,
}) => {
  const [fromDate, changeFromDate] = useState("");
  const [toDate, changeToDate] = useState("");
  const [matches, changeMatches] = useState([]);
  const [locationSearch, changeLocationSearch] = useState({});
  const [fromMinValue, setFromMinValue] = useState("");
  const [fromMaxValue, setFromMaxValue] = useState("");
  const [toMinValue, setToMinValue] = useState("");
  const [toMaxValue, setToMaxValue] = useState("");

  useEffect(() => {
    const search = queryString.parse(location.search);
    changeLocationSearch(search);
  }, [location.search]);

  useEffect(() => {
    const from = locationSearch.from ? locationSearch.from : "";
    const to = locationSearch.to ? locationSearch.to : "";
    if (locationSearch.competitionId) {
      const season = locationSearch.season;
      fetchSeason(locationSearch.competitionId, season);
      fetchSeasonMatches(locationSearch.competitionId, season, from, to);
    }
    if (locationSearch.teamId) {
      fetchTeam(locationSearch.teamId);
      fetchTeamMatches(locationSearch.teamId, from, to);
    }
    changeFromDate(from);
    changeToDate(to);
  }, [
    locationSearch,
    changeFromDate,
    changeToDate,
    fetchSeason,
    fetchSeasonMatches,
    fetchTeam,
    fetchTeamMatches,
  ]);

  useEffect(() => {
    if (locationSearch.competitionId && !Object.keys(competition).length) {
      fetchCompetition(locationSearch.competitionId);
    }
  }, [competition, fetchCompetition, locationSearch.competitionId]);

  useEffect(() => {
    if (locationSearch.competitionId) {
      changeMatches(seasonMatches);
    }
    if (locationSearch.teamId) {
      changeMatches(teamMatches);
    }
  }, [locationSearch, changeMatches, seasonMatches, teamMatches]);

  useEffect(() => {
    if (locationSearch.competitionId) {
      setFromMinValue(selectedSeasonStartDate);
      setFromMaxValue(toDate ? toDate : selectedSeasonEndDate);
      setToMinValue(fromDate ? fromDate : selectedSeasonStartDate);
      setToMaxValue(selectedSeasonEndDate);
    }
    if (locationSearch.teamId) {
      setFromMinValue(toDate ? setRange(toDate, "reduce", 750) : "");
      setFromMaxValue(toDate);
      setToMinValue(fromDate);
      setToMaxValue(fromDate ? setRange(fromDate, "add", 750) : "");
    }
  }, [
    locationSearch.competitionId,
    locationSearch.teamId,
    setFromMinValue,
    setFromMaxValue,
    setToMinValue,
    setToMaxValue,
    fromDate,
    toDate,
    selectedSeasonStartDate,
    selectedSeasonEndDate,
  ]);

  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const search = queryString.parse(location.search);
    search.from = fromDate;
    search.to = toDate;
    history.push(`${location.pathname}?${queryString.stringify(search)}`);
  };

  const setRange = (date, operation, range) => {
    let result = new Date(date);
    if (operation === "add") {
      result.setDate(result.getDate() + range);
    } else if (operation === "reduce") {
      result.setDate(result.getDate() - range);
    }
    return result.toISOString().slice(0, 10);
  };

  const renderSidebar = () => {
    return (
      <div>
        <ul className="nav">
          {seasons.map((year, index) => {
            return (
              <li key={index}>
                <Link
                  to={`/matches?competitionId=${competitionId}&season=${year}`}
                >
                  {year}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div>
      {locationSearch.competitionId && (
        <div className={styles.competitionTitle}>
          {renderSidebar()}
          <span className={styles.name}>{competition.name}</span>
          <div>
          <span>Начало сезона: {selectedSeasonStartDate}</span>
          <span>Конец сезона: {selectedSeasonEndDate}</span>
          </div>
        </div>
      )}
      {locationSearch.teamId && (
        <div className={styles.title}>
          <span className={styles.name}>{team.name}</span>
          <img className={styles.flag} src={team.crestUrl} alt={team.name} />
        </div>
      )}
      <form className={styles.formDate} onSubmit={(e) => handleSubmit(e)}>
        <input
          type="date"
          value={fromDate}
          min={fromMinValue}
          max={fromMaxValue}
          required
          onChange={(e) => changeFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          min={toMinValue}
          max={toMaxValue}
          required
          onChange={(e) => changeToDate(e.target.value)}
        />
        <button>Показать</button>
      </form>
      <Matches matches={matches} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    competition: getCompetition(state),
    seasons: getCurrentCompetitionYears(state),
    selectedSeasonStartDate: getSelectedSeasonStartDate(state),
    selectedSeasonEndDate: getSelectedSeasonEndDate(state),
    seasonMatches: getSelectedSeasonMatches(state),
    teamMatches: getTeamMatchesFromState(state),
    competitionId: getCompetitionId(state),
    team: getTeamFromState(state),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, {
    fetchCompetition,
    fetchSeason,
    fetchSeasonMatches,
    fetchTeamMatches,
    fetchTeam,
  })
)(CompetitionMatches);
