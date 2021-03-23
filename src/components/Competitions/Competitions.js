import { connect } from "react-redux";
import {
  fetchEuropianCompetitions,
  changeYear,
} from "../../redux/competitions";
import { useEffect } from "react";
import { getCompetitions, getCompetitionsYears } from "../../redux/selectors";
import { Link, withRouter } from "react-router-dom";
import { compose } from "redux";
import queryString from 'query-string';
import styles from './Competitions.module.scss';

const Competitions = ({
  competitions,
  years,
  fetchEuropianCompetitions,
  changeYear,
  location
}) => {
  useEffect(() => {
    fetchEuropianCompetitions();
  }, [fetchEuropianCompetitions]);

  useEffect(() => {
    const search = queryString.parse(location.search);
    const season = search.season ? search.season : null;
    changeYear(season);
  }, [location.search, changeYear]);

  const renderSidebar = () => {
    return (
      <div>
      <ul>
        <li>
          <Link to={`/competitions`}>Все годы</Link>
        </li>
        {years.map((year, index) => {
          return <li key={index}>
            <Link to={`/competitions?season=${year}`}>{year}</Link>
          </li>
        })}
      </ul>
    </div>
    )
  }

  return (
    <div>
      {renderSidebar()}
      <table>
        <thead>
          <tr>
            <td>Название лиги</td>
            <td>Страна</td>
            <td>Начало</td>
            <td>Конец</td>
            <td>Победитель</td>
          </tr>
        </thead>
        <tbody>
          {competitions.map((competition) => {
            return (
              <tr key={competition.id}>
                <td>
                  <Link
                    to={`/competition/${competition.id}?season=${competition.currentSeason.startDate.slice(0,4)}`}
                  >
                    {competition.name}
                  </Link>
                </td>
                <td>
                  <span>{competition.area.name}</span>
                  {competition.area.ensignUrl ? (
                    <img className={styles.flag}
                      src={competition.area.ensignUrl}
                      alt={`flag of ${competition.area.name}`}
                    />
                  ) : null}
                </td>
                <td>{competition.currentSeason.startDate}</td>
                <td>{competition.currentSeason.endDate}</td>
                <td>
                  {competition.currentSeason.winner
                    ? competition.currentSeason.winner.name
                    : "Не определён"}
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
    competitions: getCompetitions(state),
    years: getCompetitionsYears(state),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, { fetchEuropianCompetitions, changeYear })
)(Competitions);
