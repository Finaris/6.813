let userLists = getMyListsData();
let idNamesToDisplayNames = getIdNamesToDisplayNames();
let currentModal = null;
let currentHeaderDict = null;
let inEditMode = false;
let listTitles = ["To Watch", "Watching", "Completed"]; //can avoid hardcoding later if desired

// Attach events to the document prior to the DOM being ready.
Util.events(document, {
  // This runs when the DOM is ready.
  "DOMContentLoaded": function() {
    initDOM();
    initListeners();
    onListBtnClick('towatch-btn');
  },
  
  // Keyboard events arrive here
	"keydown": function(evt) {
    let key = evt.code;
    if (key == 'Enter') {
      let addSectionPlusElm = Util.one('#add-section-name-input');
      if (addSectionPlusElm != null) {
        let showSectionElm = Util.one('#shows-section');
        let addSectionElm = showSectionElm.lastChild;
        let newSectionName = Util.one('#add-section-name-input').value;
        if (newSectionName.length != 0 && !(newSectionName in currentHeaderDict)) {
          currentHeaderDict[newSectionName] = [];

          showSectionElm.removeChild(addSectionElm);
          showSectionElm.appendChild(getHeaderBarElm(newSectionName, 0, true));
          showSectionElm.appendChild(getAddSectionElm());
          showSectionElm.scrollTop = showSectionElm.scrollHeight; 
          
          let newSectionNameElm = Util.one('#add-section-name-input');
          newSectionNameElm.focus();
        }
      }  
      
      if (currentModal != null) {
        onAddListSubmitBtn();
      }
    } 
	}
});

function onListBtnClick(listBtnId) {
  updateTabBorders(listBtnId);

  clearHeaderShowBars();
  updateBars(listBtnId);
  
  let mainBarEditElm = Util.one('#main-bar-edit');
  mainBarEditElm.classList.add('fa-edit');
  mainBarEditElm.classList.remove('fa-check');
  inEditMode = false;
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
      Util.one('#modal-name-input').focus();
    }
  });

  Util.one('#stats-btn').addEventListener('click', function(evt) {
    location.href='./stats.html?list='+Util.one('#current-list-name').innerHTML;
  });

  Util.one('#delete-btn').addEventListener('click', function(evt) {
    let currList = Util.one('#current-list-name').innerHTML;
    let currListID = getIdNameFromDisplayName(currList);

    let index = listTitles.indexOf(currList);

    if(listTitles.length > 1) { //will kinda break otherwise; ideally we don't have to handle this...
      let nextList = null;
      if(index === listTitles.length-1) {
        nextList = listTitles[listTitles.length-2];
      } else {
        nextList = listTitles[index+1];
      }
      let nextListID = getIdNameFromDisplayName(nextList);
      onListBtnClick(nextListID + '-btn');
    }
    Util.one('#'+currListID+'-btn').remove();
    listTitles.splice(index, 1);
  });
  
  Util.one('#main-bar-edit').addEventListener('click', function(evt) {  
    onMainEditBtn();
  });
}

function initDOM() {
  
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

  // Update header dictionary
  currentHeaderDict = userLists[listDisplayName];

  // Update main bar
  Util.one('#current-list-name').innerHTML = listDisplayName;
  Util.one('#num-elms-in-list').innerHTML = userLists[listDisplayName].All.length;

  // Update header and show bars
  for (let header in currentHeaderDict) {
    if (header == 'All') {
      continue;
    }
    showSectionElm.appendChild(getHeaderBarElm(header, currentHeaderDict[header].length, false));
  }
}

function clearHeaderShowBars() {
  let showSectionElm = Util.one('#shows-section');
  let currentChild = showSectionElm.firstChild;
  while (currentChild != null) {
    let temp = currentChild
    currentChild = currentChild.nextSibling;
    showSectionElm.removeChild(temp);
  }
  showSectionElm.scrollTop = 0;
}

function getHeaderBarElm(headerDisplayName, numShowsInHeader, inEditing) {
  let showSectionElm = Util.one('#shows-section');
  let headerBarId = getIdNameFromDisplayName(headerDisplayName) + '-header-bar';
  let headerBarElm = Util.create('div', { id: headerBarId, class: 'header-bar' });

  let dragElm = Util.create('i', { class: 'fa fa-bars header-bar-drag' });
  let textElm = Util.create('div', { class: 'header-bar-text left-align' });
  textElm.innerHTML = headerDisplayName + ' (' + numShowsInHeader + ')';
  let dropdownElm = Util.create('i', { class: 'fa fa-caret-down header-bar-dropdown' });
  let minusBtnElm = Util.create('i', { class: 'fa fa-minus-circle header-minus-btn gone'})
  if (inEditing) {
    minusBtnElm.classList.toggle('gone');
  }
  
  minusBtnElm.addEventListener('click', function(evt) {
    evt.stopPropagation();
    console.log('HI');
  });

  headerBarElm.addEventListener('click', function(evt) {
    let shows = currentHeaderDict[headerDisplayName];
    headerBarElm.children[2].classList.toggle('fa-caret-down');
    headerBarElm.children[2].classList.toggle('fa-caret-up');
    if (shows.length == 0) {
      return;
    }
    // headerBarElm.nextSibling is the next subsection
    if (headerBarElm.nextSibling == null) { // last subsection on the page
      for (let show of shows) {
        showSectionElm.appendChild(getShowBarElm(show));
      }
      headerBarElm.classList.add('active');
    } 
    else if (headerBarElm.nextSibling.classList.contains('header-bar')) {
      for (let show of shows) {
        showSectionElm.insertBefore(getShowBarElm(show), headerBarElm.nextSibling);
      }
      headerBarElm.classList.add('active');
    } else if (headerBarElm.nextSibling.id == 'add-section') {
      for (let show of shows) {
        showSectionElm.insertBefore(getShowBarElm(show), headerBarElm.nextSibling);
      }
      headerBarElm.classList.add('active');
    } else { // collapsing the subsections for the header bar
      while ( headerBarElm.nextSibling != null && headerBarElm.nextSibling.classList.contains('show-bar')) {
        showSectionElm.removeChild(headerBarElm.nextSibling);
      }
      headerBarElm.classList.remove('active');
    }
  });

  headerBarElm.appendChild(dragElm);
  headerBarElm.appendChild(textElm);
  headerBarElm.appendChild(dropdownElm);
  headerBarElm.appendChild(minusBtnElm);
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
    <button id='modal-submit-btn'><div class='popup-colorful-button-text'>Submit</div></div>\
    <button id='modal-cancel-btn'><div class='popup-colorful-button-text'>Cancel</div></div>\
  "
  return addListModalElm;
}

function applyAddListModalListeners() {
  Util.one('#modal-submit-btn').addEventListener('click', function() {
    onAddListSubmitBtn();
  });
  Util.one('#modal-cancel-btn').addEventListener('click', function() {
    currentModal = null;
    let modalElm = Util.one('#add-list-modal');
    Util.one('body').removeChild(modalElm);
  });
}

function onAddListSubmitBtn() {
  currentModal = null;
  let modalElm = Util.one('#add-list-modal');
  let newListDisplayName = Util.one('#modal-name-input').value;
  let newListIdName = getIdNameFromDisplayName(newListDisplayName);

  if (newListIdName != '') {
    // Make and add tab
    let tabElm = Util.create('div', {id: newListIdName + '-btn', class: 'list-btn list-btns-btn'});
    tabElm.innerHTML = newListDisplayName;
    let blockerElm = Util.create('div', {class: 'tab-blocker not-blocking'});
    tabElm.appendChild(blockerElm);
    Util.one('#list-btns-section').insertBefore(tabElm, Util.one('#add-list-btn'));

    // Add listener to tab
    tabElm.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('list-btn')) {
        onListBtnClick(evt.target.id);
      }
    });

    // Update data structures
    idNamesToDisplayNames[newListIdName] = newListDisplayName;
    userLists[newListDisplayName] = {'All': []};
    listTitles.push(newListDisplayName);

    // Update make it as if one clicked the new shows tab button
    onListBtnClick(newListIdName + '-btn')

    Util.one('body').removeChild(modalElm);
    
    onMainEditBtn();
  }
}

function onMainEditBtn() {
  let showSectionElm = Util.one('#shows-section');
    
  // toggle minuses display on existing elements
  for (let barElm of Util.all('.fa.fa-minus-circle')) {
    barElm.classList.toggle('gone');
  }

  // add 'Add Section' part
  if (inEditMode) {
    showSectionElm.removeChild(showSectionElm.lastChild);
  } else {
    showSectionElm.appendChild(getAddSectionElm());
  }

  // toggle edit/check icon on main bar
  toggleMainBarEditElm();

  // update position of scroll wheel
  if (!inEditMode) {
    showSectionElm.scrollTop = showSectionElm.scrollHeight;
  }

  // update focus
  if (!inEditMode) {
    let newSectionNameElm = Util.one('#add-section-name-input');
    newSectionNameElm.focus();
  }

  // update data state
  inEditMode = !inEditMode;
}

function getIdNameFromDisplayName(displayName) {
  return displayName.toLowerCase().replace(/\s+/g, '');
}

function toggleMainBarEditElm() {
  let mainBarEditElm = Util.one('#main-bar-edit');
  mainBarEditElm.classList.toggle('fa-edit');
  mainBarEditElm.classList.toggle('fa-check');
}

function getAddSectionElm() {
  let addSectionElm = Util.create('div', { id: 'add-section' });

  let addBtnElm = Util.create('i', { id: 'add-section-plus-btn', class: 'fa fa-plus-circle' });
  let nameInputElm = Util.create('input', { id: 'add-section-name-input', type: 'text', placeholder: 'Section Name', class: 'left-align' });
  
  addBtnElm.addEventListener('click', function(evt) {
    let showSectionElm = Util.one('#shows-section');
    let newSectionName = Util.one('#add-section-name-input').value;
    
    if (newSectionName.length != 0 && !(newSectionName in currentHeaderDict)) {
      currentHeaderDict[newSectionName] = [];
    
      showSectionElm.removeChild(addSectionElm);
      showSectionElm.appendChild(getHeaderBarElm(newSectionName, 0, true));
      showSectionElm.appendChild(getAddSectionElm());
      showSectionElm.scrollTop = showSectionElm.scrollHeight;   
    }
  });
  
  addSectionElm.appendChild(addBtnElm);
  addSectionElm.appendChild(nameInputElm);
  return addSectionElm;
}
