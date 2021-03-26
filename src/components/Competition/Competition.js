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
import styles from './Competition.module.scss';
import { useState } from "react";

const Competition = ({
  competition,
  seasons,
  match,
  location,
  fetchCompetition,
  fetchSeason,
  teams,
  currentSeasonStartDate,
  selectedSeasonStartDate,
  selectedSeasonEndDate,
}) => {
  useEffect(() => {
    fetchCompetition(match.params.competitionId);
  }, [match.params.competitionId, fetchCompetition]);
  
  const [currentSeason, setCurrentSeason] = useState(null);

  useEffect(() => {
    const search = queryString.parse(location.search);
    const season = search.season ? search.season : null;
    fetchSeason(match.params.competitionId, season);
    setCurrentSeason(season);
  }, [match.params.competitionId, location.search, fetchSeason]);




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
    <div className={styles.season}>
      {renderSidebar()}
      <h1>{competition.name}</h1>
      {selectedSeasonStartDate ? (
        currentSeasonStartDate === selectedSeasonStartDate ? (
            <h2>Текущий сезон</h2>
        ) : null
      ) : null}
      {selectedSeasonStartDate ? (
        <div className={styles.seasonDates}>
          <span>Начало сезона: {selectedSeasonStartDate}</span>
          <span>Конец сезона: {selectedSeasonEndDate}</span>
        </div>
      ) : null}
      <Link className={styles.teamtitle} to={`/matches?competitionId=${competition.id}${currentSeason ? `&season=${currentSeason}` : ''}`}>{`Посмотреть матчи ${competition.name}`}</Link>
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
