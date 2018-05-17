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
  
  let currList = Util.getURLParam("list");
  if(currList !== null) {
    loadStatsFiler(currList);
  }
    
  updateStatsPage();
}

function updateStatsPage() {
  let shows = userLists["All Dramas"];
  
  let filter = getFilterDict();
  let filteredShows = filterShowsGivenFilter(shows, filter);
  
  let genreCounts = getGenreCountDict(filteredShows);
  let stats = getStatsData(filteredShows, genreCounts);
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
    favoriteGenre: Object.keys(genreCounts).length > 0 ? Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b) : 'N/A',
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

function loadStatsFiler(listName) {
  listDropdowns = Util.all('.dropdown-btn');
  for(let dropdown of listDropdowns) {
    if(dropdown.innerHTML && dropdown.innerHTML.includes("List")) {
      dropdown.classList.toggle("active");
      panel = dropdown.nextElementSibling;
      panel.classList.toggle("gone");
      boxes = document.getElementsByClassName('list-filter-checkbox');

      for(let box of boxes) {
        let value = box.value + "";
        if(value == String(listName) + "") {
          box.checked = true;

          updateFilterState();
          break;
        }
      }
      break;
    }
  }
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
  //adapted from code here: https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript

  var items = Object.keys(genreCounts).map(function(key) {
    return [key, genreCounts[key]];
  });

  // Sort the array based on the second element
  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  let data = [{
    x: items.map(tup => tup[0]),
    y: items.map(tup => tup[1]),
    type: 'bar',
  }];
  Plotly.newPlot('bar-chart', data);
}
