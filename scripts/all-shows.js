// number of shows on the page
const NUM_SHOWS = 25; // TODO change later as needed

// create a canned show for the scenario.
const CANNED_THRILLER = {
    img: './graphics/shows/5.jpg',
    title: 'Signal',
    description: "A mysterious walkie talkie allows a detective in the year 2000 to communicate with a cold case profiler from 2015; with the power of fore and hindsight the two not only solve crimes but prevent them from ever taking place. However, a long-standing murder case is closer to home than either realizes.",
    rating: 8.9,
    releaseYear: 2016,
    numEpisodes: 16,
    numRated: 978,
    status: 'Completed',
    airDays: ['Monday', 'Tuesday'],
    genres: ['Thriller', 'Drama']
};

// display shows in decreasing rating order
var allShows = getRandomShows(NUM_SHOWS);
allShows.push(CANNED_THRILLER);
allShows.sort((show1, show2) => Number(show2.rating) - Number(show1.rating));

// Make sure that we always have a thriller div
function scenarioThrillerDiv() {
  let showSectionElm = Util.one('#results-section'); // main section of the page
  let showDisplayElm = Util.create('div', { class: 'individual-showcard' });
  showSectionElm.appendChild(showDisplayElm);

  // each show card has three components (imgElm, dataElm, and buttonElm)
  let imgElm = Util.create('img', { src: '../' + CANNED_THRILLER.img, class: 'show-img' });
  let dataElm = getInfo(CANNED_THRILLER);
  let buttonElm = Util.create('i', { class: 'all-show-add-btn fa fa-plus-circle' });
  buttonElm.addEventListener('click', onAddButtonClick);

  showDisplayElm.appendChild(imgElm);
  showDisplayElm.appendChild(dataElm);
  showDisplayElm.appendChild(buttonElm);
}

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

function addListToMenu(menuElm, name) {
  let list = Util.create('button', { class: 'dropdown-btn' });
  list.classList.add('dropdown-list-btn');
  list.innerHTML = " " + name + " <i class=\"fa fa-caret-down\"></i>";
  list.addEventListener("click", function() {
    let btns = Util.all('.dropdown-list-btn');
    for(var b of btns) {
      if(b != this) {
        b.children[0].classList = 'fa fa-caret-down';
        b.classList.remove("active");
      }
    }

    if (this.children[0].classList == 'fa fa-caret-up') {
      this.children[0].classList = 'fa fa-caret-down';
    } else {
      this.children[0].classList = 'fa fa-caret-up';
    }
    let panels = Util.all('.dropdown-list-container');
    for(var p of panels) {
      if(p != this.nextElementSibling) {
        p.classList.add("gone");
      }
    }
    this.nextElementSibling.classList.toggle("gone");
    this.classList.toggle("active");

  });
  let panel = Util.create('div', { class: 'dropdown-list-container'});
  panel.style.setProperty('--num-sections', listsToSections[name].length);
  listsToSections[name].forEach(function(elt) {
    // Define a label for input box.
    let newLabel = Util.create("label");

    // Define a new input box.
    let newInput = document.createElement("input");
    newInput.type = "checkbox";
    newInput.value = elt;

    // Append the new elements to the genre div.
    newLabel.appendChild(newInput);
    newLabel.innerHTML += elt;
    panel.appendChild(newLabel);
  });
  menuElm.appendChild(list);
  menuElm.appendChild(panel);
  panel.classList.toggle("gone");
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
  addShowsToDOM(allShows);
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

  // Add the thriller div to the bottom
  scenarioThrillerDiv();
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

  // gets a subset of the shows from allShows, using the filter
  let filteredShows = filterShowsGivenFilter(allShows, filter);

  // only display filtered shows
  addShowsToDOM(filteredShows);

  // resets screen view to the top
  Util.one('main').scrollTop = 0;
}

function onAddButtonClick(evt) {
  evt.stopPropagation();
  if (currentDropDownMenuElm == null) {
    let dropdownMenuElm = Util.create('div', { class: 'dropdown-menu' });
    let menuWrapper = Util.create('div', {class: 'menu-wrapper'});

    listNames.forEach(function(elt) { addListToMenu(menuWrapper, elt) });
    dropdownMenuElm.appendChild(menuWrapper);

    let submitButtonElm = Util.create('button', { class: 'btn btn-primary' });
    submitButtonElm.innerHTML = 'Add';
    submitButtonElm.addEventListener("click", displayConfirmationMessage);

    dropdownMenuElm.style.setProperty('left', evt.target.offsetLeft + 'px');
    dropdownMenuElm.style.setProperty('top', (evt.target.offsetTop + evt.target.offsetHeight + 5) + 'px');

    //dropdownMenuElm.appendChild(listSelectionElm);
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

// Show a success when adding a new list
function displayConfirmationMessage(evt) {
  evt.stopPropagation();
  // There's only ever one of these at a time.
  let dropdownMenu = document.getElementsByClassName('dropdown-menu')[0];

  // display confirmation message in the middle of the screen
  dropdownMenu.classList.add('confirmation-message')
  dropdownMenu.style.position = "fixed"; // position the message in the middle of the screen
  dropdownMenu.style.left = "50%";
  dropdownMenu.style.top = "20%";

  // Create a new div to add.
  let addedDiv = document.createElement('div');
  addedDiv.innerHTML += "Successfully added!";

  // to limit the width of the confirmation message
  // addedDiv.style.maxWidth = "75px";

  for (let i = 0; i < 2; i++) {
    dropdownMenu.removeChild(dropdownMenu.firstChild);
  }
  dropdownMenu.appendChild(addedDiv);

  // display the confirmation message for a short period of time
  Util.delay(1500).then(function() {
      removeAddShowDropdownMenu();
      currentDropDownMenuElm = null; // reset so that messages can pop up for future clicks
  });
}

function removeAddShowDropdownMenu() {
  if (currentDropDownMenuElm != null) {
    Util.one('main').removeChild(currentDropDownMenuElm);
    currentDropDownMenuElm = null;
    currentAddButtonElm = null;
  }
}
