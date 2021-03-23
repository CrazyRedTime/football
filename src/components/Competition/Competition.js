import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import { compose } from "redux";
import {
  fetchCompetition,
  fetchSeason,
  fetchSeasonMatches,
  changeSeason,
} from "../../redux/competition";
import {
  getCompetition,
  getCurrentCompetitionYears,
  getCurrentSeasonStartDate,
  getSelectedSeasonStartDate,
  getSelectedSeasonEndDate,
  getSelectedSeasonYear,
  getTeams,
  getSelectedSeasonMatches,
} from "../../redux/selectors";
import queryString from "query-string";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import Matches from "../Matches/Matches";
import styles from './Competition.module.scss';

const Competition = ({
  competition,
  seasons,
  match,
  location,
  fetchCompetition,
  fetchSeason,
  fetchSeasonMatches,
  teams,
  currentSeasonStartDate,
  selectedSeasonStartDate,
  selectedSeasonEndDate,
  matches
}) => {
  useEffect(() => {
    fetchCompetition(match.params.competitionId);
  }, [match.params.competitionId, fetchCompetition]);

  useEffect(() => {
    const search = queryString.parse(location.search);
    const season = search.season ? search.season : null;
    fetchSeason(match.params.competitionId, season);
  }, [match.params.competitionId, location.search, fetchSeason]);

  const [fromDate, changeFromDate] = useState("");
  const [toDate, changeToDate] = useState("");

  useEffect(() => {
    changeFromDate(
      queryString.parse(location.search).from
        ? queryString.parse(location.search).from
        : selectedSeasonStartDate
    );
    changeToDate(
      queryString.parse(location.search).to
        ? queryString.parse(location.search).to
        : selectedSeasonEndDate
    );
  }, [
    location.search,
    selectedSeasonStartDate,
    selectedSeasonEndDate,
    changeFromDate,
    changeToDate,
  ]);

  useEffect(() => {
    const search = queryString.parse(location.search);
    const season = search.season;
    const from = search.from;
    const to = search.to;
    fetchSeasonMatches(match.params.competitionId, season, from, to);
  }, [match.params.competitionId, location.search, fetchSeasonMatches]);

  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const search = queryString.parse(location.search);
    const season = search.season;
    history.push(
      `/competition/${competition.id}?season=${season}&from=${fromDate}&to=${toDate}`
    );
  };

  const renderSidebar = () => {
    return (
      <div>
        <ul className='nav'>
          {seasons.map((year, index) => {
            return (
              <li key={index}>
                <Link to={`/competition/${competition.id}?season=${year}`}>
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
      <form className={styles.formDate} onSubmit={(e) => handleSubmit(e)}>
        <input
          type="date"
          value={fromDate}
          min={selectedSeasonStartDate}
          max={toDate}
          onChange={(e) => changeFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          min={fromDate}
          max={selectedSeasonEndDate}
          onChange={(e) => changeToDate(e.target.value)}
        />
        <button>Показать</button>
      </form>
      {renderSidebar()}
      {selectedSeasonStartDate ? (
        currentSeasonStartDate === selectedSeasonStartDate ? (
          <div>
            <h2>Текущий сезон</h2>
          </div>
        ) : null
      ) : null}
      {selectedSeasonStartDate ? (
        <div>
          <span>Начало сезона: {selectedSeasonStartDate}</span>Конец сезона:{" "}
          {selectedSeasonEndDate}
          <span></span>
        </div>
      ) : null}
      <table>
        <thead>
          <tr>
            <td>Название команды</td>
            <td>Герб</td>
            <td>Год основания</td>
            <td>Сайт</td>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => {
            return (
              <tr key={team.id}>
                <td>
                  <Link to={`/team/${team.id}`}>{team.shortName}</Link>
                </td>
                <td>
                  {team.crestUrl ? (
                    <img className={styles.flag}
                      src={team.crestUrl}
                      alt={`flag of ${team.shortName}`}
                    />
                  ) : (
                    "нет инфрмации"
                  )}
                </td>
                <td>{team.founded ? team.founded : "нет информации"}</td>
                <td>
                  {team.website ? (
                    <a href={team.website} target="_blank" rel="noreferrer">
                      {team.website}
                    </a>
                  ) : (
                    "нет иформации"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Matches matches={matches} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    competition: getCompetition(state),
    seasons: getCurrentCompetitionYears(state),
    teams: getTeams(state),
    currentSeasonStartDate: getCurrentSeasonStartDate(state),
    selectedSeasonStartDate: getSelectedSeasonStartDate(state),
    selectedSeasonEndDate: getSelectedSeasonEndDate(state),
    season: getSelectedSeasonYear(state),
    matches: getSelectedSeasonMatches(state)
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, {
    fetchCompetition,
    fetchSeason,
    fetchSeasonMatches,
    changeSeason,
  })
)(Competition);
