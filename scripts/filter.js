// Define filter options to remember.
var previousFilterOptions;
var currentFilterOptions;

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

      // To keep track of changes.
      addChangeListeners();
      Util.one("#filter-button").addEventListener("click", updateFilterState);

      // Initialize previous filter options to be empty.
      previousFilterOptions = defaultOptions();
      currentFilterOptions = defaultOptions();
    },
});

// Updates our previously stored options as well as the current state of the filter.
function updateFilterState(e) {
  // First, disable the Apply Filter button.
  enableFilter(false);

  // Then, shuffle the current options into previousFilterOptions.
  previousFilterOptions = currentFilterOptions;
  currentFilterOptions = Object.assign({}, previousFilterOptions);
}

// Conditionally enables or disables the filter checkbox depending on what options were selected previously.
function handleApplyFilterState(e) {
  // Update the current state.
  let currentElt = e.currentTarget;
  if (currentElt.type == "checkbox") {
    currentFilterOptions[currentElt.value] = currentElt.checked;
  } else if (currentElt.type == "range") {
    currentFilterOptions['min-rating'] = Util.one("#min-rating").innerHTML;
    currentFilterOptions['max-rating'] = Util.one("#max-rating").innerHTML;
  }

  // Check if the state is different from the previous. If it is, enable the button, otherwise disable it.
  if (JSON.stringify(previousFilterOptions) === JSON.stringify(currentFilterOptions)) {
    enableFilter(false);
  } else {
    enableFilter(true);
  }
}

// Apply a listener for change to each of the dropdown elements.
function addChangeListeners() {
  for (let input of document.getElementById("filter").getElementsByTagName("input")) {
    input.addEventListener("change", handleApplyFilterState);
  }
}

// Establishes the initial DOM as well as listeners for dropdowns in the filter section.
function initFilterSetup() {
  // Creates event listeners for all dropdowns and update the DOM.
  let dropdown = document.getElementsByClassName("dropdown-btn");
  for (let element of dropdown) {
    /*element.nextElementSibling.classList.toggle("gone");*/
    element.addEventListener("click", function() {
      if (this.children[0].classList == 'fa fa-caret-up') {
        this.children[0].classList = 'fa fa-caret-down';
      } else {
        this.children[0].classList = 'fa fa-caret-up';
      }
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
    // Define a label for input box.
    let newLabel = Util.create("label");

    // Define a new input box.
    let newInput = document.createElement("input");
    newInput.type = "checkbox";
    newInput.value = item;
    newInput.classList.add("filter-checkbox");
    newInput.classList.add(sectionName + "-filter-checkbox");

    // Append the new elements to the genre div.
    newLabel.appendChild(newInput);
    newLabel.innerHTML += item;
    container.appendChild(newLabel);
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

// ---------- HELPER/SETUP METHODS

// Enables or disables the Apply Filter button.
// @param shouldEnable boolean determining if we enable or disable
function enableFilter(shouldEnable) {
  var filterButton = Util.one("#filter-button");
  if (shouldEnable) {
    filterButton.classList.remove("disabled-filter-button");
    filterButton.classList.add("enabled-filter-button");
    filterButton.disabled = false;
  } else {
    filterButton.classList.remove("enabled-filter-button");
    filterButton.classList.add("disabled-filter-button");
    filterButton.disabled = true;
  }
}

// Creates a default state for the initial filter options
function defaultOptions() {
  let options = {};
  for (let input of document.getElementById("filter").getElementsByTagName("input")) {
    if (input.type == "checkbox") {
      options[input.value] = input.checked;
    } else if (input.type == "range") {
      options[input.id] = input.value;
    }
  }

  // Specify the min and max ratings.
  options['min-rating'] = "1.0";
  options['max-rating'] = "10.0";
  return options;
}
