let userLists = getMyListsData();
let idNamesToDisplayNames = getIdNamesToDisplayNames();
let currentModal = null;

// Attach events to the document prior to the DOM being ready.
Util.events(document, {
  // This runs when the DOM is ready.
  "DOMContentLoaded": function() {
    initDOM();
    initListeners();
    onListBtnClick('towatch-btn');
  },
});

function onListBtnClick(listBtnId) {
  // show content for the chosen list
  updateTabBorders(listBtnId);

  clearHeaderShowBars();
  updateBars(listBtnId);
}

function initListeners() {
  let listBtnElms = Util.all('.list-btn');
  for (let listBtnElm of listBtnElms) {
    listBtnElm.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('list-btn')) {
        onListBtnClick(evt.target.id);
      }
    });
  }

  Util.one('#add-list-btn').addEventListener('click', function(evt) {
    if (currentModal == null) {
      let modalElm = getAddListModalElm();
      Util.one('body').appendChild(modalElm);
      currentModal = modalElm;
      applyAddListModalListeners();
    }
  });
}

function initDOM() {
  let showSectionElm = Util.one('#shows-section');
  showSectionElm.removeChild(showSectionElm.childNodes.item(2));
  showSectionElm.removeChild(showSectionElm.childNodes.item(0));
}

//------------------------------------------------------- Helper Functions -----------------------------------------------------------//

// update the class for the chosen (and other) lists to display appropriate content
function updateTabBorders(listBtnId) {
  let listBtnElms = Util.all('.list-btn');
  for (let listBtnElm of listBtnElms) { // "To Watch", "Watching", "Completed", ...
    if (listBtnId == listBtnElm.id) {
      listBtnElm.children[0].classList.remove('not-blocking');
    } else {
      listBtnElm.children[0].classList.add('not-blocking');
    }
  }
}

function updateBars(listBtnId) {
  let showSectionElm = Util.one('#shows-section');

  let listIdName = listBtnId.slice(0, -4);
  let listDisplayName = idNamesToDisplayNames[listIdName];

  // Update main bar
  Util.one('#current-list-name').innerHTML = listDisplayName;
  Util.one('#num-elms-in-list').innerHTML = userLists[listDisplayName].All.length;

  // Update header and show bars
  let listHeaderDict = userLists[listDisplayName];
  for (let header in listHeaderDict) {
    if (header == 'All') {
      continue;
    }
    showSectionElm.appendChild(getHeaderBarElm(header, listHeaderDict[header].length));
    let shows = listHeaderDict[header]; // Sorting shows within header would go here
    for (let show of shows) {
      showSectionElm.appendChild(getShowBarElm(show));
    }
  }
}

function clearHeaderShowBars() {
  let showSectionElm = Util.one('#shows-section');
  let mainBarElm = showSectionElm.firstChild;
  while (mainBarElm.nextSibling != null) {
    showSectionElm.removeChild(mainBarElm.nextSibling);
  }
  showSectionElm.scrollTop = 0;
}

function getHeaderBarElm(headerDisplayName, numShowsInHeader) {
  let headerBarElm = Util.create('div', { class: 'header-bar' });

  let dragElm = Util.create('i', { class: 'fa fa-bars header-bar-drag' });
  let textElm = Util.create('div', { class: 'header-bar-text left-align' });
  textElm.innerHTML = headerDisplayName + ' (' + numShowsInHeader + ')';
  let dropdownElm = Util.create('i', { class: 'fa fa-caret-down header-bar-dropdown' });

  headerBarElm.appendChild(dragElm);
  headerBarElm.appendChild(textElm);
  headerBarElm.appendChild(dropdownElm);
  return headerBarElm;
}

function getShowBarElm(show) {
  let showBarElm = Util.create('div', { class: 'show-bar' });

  let dragElm = Util.create('i', { class: 'fa fa-bars show-bar-drag' });
  let titleElm = Util.create('div', { class: 'show-bar-title left-align' });
  let typeElm = Util.create('div', { class: 'show-bar-type' })
  let yearElm = Util.create('div', { class: 'show-bar-year' })
  let ratingElm = Util.create('div', { class: 'show-bar-rating' })
  let progressElm = Util.create('div', { class: 'show-bar-progress' })
  let editElm = Util.create('i', { class: 'fa fa-edit show-bar-edit' });

  titleElm.innerHTML = show.title;
  typeElm.innerHTML = 'TV';
  yearElm.innerHTML = show.releaseYear;
  ratingElm.innerHTML = show.rating;
  progressElm.innerHTML = "<i class='fa fa-minus'></i> <div>" + show.userCurrentEpisode + '/' + show.numEpisodes + "</div> <i class='fa fa-plus'></i>"

  showBarElm.appendChild(dragElm);
  showBarElm.appendChild(titleElm);
  showBarElm.appendChild(typeElm);
  showBarElm.appendChild(yearElm);
  showBarElm.appendChild(ratingElm);
  showBarElm.appendChild(progressElm);
  showBarElm.appendChild(editElm);
  return showBarElm;
}

function getAddListModalElm() {
  let addListModalElm = Util.create('div', { id: 'add-list-modal' });
  addListModalElm.innerHTML = "\
    <div id='modal-name-section'>\
      <div>List Name: </div>\
      <input type='text' id='modal-name-input'></input>\
    </div>\
    <button id='modal-submit-btn'>Submit</div>\
    <button id='modal-cancel-btn'>Cancel</div>\
  "
  return addListModalElm;
}

function applyAddListModalListeners() {
  Util.one('#modal-submit-btn').addEventListener('click', function() {
    currentModal = null;
    let modalElm = Util.one('#add-list-modal');



    Util.one('body').removeChild(modalElm);
  });
  Util.one('#modal-cancel-btn').addEventListener('click', function() {
    currentModal = null;
    let modalElm = Util.one('#add-list-modal');
    Util.one('body').removeChild(modalElm);
  });
}