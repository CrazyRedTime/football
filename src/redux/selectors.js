export const getCompetitions = (state) => {
  const competitions = state.competitions.leagues;

  if (state.competitions.activeYear) {
    return competitions.filter((competition) => {
      if (competition.currentSeason) {
        return competition.currentSeason.startDate.includes(
          state.competitions.activeYear
        );
      }
      return false;
    });
  }
  return competitions;
};

export const getCompetitionsYears = (state) => {
  const result = [];
  state.competitions.leagues.forEach((competition) => {
    if (competition.currentSeason) {
      const year = competition.currentSeason.startDate.slice(0, 4);
      if (result.indexOf(year) === -1) {
        result.push(year);
      }
    }
  });
  return result.sort((a, b) => {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  });
};

export const getCompetition = (state) => {
  return state.competition.league;
};

const availableSeasons = ["2018", "2019", "2020", "2021"];

export const getCurrentCompetitionYears = (state) => {
  const result = [];
  if (state.competition.league.seasons) {
    state.competition.league.seasons.forEach((season) => {
      const year = season.startDate.slice(0, 4);
      if (result.indexOf(year) === -1 && availableSeasons.includes(year)) {
        result.push(year);
      }
    });
  }
  return result.sort((a, b) => {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  });
};

export const getSelectedSeasonYear = (state) => {
  return state.competition.activeYear;
};

export const getTeams = (state) => {
  const result = [];
  if (state.competition.season.teams) {
    return state.competition.season.teams.sort((a, b) => {
      if (a.shortName > b.shortName) {
        return 1;
      }
      if (a.shortName < b.shortName) {
        return -1;
      }
      return 0;
    });
  }
  return result;
};

export const getCurrentSeasonStartDate = (state) => {
  if (state.competition.league.currentSeason) {
    return state.competition.league.currentSeason.startDate;
  }
};

export const getSelectedSeasonStartDate = (state) => {
  if (state.competition.season.season) {
    return state.competition.season.season.startDate;
  }
  return '';
};

export const getSelectedSeasonEndDate = (state) => {
  if (state.competition.season.season) {
    return state.competition.season.season.endDate;
  }
  return '';
};

export const getSelectedSeasonMatches = (state) => {
  return state.competition.matches ? state.competition.matches : []; 
};

export const getTeamFromState = (state) => {
  return state.team.team;
};

export const getTeamMatchesFromState = (state) => {
  return state.team.matches;
};

export const getCompetitionName = (state) => {
  return state.competition.season.competition.name;
};

export const getCompetitionId = (state) => {
  return state.competition.season.competition ? state.competition.season.competition.id : 0;
};