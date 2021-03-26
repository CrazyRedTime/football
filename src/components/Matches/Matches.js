
import { Link} from "react-router-dom";
import styles from './Matches.module.scss';
import cn from 'classnames';

const Matches = ({matches}) => {

  return (
    <div>
      <h3>Матчи</h3>
      <table>
        <thead>
          <tr>
            <td>Дата</td>
            <td>Команды</td>
            <td>Счёт</td>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => {
            return (
              <tr key={match.id}>
                <td>
                  {(new Date (match.utcDate)).toLocaleString().slice(0, 17)}
                </td>
                <td>
                  <Link className={cn({[styles.winner]: match.score.winner === 'AWAY_TEAM'})} to={`/team/${match.awayTeam.id}`}>{match.awayTeam.name}</Link>
                  <span> - </span>
                  <Link className={cn({[styles.winner]: match.score.winner === 'HOME_TEAM'})} to={`/team/${match.homeTeam.id}`}>{match.homeTeam.name}</Link>
                </td>
                <td>{match.status === 'FINISHED' ? `${match.score.fullTime.awayTeam} : ${match.score.fullTime.homeTeam}` : 'нет информации'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
};

export default Matches;