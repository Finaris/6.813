dom = {};

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

  var stats = getStatsData();

  for (var key in stats) {
    dom[key].textContent=stats[key];
  }
}
