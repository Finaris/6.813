const maxShowsPerRow = 5;
const airingShowsByDay = getAiringShowsData(100);

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
    let showsOnDay = airingShowsByDay[day];
    
    
    let daySectionElm = Util.create('div', {id: day.toLowerCase() + '-section', class: 'day-section'});
    let headerElm = Util.create('h2', {});
    headerElm.innerHTML = day;
    
    let showDisplayID = day.toLowerCase() + '-show-display';
    let showDisplayElm = Util.create('div', {id: showDisplayID, class: 'airing-show-display carousel slide'});
    showDisplayElm.setAttribute("data-interval", "false");
    
    
    let carouselInnerElm = Util.create('div', {class: 'carousel-inner', role: 'listbox'});
    
    let showNumber = 0;
    let carouselItemElm = Util.create('div', {class: "carousel-item row no-gutters active"})
    for(let show of showsOnDay) {
      if (showNumber == 5) {
        showNumber = 0;
        carouselInnerElm.appendChild(carouselItemElm);
        carouselItemElm = Util.create('div', {class: "carousel-item row no-gutters"})
      }
      carouselItemElm.appendChild(getShowElmFromShowData(show));
      showNumber++;
    }
    carouselInnerElm.appendChild(carouselItemElm);
    
    
    let leftButtonElm = Util.create('a', {class: 'carousel-control-prev', href: '#' + showDisplayID, role: "button", 'data-slide': "prev"});
    leftButtonElm.appendChild(Util.create('span', {class: 'carousel-control-prev-icon', 'aria-hidden': "true"}));
    let rightButtonElm = Util.create('a', {class: 'carousel-control-next', href: '#' + showDisplayID, role: "button", 'data-slide': "next"});
    rightButtonElm.appendChild(Util.create('span', {class: 'carousel-control-next-icon', 'aria-hidden': "true"}));
    
    
    showSectionElm.appendChild(daySectionElm);
    daySectionElm.appendChild(headerElm);
    daySectionElm.appendChild(showDisplayElm);
    showDisplayElm.appendChild(carouselInnerElm);
    showDisplayElm.appendChild(leftButtonElm);
    showDisplayElm.appendChild(rightButtonElm);
  }
}

function getShowElmFromShowData(show) {
  let showElm = Util.create('div', {class: 'airing-show-container col-3 float-left'});
  let imgElm = Util.create('img', {src: show.img, class: 'show-img img-fluid'});
  showElm.appendChild(imgElm);
  return showElm;
}