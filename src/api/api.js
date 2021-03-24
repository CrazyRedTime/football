import * as axios from 'axios';

const template = axios.create({
  baseURL: 'https://api.football-data.org/v2/',
  headers: {
    'X-Auth-Token': '10ad2d27ae9546648227d3674048f5b9',
  }
})

const availableCompetitions = [2000,2001,2002,2003,2013,2014,2015,2016,2017,2018,2019,2021];

const getEuropianCompetitions = async () => {
  const response = await template.get(`competitions?areas=2077`);
  return response.data.competitions.filter(competition => availableCompetitions.includes(competition.id));
};

const getCompetition = async (leagueId) => {
  const response = await template.get(`competitions/${leagueId}`);
  return response.data;
};

const getSeason = async (leagueId, season) => {
  const response = await template.get(`competitions/${leagueId}/teams${season ? `${`?season=${season}`}` : ''}`);
  return response.data;
};

const getSeasonMatches = async (leagueId, season, dateFrom, dateTo) => {
  const response = await template.get(`/competitions/${leagueId}/matches${season ? `${`?season=${season}`}` : ''}${dateFrom ? `${`&dateFrom=${dateFrom}`}` : ''}${dateTo ? `${`&dateTo=${dateTo}`}` : ''}`);
  return response.data.matches;
};

const getTeam = async (teamId) => {
  const response = await template.get(`/teams/${teamId}`);
  return response.data;
}

const getTeamMatches = async (teamId, from, to) => {
  console.log(from);
  console.log(to);
  const response = await template.get(`/teams/${teamId}/matches${from ? `?${`dateFrom=${from}&dateTo=${to}`}` : ''}`);
  return response.data.matches;
};

const api = {
  getEuropianCompetitions,
  getCompetition,
  getSeason,
  getSeasonMatches,
  getTeamMatches,
  getTeam
};

export default api;