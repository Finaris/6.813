const maxShowsPerRow = 5;
const airingShowsByDay = getAiringShowsData(100);
let canPress = true;

// Attach events to the document prior to the DOM being ready.
Util.events(document, {
	// This runs when the DOM is ready.
    "DOMContentLoaded": function() {

      initAiringPageDOM();
      initAiringPageListeners();

    },
});

function initAiringPageDOM() {
  let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let showSectionElm = Util.one('#show-section');
  for(let day of daysOfWeek) {
    let showsOnDay = airingShowsByDay[day];
    if (showsOnDay.length == 0) {
      continue;
    }

    let daySectionElm = Util.create('div', {id: day.toLowerCase() + '-section', class: 'day-section'});
    let headerElm = Util.create('h2', {});
    headerElm.innerHTML = day;

    let showDisplayID = day.toLowerCase() + '-show-display';
    let showDisplayElm = Util.create('div', {id: showDisplayID, class: 'airing-show-display'});

    let carouselElm = Util.create('div', {class: 'carousel', id: day.toLowerCase() + '-carousel'});
    let carouselLeftButtonElm = Util.create('a', {class: 'carousel-button carousel-left-button', id: day.toLocaleLowerCase() + '-carousel-left-button'});
    carouselLeftButtonElm.innerHTML = "<i class='fa fa-angle-left'></i>"
    let carouselRightButtonElm = Util.create('a', {class: 'carousel-button carousel-right-button', id: day.toLocaleLowerCase() + '-carousel-right-button'});
    carouselRightButtonElm.innerHTML = "<i class='fa fa-angle-right'></i>"
    let carouselShowContainerElm = Util.create('div', {class: 'carousel-show-container', id: day.toLocaleLowerCase() + '-carousel-show-container'})
    for(let show of showsOnDay) {
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

function updateAiringPage(shows) {
  let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for(let day of daysOfWeek) {
    let showsOnDay = shows[day];

    let carouselInnerElm = Util.one('#'+day.toLowerCase()+'-carousel-inner');

    let showNumber = 0;

    while(carouselInnerElm.firstChild) {
      carouselInnerElm.removeChild(carouselInnerElm.firstChild);
    }

    let carouselItemElm = Util.create('div', {class: "carousel-item row no-gutters active"})

    for (let show of showsOnDay) {
      if (showNumber == 5) {
        showNumber = 0;
        carouselInnerElm.appendChild(carouselItemElm);
        carouselItemElm = Util.create('div', {class: "carousel-item row no-gutters"})
      }
      carouselItemElm.appendChild(getShowElmFromShowData(show));
      showNumber++;
    }

    let currentSection = document.getElementById(day.toLowerCase()+'-section');
    if (!carouselItemElm.hasChildNodes()) {
      currentSection.style.display = "none";
      continue;
    } else {
      currentSection.style.display = "initial";
    }

    carouselInnerElm.appendChild(carouselItemElm);
  }
}

function getShowElmFromShowData(show) {
  let showElm = Util.create('div', {class: 'airing-show-container'});
  let imgElm = Util.create('img', {src: show.img, class: 'show-img'});
  let showTitle = Util.create('div', {class: 'title-div'});
  showTitle.textContent = show.title;
  let dropdownElm = Util.create('div', {class: 'dropdown'});

  let dropdownButtonElm = Util.create('button', {class: 'add-btn'});
  dropdownButtonElm.innerHTML = "Add <i class='fa fa-caret-down add-btn-caret'></i>"

  let dropdownMenuElm = Util.create('ul', {class: 'dropdown-menu gone'})
  let listSelectionElm = Util.create('div', {class: 'list-input-section'})
  listSelectionElm.innerHTML = "List: ";
  let submitButtonElm = Util.create('button', {class: 'btn btn-primary'});
  submitButtonElm.innerHTML = 'Add';

  dropdownMenuElm.appendChild(listSelectionElm);
  dropdownMenuElm.appendChild(submitButtonElm);

  showElm.appendChild(imgElm);
  showElm.appendChild(showTitle);
  showElm.appendChild(dropdownElm);
  dropdownElm.appendChild(dropdownButtonElm);
  dropdownElm.appendChild(dropdownMenuElm);

  return showElm;
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
  
  let addButtonElms = Util.all('.add-btn');
  for (let button of addButtonElms) {
    button.addEventListener('click', function() {
      this.nextSibling.classList.toggle('gone');
    });
  }
}

function onLeftCarouselClick(evt) {
  if (canPress) {
    canPress = false;
    let day = evt.target.id.split('-')[0];
    let carouselShowContainerElm = Util.one('#' + day + '-carousel-show-container');

    let copies = [];
    for (let i = 0; i < maxShowsPerRow; i++) {
      copies.push(carouselShowContainerElm.children.item(i).cloneNode(true));
      carouselShowContainerElm.appendChild(copies[i]);
    }

    carouselShowContainerElm.style.setProperty('--move-dir', -1);
    carouselShowContainerElm.classList.add('move-left-animation');

    Util.afterAnimation(carouselShowContainerElm, 'moveleft').then(function(value) {
      carouselShowContainerElm.classList.remove('move-left-animation'); 
      for (let i = 0; i < maxShowsPerRow; i++) {
        carouselShowContainerElm.replaceChild(carouselShowContainerElm.firstChild, copies[i]);
      }
      canPress = true;
    });
  }
}

function onRightCarouselClick(evt) {
  if (canPress) {
    canPress = false;
    let day = evt.target.id.split('-')[0];
    let carouselShowContainerElm = Util.one('#' + day + '-carousel-show-container');

    let copies = [];
    for (let i = 0; i < maxShowsPerRow; i++) {
      let index = carouselShowContainerElm.children.length - 1 - i;
      copies.push(carouselShowContainerElm.children.item(index).cloneNode(true));
      carouselShowContainerElm.insertBefore(copies[i], carouselShowContainerElm.firstChild);
    }

    carouselShowContainerElm.classList.add('move-right-animation');

    Util.afterAnimation(carouselShowContainerElm, 'moveright').then(function(value) {
      carouselShowContainerElm.classList.remove('move-right-animation'); 
      for (let i = 0; i < maxShowsPerRow; i++) {
        carouselShowContainerElm.replaceChild(carouselShowContainerElm.lastChild, copies[i]);
      }
      canPress = true;
    }); 
  }
}
