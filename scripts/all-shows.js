// number of shows on the page
const NUM_SHOWS = 10; // TODO change later as needed

// display shows in decreasing rating order
const ALL_SHOWS = getRandomShows(NUM_SHOWS).sort((show1, show2) => Number(show2.rating) - Number(show1.rating));

// Attach events to the document prior to the DOM being ready.
Util.events(document, {
  // This runs when the DOM is ready.
  "DOMContentLoaded": function() {
    initAllShowsPageDOM();
  },
});

let currentDropDownMenuElm = null;

let listNames = ['To Watch', 'Watching', 'Completed'];
let listsToSections = {
  'To Watch': ['Feels', 'Romance', 'Comedy', 'Action', 'Thriller', 'Psychological'],
  'Watching': ['Completed Shows', 'Airing Shows'],
  'Completed': ['Amazing', 'Good', 'Okay', 'Bad']
};

function addOptionToSelect(sel, name) {
  option = Util.create('option', { value: name });
  option.innerHTML = name;
  sel.appendChild(option);
}

window.addEventListener('resize', function() {
  // Moves the dropdown upon resize
  if (currentDropDownMenuElm != null) {
    currentDropDownMenuElm.style.setProperty('left', currentAddButtonElm.offsetLeft + 'px');
    currentDropDownMenuElm.style.setProperty('top', (currentAddButtonElm.offsetTop + currentAddButtonElm.offsetHeight + 5) + 'px');
  }
});

document.addEventListener('click', function(evt) {
  // Makes dropdown disappear if clicked outside
  if (currentDropDownMenuElm != null) {
    if (!currentDropDownMenuElm.contains(evt.target)) {
      removeAddShowDropdownMenu();
    }
  }
});


// initialize the page
function initAllShowsPageDOM() {
  addShowsToDOM(ALL_SHOWS);
}

// adding all shows to DOM
function addShowsToDOM(shows) {
  let showSectionElm = Util.one('#results-section'); // main section of the page
  for (var i = 0; i < shows.length; i++) {
    // show: {'status': ..., 'img': ..., 'description': ..., }
    const show = shows[i];

    // prepare a placeholder for each show
    let showDisplayElm = Util.create('div', { class: 'individual-showcard' });
    showSectionElm.appendChild(showDisplayElm);

    // each show card has three components (imgElm, dataElm, and buttonElm)
    let imgElm = Util.create('img', { src: '../' + show.img, class: 'show-img' });
    let dataElm = getInfo(show);
    let buttonElm = Util.create('i', { class: 'all-show-add-btn fa fa-plus-circle' });
    buttonElm.addEventListener('click', onAddButtonClick);

    showDisplayElm.appendChild(imgElm);
    showDisplayElm.appendChild(dataElm);
    showDisplayElm.appendChild(buttonElm);
  }
}

// gets all relevant information regarding the input show and returns a element with all info
function getInfo(show) {
  let dataElm = Util.create('div', { class: 'data-div' });
  let titleElm = Util.create('div', { class: 'title-elm' });
  titleElm.innerHTML = '<span class="show-title">' + show.title + '</span> (<span class="show-status">' + show.status + '</span>)';
  let ratingElm = Util.create('div', { class: 'rating-elm' });
  ratingElm.innerHTML = '<span class="leader">Rating: </span>' + show.rating + ' (' + show.numRated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' users)';
  let realeaseElm = Util.create('div', { class: 'release-elm' });
  realeaseElm.innerHTML = '<span class="leader">Release Year: </span>' + show.releaseYear;
  let episodesElm = Util.create('div', { class: 'episodes-elm' });
  episodesElm.innerHTML = '<span class="leader"># Episodes: </span>' + show.numEpisodes;
  let genreElm = Util.create('div', { class: 'genre-elm' });
  genreElm.innerHTML = '<span class="leader">Genres: </span>' + show.genres.sort().join(', ');
  let descriptionElm = Util.create('div', { class: 'description-elm' });
  descriptionElm.innerHTML = show.description;

  dataElm.appendChild(titleElm);
  dataElm.appendChild(ratingElm);
  dataElm.appendChild(episodesElm);
  dataElm.appendChild(realeaseElm);
  dataElm.appendChild(genreElm);
  dataElm.appendChild(descriptionElm);
  return dataElm;
}

// iteratively removes all shows on the page
function clearShowsFromDOM() {
  let showSectionElm = Util.one('#results-section');
  while (showSectionElm.firstChild) {
    showSectionElm.removeChild(showSectionElm.firstChild);
  }
}

// called when the filter button is clicked
function onFilterButtonClick() {
  // remove all show cards from the display
  clearShowsFromDOM();

  // gets user input from the filter (filter.js)
  let filter = getFilterDict();

  // gets a subset of the shows from ALL_SHOWS, using the filter
  let filteredShows = filterShowsGivenFilter(ALL_SHOWS, filter);

  // only display filtered shows
  addShowsToDOM(filteredShows);

  // resets screen view to the top
  Util.one('main').scrollTop = 0;
}

function onAddButtonClick(evt) {
  evt.stopPropagation();
  if (currentDropDownMenuElm == null) {
    let dropdownMenuElm = Util.create('div', { class: 'dropdown-menu' });
    let listSelectionElm = Util.create('div', { class: 'list-input-section' });
    let listLabelElm = Util.create('div');
    listLabelElm.innerHTML = "List: ";

    let listSelect = Util.create('select', { id: 'list-select' });

    listNames.forEach(function(elt) { addOptionToSelect(listSelect, elt) });

    listSelect.onchange = function(e) {
      let listSel = Util.one('#list-select');
      let sectionSel = Util.one('#section-select');
      while (sectionSel.firstChild) {
        sectionSel.removeChild(sectionSel.firstChild);
      }
      listsToSections[listSel.options[listSel.selectedIndex].value].forEach(function(elt) { addOptionToSelect(sectionSel, elt) });
    };

    let sectionLabelElm = Util.create("div");
    sectionLabelElm.innerHTML = "Section: ";

    let sectionSelect = Util.create('select', { id: 'section-select' });
    listsToSections["To Watch"].forEach(function(elt) { addOptionToSelect(sectionSelect, elt) });

    listSelectionElm.appendChild(listLabelElm);
    listSelectionElm.appendChild(listSelect);
    listSelectionElm.appendChild(sectionLabelElm);
    listSelectionElm.appendChild(sectionSelect);

    //listSelectionElm.innerHTML = "List: ";
    let submitButtonElm = Util.create('button', { class: 'btn btn-primary' });
    submitButtonElm.innerHTML = 'Add';

    dropdownMenuElm.style.setProperty('left', evt.target.offsetLeft + 'px');
    dropdownMenuElm.style.setProperty('top', (evt.target.offsetTop + evt.target.offsetHeight + 5) + 'px');

    dropdownMenuElm.appendChild(listSelectionElm);
    dropdownMenuElm.appendChild(submitButtonElm);

    Util.one('main').appendChild(dropdownMenuElm);
    currentDropDownMenuElm = dropdownMenuElm;
    currentAddButtonElm = evt.target;
  } else {
    let temp = currentAddButtonElm;
    removeAddShowDropdownMenu();
    if (temp != evt.target && evt.target.classList.contains('add-btn')) {
      onAddButtonClick(evt);
    }
  }
}

//--------------------------------------- Helper Functions -----------------------------------------//

function removeAddShowDropdownMenu() {
  if (currentDropDownMenuElm != null) {
    Util.one('main').removeChild(currentDropDownMenuElm);
    currentDropDownMenuElm = null;
    currentAddButtonElm = null;
  }
}
