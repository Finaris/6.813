const maxShowsPerPage = 10;
const allShows = getAllShowsData(20);

// Attach events to the document prior to the DOM being ready.
Util.events(document, {
	// This runs when the DOM is ready.
    "DOMContentLoaded": function() {

      initAllShowsPageDOM();

    },
});

function initAllShowsPageDOM() {
  let showSectionElm = Util.one('#results-section');
  for(var i = 0; i < allShows.length; i++) {
    let show = allShows[i];
    let showDisplayElm = Util.create('div', {class: 'all-show-display'});
    let imgElm = Util.create('img', {src: '../'+show.img, class: 'show-img'});
    let dataElm = getDataElmFromShowData(show);
    let buttonElm = Util.create('i', {class: 'all-show-add-btn fa fa-plus-circle'});
//    let buttonElm = Util.create('button', {class: 'all-show-add-btn'});
//    buttonElm.innerHTML = '<i class="fa fa-plus"></i>';

    showSectionElm.appendChild(showDisplayElm);
    showDisplayElm.appendChild(imgElm);
    showDisplayElm.appendChild(dataElm);
    showDisplayElm.appendChild(buttonElm);
  }
}

function getDataElmFromShowData(show) {
  let dataElm = Util.create('div', {class: 'data-div'});

  let titleElm = Util.create('div', {class: 'title-elm'});
  titleElm.innerHTML = '<span class="show-title">' + show.title + '</span> (<span class="show-status">' + show.status + '</span>)';
  let ratingElm = Util.create('div', {class: 'rating-elm'});
  ratingElm.innerHTML = 'Rating: ' + show.rating + ' (' + show.numRated + ' users)';
  let realeaseElm = Util.create('div', {class: 'release-elm'});
  realeaseElm.innerHTML = 'Release Year: ' + show.releaseYear;
  let episodesElm = Util.create('div', {class: 'episodes-elm'});
  episodesElm.innerHTML = '# Episodes: ' + show.numEpisodes;
  let genreElm = Util.create('div', {class: 'genre-elm'});
  genreElm.innerHTML = 'Genres: ' + show.genres.sort().join(', ');
  let descriptionElm = Util.create('div', {class: 'discription-elm'});
  descriptionElm.innerHTML = show.description;
  
  dataElm.appendChild(titleElm);
  dataElm.appendChild(ratingElm);
  dataElm.appendChild(realeaseElm);
  dataElm.appendChild(episodesElm);
  dataElm.appendChild(genreElm);
  dataElm.appendChild(descriptionElm);
  return dataElm;
}
