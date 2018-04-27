const maxShowsPerPage = 10;
let allShows = getAllShowsData(20).sort((show1, show2) => Number(show2.rating) - Number(show1.rating));

// Attach events to the document prior to the DOM being ready.
Util.events(document, {
	// This runs when the DOM is ready.
    "DOMContentLoaded": function() {

      initAllShowsPageDOM();

    },
});

function initAllShowsPageDOM() {
  addShowsToDOM(allShows);
}

function getDataElmFromShowData(show) {
  let dataElm = Util.create('div', {class: 'data-div'});

  let titleElm = Util.create('div', {class: 'title-elm'});
  titleElm.innerHTML = '<span class="show-title">' + show.title + '</span> (<span class="show-status">' + show.status + '</span>)';
  let ratingElm = Util.create('div', {class: 'rating-elm'});
  ratingElm.innerHTML = '<span class="leader">Rating: </span>' + show.rating + ' (' + show.numRated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' users)';
  let realeaseElm = Util.create('div', {class: 'release-elm'});
  realeaseElm.innerHTML = '<span class="leader">Release Year: </span>' + show.releaseYear;
  let episodesElm = Util.create('div', {class: 'episodes-elm'});
  episodesElm.innerHTML = '<span class="leader"># Episodes: </span>' + show.numEpisodes;
  let genreElm = Util.create('div', {class: 'genre-elm'});
  genreElm.innerHTML = '<span class="leader">Genres: </span>' + show.genres.sort().join(', ');
  let descriptionElm = Util.create('div', {class: 'description-elm'});
  descriptionElm.innerHTML = show.description;
  
  dataElm.appendChild(titleElm);
  dataElm.appendChild(ratingElm);
  dataElm.appendChild(episodesElm);
  dataElm.appendChild(realeaseElm);
  dataElm.appendChild(genreElm);
  dataElm.appendChild(descriptionElm);
  return dataElm;
}

function addShowsToDOM(shows) {
  let showSectionElm = Util.one('#results-section');
  for(var i = 0; i < shows.length; i++) {
    let show = shows[i];
    let showDisplayElm = Util.create('div', {class: 'all-show-display'});
    let imgElm = Util.create('img', {src: '../'+show.img, class: 'show-img'});
    let dataElm = getDataElmFromShowData(show);
    let buttonElm = Util.create('i', {class: 'all-show-add-btn fa fa-plus-circle'});

    showSectionElm.appendChild(showDisplayElm);
    showDisplayElm.appendChild(imgElm);
    showDisplayElm.appendChild(dataElm);
    showDisplayElm.appendChild(buttonElm);
  }
}

function clearShowsFromDOM() {
  let showSectionElm = Util.one('#results-section');
  while (showSectionElm.firstChild) {
    showSectionElm.removeChild(showSectionElm.firstChild);
  }
}

function onFilterButtonClick() {
  clearShowsFromDOM();
  
  let filter = getFilterDict();
  let filteredShows = filterShowsGivenFilter(allShows, filter);
  addShowsToDOM(filteredShows);
  Util.one('main').scrollTop = 0;
}
