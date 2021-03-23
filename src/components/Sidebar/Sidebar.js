import { Link } from "react-router-dom"

const Sidebar = ({years, url}) => {
  return (
    <div>
      <ul>
        <li>
          <Link to={`${url}/all`}>Все годы</Link>
        </li>
        {years.map((year, index) => {
          return <li key={index}>
            <Link to={`${url}/${year}`}>{year}</Link>
          </li>
        })}
      </ul>
    </div>
  )
};

export default Sidebar;