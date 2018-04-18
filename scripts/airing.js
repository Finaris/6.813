const maxShowsPerRow = 5;
const airingShowsByDay = getAiringShowsData();

// Attach events to the document prior to the DOM being ready.
Util.events(document, {
	// This runs when the DOM is ready. 
    "DOMContentLoaded": function() {
        
      initAiringPageDOM();
        
    },
});

function initAiringPageDOM() {
  let daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let showSectionElm = Util.one('#show-section');
  for(let day of daysOfWeek) {
    if (airingShowsByDay[day].length == 0) {
      continue;
    }
    let daySectionElm = Util.create('div', {id: day.toLowerCase() + '-section', class: 'day-section'});
    let headerElm = Util.create('h2', {});
    headerElm.innerHTML = day;
    let showDisplayElm = Util.create('div', {id: day.toLowerCase() + '-show-display', class: 'airing-show-display'});

    let leftButton = Util.create('button', {class: 'left-button'});
    leftButton.appendChild(Util.create('i', {class: 'fa fa-angle-left'}));
    let rightButton = Util.create('button', {class: 'right-button'});
    rightButton.appendChild(Util.create('i', {class: 'fa fa-angle-right'}));
    let showSliderOuter = Util.create('div', {class: 'show-slider-outer'});
    let showSlider = Util.create('ul', {id: day.toLowerCase() + '-show-slider',class: 'show-slider'});
    
//    let childNodes = showSlider.childNodes;
//    for(let show of airingShowsByDay[day]) {
//      childNodes.push(getAiringListElmFromShowData(show));
//    }
    
    
    showSliderOuter.appendChild(showSlider);
    showDisplayElm.appendChild(leftButton);
    showDisplayElm.appendChild(showSliderOuter);
    showDisplayElm.appendChild(rightButton);
    
    daySectionElm.appendChild(headerElm);
    daySectionElm.appendChild(showDisplayElm);
    showSectionElm.appendChild(daySectionElm);
  }
}

function getAiringListElmFromShowData(show) {
  let showElm = Util.create('li', {class: 'airing-show-container'});
  return showElm;
}
