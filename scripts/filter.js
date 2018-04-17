// Attach events to the document prior to the DOM being ready.
Util.events(document, {
	// This runs when the DOM is ready. 
    "DOMContentLoaded": function() {
        //Creates event listeners for all dropdowns.
        var dropdown = document.getElementsByClassName("dropdown-btn");
        for (let i = 0; i < dropdown.length; i++) {
          dropdown[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
              dropdownContent.style.display = "none";
            } else {
              dropdownContent.style.display = "block";
            }
          });
        }
        
    },
});
