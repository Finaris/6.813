var userLists = getMyListsData();
var dom = {};

Util.events(document, {
  // This runs when the DOM is ready.
  "DOMContentLoaded": function() {

    initStatsPageDOM();

  },
});

function initStatsPageDOM() {
  dom.totalShows = Util.one('#total-shows');
  dom.completedShows = Util.one('#completed-shows');
  dom.totalEpisodes = Util.one('#total-episodes');
  dom.completedEpisodes = Util.one('#completed-episodes');
  dom.totalHours = Util.one('#total-hours');
  dom.completedHours = Util.one('#completed-hours');
  dom.avgEpisodesPerWeek = Util.one('#avg-episodes-per-week');
  dom.avgHoursPerWeek = Util.one('#avg-hours-per-week');
  dom.favoriteGenre = Util.one('#favorite-genre');
  dom.favoriteActor = Util.one('#favorite-actor');
  dom.metaAvgOverallRating = Util.one('#meta-avg-rating');
  dom.yourAvgOverallRating = Util.one('#your-avg-rating');

  let shows = userLists["All Dramas"];
  let genreCounts = getGenreCountDict(shows);
  let stats = getStatsData(shows, genreCounts);
  initBarChart(genreCounts);

  for (var key in stats) {
    dom[key].textContent = stats[key];
  }

  let currList = Util.getURLParam("list");
  //TODO Make sure user can't screw around with this (i.e. put in name of list that doesn't exist)

  if(currList !== null) {
    applyStatsFilter(currList);
  }
}

function updateStatsPage(data) {
  let shows = data["All Dramas"];
  let genreCounts = getGenreCountDict(shows);
  let stats = getStatsData(shows, genreCounts);
  initBarChart(genreCounts);

  for (var key in stats) {
    dom[key].textContent = stats[key];
  }
}

function getStatsData(shows, genreCounts) {
  let stats = {
    totalShows: shows.length,
    completedShows: shows.reduce((total, show) => total + (show.numEpisodes == show.userCurrentEpisode ? 1 : 0), 0),
    totalEpisodes: shows.reduce((total, show) => total + show.numEpisodes, 0),
    completedEpisodes: shows.reduce((total, show) => total + show.userCurrentEpisode, 0),
    totalHours: 0,
    completedHours: 0,
    avgEpisodesPerWeek: 0,
    avgHoursPerWeek: 0,
    favoriteGenre: Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b),
    favoriteActor: generateElementsFromArray(actors, 1, 1)[0],
    metaAvgOverallRating: (shows.reduce((total, show) => total + Number(show.rating), 0) / shows.length).toFixed(1),
    yourAvgOverallRating: (shows.reduce((total, show) => total + Number(show.userRating), 0) / shows.length).toFixed(1)
  }
  stats.totalHours = (stats.totalEpisodes * 63 / 60).toFixed(1);
  stats.completedHours = (stats.completedEpisodes * 63 / 60).toFixed(1);
  stats.avgEpisodesPerWeek = (stats.completedEpisodes / 52).toFixed(1);
  stats.avgHoursPerWeek = (stats.completedHours / 52).toFixed(1);
  return stats;
}

function applyStatsFilter(listName) {
  /*
  listDropdowns = Util.all('.dropdown-btn');
  for(let dropdown of listDropdowns) {
    if(dropdown.innerHTML && dropdown.innerHTML.includes("List")) {
      dropdown.classList.toggle("active");
      panel = dropdown.nextElementSibling;
      panel.classList.toggle("gone");
      boxes = Util.all('.list-filter-checkbox');
      
      for(let box of boxes) {
        let value = box.value + "";
        if(value == String(listName) + "") {
          console.log("works");
          box.checked = true;
          break;
        }
      }
      break;
    }
  }*/
  //TODO Apply filter (also make filter button gray)
}

function getGenreCountDict(shows) {
  let genreCounts = {};
  for (let show of shows) {
    for (let genre of show.genres) {
      if (!(genre in genreCounts)) {
        genreCounts[genre] = 0;
      }
      genreCounts[genre] += 1;
    }
  }
  return genreCounts;
}

function initBarChart(genreCounts) {
  let data = [{
    x: Object.keys(genreCounts),
    y: Object.values(genreCounts),
    type: 'bar',
  }];
  Plotly.newPlot('bar-chart', data);
}
