let userLists = getMyListsData();
let idNamesToDisplayNames = getIdNamesToDisplayNames();

// Attach events to the document prior to the DOM being ready.
Util.events(document, {
	// This runs when the DOM is ready.
    "DOMContentLoaded": function() {

      onListBtnClick('towatch-btn');
      initListeners();
    },
});

function onListBtnClick(listBtnId) {
  updateTabBorders(listBtnId);
  updateMainBar(listBtnId);
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
}

//------------------------------------------------------- Helper Functions -----------------------------------------------------------//

function updateTabBorders(listBtnId) {
  let listBtnElms = Util.all('.list-btn');
  for (let listBtnElm of listBtnElms) {
    if (listBtnId == listBtnElm.id) {
      listBtnElm.lastChild.classList.remove('not-blocking');
    } else {
      listBtnElm.lastChild.classList.add('not-blocking');
    }
  }
}

function updateMainBar(listBtnId) {
  let listIdName = listBtnId.slice(0,-4);
  Util.one('#current-list-name').innerHTML = idNamesToDisplayNames[listIdName];
  Util.one('#num-elms-in-list').innerHTML = userLists[idNamesToDisplayNames[listIdName]].All.length;
}

function updateHeaderShowBars(listBtnId) {
  
}

function clearHeaderShowBars() {
  
}
