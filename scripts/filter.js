// Attach events to the document prior to the DOM being ready.
Util.events(document, {
	// This runs when the DOM is ready.
    "DOMContentLoaded": function() {
      initFilterSetup();

      // All dropdown buttons.
      let dropdownContainers = document.getElementsByClassName("dropdown-container");

      // Apply relevant checkboxes for sections.
      for (let element of dropdownContainers) {
        if (element.id === "genre-container") {
          setupFilterSection("genre", genres);
        } else if (element.id === "list-container") {
          setupFilterSection("list", lists);
        } else if (element.id === "status-container") {
          setupFilterSection("status", statuses);
        }
      }

    },
});

// Establishes the initial DOM as well as listeners for dropdowns in the filter section.
function initFilterSetup() {
  //Creates event listeners for all dropdowns and update the DOM.
  let dropdown = document.getElementsByClassName("dropdown-btn");
  for (let element of dropdown) {
    /*element.nextElementSibling.classList.toggle("gone");*/
    element.addEventListener("click", function() {
      this.classList.toggle("active");
      this.nextElementSibling.classList.toggle("gone");
    });
   }
}

/**
* Fills the DOM with a list of checkboxes using the input list.
*
* @param sectionName name of the filter section to edit
* @param sourceList list which we will use to generate
*/
function setupFilterSection(sectionName, sourceList) {
  let container = document.getElementById(sectionName + "-container");

  let sortedSourceList = sourceList.sort();
  for (let item of sortedSourceList) {
    let newSectionDiv = document.createElement("div");


    // Define a new input box.
    let newInput = document.createElement("input");
    newInput.type = "checkbox";
    newInput.value = item;
    newInput.classList.add("filter-checkbox");
    newInput.classList.add(sectionName + "-filter-checkbox");

    // Append the new elements to the genre div.
    newSectionDiv.appendChild(newInput);
    newSectionDiv.innerHTML += item;
    container.appendChild(newSectionDiv);
  }
}

function getFilterDict() {
  let filter = {
    genres: new Set([]),
    minRating: Util.one('#min-rating').value,
    maxRating: Util.one('#max-rating').value,
    lists: new Set([]),
    statuses: new Set([])
  };
  
  let genreCheckboxElms = Util.all('.genre-filter-checkbox');
  for (let elm of genreCheckboxElms) {
    if (elm.checked) {
      filter.genres.add(elm.value);
    }
  }
  
  let statusCheckboxElms = Util.all('.status-filter-checkbox');
  for (let elm of statusCheckboxElms) {
    if (elm.checked) {
      filter.statuses.add(elm.value);
    }
  }
    
  return filter;
}

// Only filters by show properties (i.e. not by lists)
function filterShowsGivenFilter(shows, filter) {
  let filteredShows = shows.filter(function(show) {
    if (Number(show.rating) < filter.minRating || Number(show.rating) > filter.maxRating) {
      return false;
    }
    
    if (filter.genres.size > 0) {
      console.log('HI')
      let failed = true;
      for (let genre of show.genres) {
        if (filter.genres.has(genre)) {
          failed = false;
          break;
        }
      }
      if (failed) {
        return false;
      }
    }
    
    if (filter.statuses.size > 0 && !filter.statuses.has(show.status)) {
      return false;
    }
    return true;
  });
  
  console.log(filteredShows);
  return filteredShows;
}
