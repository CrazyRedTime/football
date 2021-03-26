import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import { compose } from "redux";
import {
  getTeamFromState,
  getTeamMatchesFromState,
} from "../../redux/selectors";
import { fetchTeam } from "../../redux/team";
import styles from './Team.module.scss';
import {availableCompetitions} from '../../api/api'

const Team = ({ team, match, fetchTeam }) => {
  useEffect(() => {
    fetchTeam(match.params.teamId);
  }, [match.params.teamId, fetchTeam]);

  return (
    <div>
      <div className={styles.title}>
        <span className={styles.name}>{team.name}</span>
        <img className={styles.flag} src={team.crestUrl} alt={team.name} />
      </div>
      <div>
        <div>
          <h2>Вебсайт:</h2>
          <a href={team.website} target="_blank" rel="noreferrer">{team.website}</a>
        </div>
        <div>
          <h2>Участвует в лигах:</h2>
          <ul>
            {team.activeCompetitions ? team.activeCompetitions.map((competition, index) => {
              return (
                <li key={index}>
                  {availableCompetitions.includes(competition.id) ? <Link to={`/competition/${
                        competition.id
                      }`}>{competition.name}</Link> : <span>{competition.name}</span>}
                </li>
              )
            }) : null}
          </ul>
        </div>
      </div>
      <Link to={`/matches?teamId=${team.id}`}>Календарь матчей</Link>
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
  connect(mapStateToProps, {fetchTeam})
)(Team);
