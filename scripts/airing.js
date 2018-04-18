// Attach events to the document prior to the DOM being ready.
Util.events(document, {
	// This runs when the DOM is ready. 
    "DOMContentLoaded": function() {
        
      initAiringPageDOM();
        
    },
});

function initAiringPageDOM() {
  let showSectionElm = Util.one('#show-section');
  for(let day of daysOfWeek) {
    let daySectionElm = Util.create('div', {id: day.toLowerCase() + '-section', class: 'day-section'});
    let headerElm = Util.create('h2', {});
    headerElm.innerHTML = day;
    let showDisplayElm = Util.create('div', {id: day.toLowerCase() + '-show-display', class: 'airing-show-display'});

    showDisplayElm.appendChild(Util.create('i', {class: 'fa fa-caret-left'}));
    for(let i = 0; i < 5; i++) {
      showDisplayElm.appendChild(Util.create('div', {class: 'airing-show-container'}));
    } 
    showDisplayElm.appendChild(Util.create('i', {class: 'fa fa-caret-right'}));
    
    daySectionElm.appendChild(headerElm);
    daySectionElm.appendChild(showDisplayElm);
    showSectionElm.appendChild(daySectionElm);
  }
}
