
import { Link} from "react-router-dom";
import cn from 'classnames';
import { useState } from "react";
import Pagination from "react-js-pagination";

import styles from './Matches.module.scss';
import { useEffect } from "react/cjs/react.development";

const Matches = ({matches}) => {

  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [slice, setSlice] = useState([]);

  const itemsPerPage = 13;

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
    setOffset((pageNumber - 1) * itemsPerPage);
  };

  useEffect(() => {
    setSlice(matches.slice(offset, offset + itemsPerPage))
  }, [offset, matches])

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
          {slice.map((match) => {
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
      {matches.length > itemsPerPage && <Pagination
      innerClass={styles.pagination}
      activeLinkClass={styles.activeItem}
      itemClass={styles.paginationItem}
      linkClass={styles.paginationLink}
      activePage={currentPage}
      itemsCountPerPage={itemsPerPage}
      totalItemsCount={matches.length}
      pageRangeDisplayed={5}
      onChange={changePage}
      hideDisabled={true}
      />}
    </div>
  )
};

export default Matches;