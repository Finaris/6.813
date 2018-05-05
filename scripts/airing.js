const MAX_NUM_SHOWS_ROW = 5;
const AIRING_SHOWS_BY_DAY = getAiringShowsData(500);
var currentAddButtonElm = null;
var currentDropDownMenuElm = null;
var canPress = true;
var mostRecentlyAddedShow = null;
var mostRecentlyAddedList = null;

// options for the user to choose from
let listNames = ['To Watch', 'Watching', 'Completed'];
let listsToSections = {
  'To Watch': ['Feels', 'Romance', 'Comedy', 'Action', 'Thriller', 'Psychological'],
  'Watching': ['Completed Shows', 'Airing Shows'],
  'Completed': ['Amazing', 'Good', 'Okay', 'Bad']
};
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Attach events to the document prior to the DOM being ready.
Util.events(document, {
  // This runs when the DOM is ready.
  "DOMContentLoaded": function() {

    initAiringPageDOM();
    initAiringPageListeners();

  },
});

function initAiringPageDOM() {
  let showSectionElm = Util.one('#show-section');
  for (let day of DAYS) {
    let showsOnDay = AIRING_SHOWS_BY_DAY[day];

    if (showsOnDay.length == 0) {
      continue;
    }

    let daySectionElm = Util.create('div', { id: day.toLowerCase() + '-section', class: 'day-section' });
    let headerElm = Util.create('h2', {});
    headerElm.innerHTML = day;

    let showDisplayID = day.toLowerCase() + '-show-display';
    let showDisplayElm = Util.create('div', { id: showDisplayID, class: 'airing-show-display' });

    let carouselElm = Util.create('div', { class: 'carousel', id: day.toLowerCase() + '-carousel' });
    let carouselLeftButtonElm = Util.create('a', { class: 'carousel-button carousel-left-button', id: day.toLocaleLowerCase() + '-carousel-left-button' });
    carouselLeftButtonElm.innerHTML = "<i class='fa fa-angle-left'></i>"
    let carouselRightButtonElm = Util.create('a', { class: 'carousel-button carousel-right-button', id: day.toLocaleLowerCase() + '-carousel-right-button' });
    carouselRightButtonElm.innerHTML = "<i class='fa fa-angle-right'></i>"
    let carouselShowContainerElm = Util.create('div', { class: 'carousel-show-container', id: day.toLocaleLowerCase() + '-carousel-show-container' })
    for (let show of showsOnDay) {
      carouselShowContainerElm.appendChild(getShowElmFromShowData(show));
    }

    showSectionElm.appendChild(daySectionElm);
    daySectionElm.appendChild(headerElm);
    daySectionElm.appendChild(showDisplayElm);
    showDisplayElm.appendChild(carouselElm);
    carouselElm.appendChild(carouselLeftButtonElm);
    carouselElm.appendChild(carouselShowContainerElm);
    carouselElm.appendChild(carouselRightButtonElm);
  }
}

function initAiringPageListeners() {
  let leftCarouselButtonElms = Util.all('.carousel-left-button');
  for (let button of leftCarouselButtonElms) {
    button.addEventListener('click', onLeftCarouselClick);
  }

  let rightCarouselButtonElms = Util.all('.carousel-right-button');
  for (let button of rightCarouselButtonElms) {
    button.addEventListener('click', onRightCarouselClick);
  }

  let addButtonElms = Util.all('.dropdown'); // plus button for each show
  for (let button of addButtonElms) {
    button.addEventListener('click', onAddButtonClick);
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
}

function getShowElmFromShowData(show) {
  let showElm = Util.create('div', { class: 'airing-show-container' });
  let showTitle = Util.create('div', { class: 'title-div' });
  let imgContainerElm = Util.create('div', { class: 'img-plus-container' });

  let imgElm = Util.create('img', { src: show.img, class: 'show-img' });
  showTitle.textContent = show.title;

  // new div is needed to grab the element; weird behavior
  let dropdownElm = Util.create('div', { class: 'dropdown' });

  // circle plus icon for the user to add show to list
  let dropdownButtonElm = Util.create('i', { class: 'add-btn fa fa-plus-circle' });

  showElm.appendChild(showTitle);
  showElm.appendChild(imgContainerElm);
  imgContainerElm.appendChild(imgElm);
  imgContainerElm.appendChild(dropdownElm);
  dropdownElm.appendChild(dropdownButtonElm);

  return showElm;
}

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

function onRightCarouselClick(evt) {
  if (canPress) {
    canPress = false;
    let day = evt.target.id.split('-')[0];
    let carouselShowContainerElm = Util.one('#' + day + '-carousel-show-container');

    let copies = [];
    for (let i = 0; i < MAX_NUM_SHOWS_ROW; i++) {
      copies.push(carouselShowContainerElm.children.item(i).cloneNode(true));
      carouselShowContainerElm.appendChild(copies[i]);
    }

    carouselShowContainerElm.style.setProperty('--move-dir', -1);
    carouselShowContainerElm.classList.add('move-left-animation');

    Util.afterAnimation(carouselShowContainerElm, 'moveleft').then(function(value) {
      carouselShowContainerElm.classList.remove('move-left-animation');
      for (let i = 0; i < MAX_NUM_SHOWS_ROW; i++) {
        carouselShowContainerElm.replaceChild(carouselShowContainerElm.firstChild, copies[i]);
      }
      canPress = true;
    });
  }
}

function onLeftCarouselClick(evt) {
  if (canPress) {
    canPress = false;
    let day = evt.target.id.split('-')[0];
    let carouselShowContainerElm = Util.one('#' + day + '-carousel-show-container');

    let copies = [];
    for (let i = 0; i < MAX_NUM_SHOWS_ROW; i++) {
      let index = carouselShowContainerElm.children.length - 1 - i;
      copies.push(carouselShowContainerElm.children.item(index).cloneNode(true));
      carouselShowContainerElm.insertBefore(copies[i], carouselShowContainerElm.firstChild);
    }

    carouselShowContainerElm.classList.add('move-right-animation');

    Util.afterAnimation(carouselShowContainerElm, 'moveright').then(function(value) {
      carouselShowContainerElm.classList.remove('move-right-animation');
      for (let i = 0; i < MAX_NUM_SHOWS_ROW; i++) {
        carouselShowContainerElm.replaceChild(carouselShowContainerElm.lastChild, copies[i]);
      }
      canPress = true;
    });
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

  while (dropdownMenu.firstChild) {
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
