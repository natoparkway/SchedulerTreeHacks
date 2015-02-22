(function(window, document, undefined) {
	var SearchBar = {};

	// numeric identifiers for enter, down, and up arrow keys
  var ENTER_KEY_CODE = 13;
  var DOWN_ARROW_KEY_CODE = 40;
  var UP_ARROW_KEY_CODE = 38;

	SearchBar.setUp = function($search, $suggestions, list) {
		var previousTerm = '';

		//Add key listeners
	  $search.bind('keyup', function(event) {
	  	if(event.keyCode === ENTER_KEY_CODE) {
	  		event.preventDefault();
	  		return;
	  	}

	  	var searchTerm = $search.val().toLowerCase();
	  	if(searchTerm === previousTerm) return;	//Do nothing if the search term has not changed

	  	//Reset suggestions
	  	$suggestions.html('');

	  	if(searchTerm !== '') {
	  		list.forEach(function(elem) {
	  			if (elem.toLowerCase().indexOf(searchTerm) === 0) {
	  				$('<li></li>')
	  				.attr('class', 'list-group-item')
	  				.text(elem)
	  				.appendTo($suggestions);
	  			}
	  		});
	  	}

	  	previousTerm = searchTerm;
	  });

	  $suggestions.click(function(event) {
	    $search.val(event.target.innerHTML);
	    $suggestions.html('');
	  });

	  $search.bind('keydown', function(event) {
	  	if (event.keyCode === DOWN_ARROW_KEY_CODE) {
	      // down arrow goes to next suggestion
	      event.preventDefault();
	      selectNextSuggestion($suggestions);
	    } else if (event.keyCode === UP_ARROW_KEY_CODE) {
	      // up arrow goes to previous suggestion
	      event.preventDefault();
	      selectPreviousSuggestion();
	    } else if (event.keyCode === ENTER_KEY_CODE) {
	      // enter key uses a suggestion
	      event.preventDefault();
	      useSelectedSuggestion($search, $suggestions);
	    }
	  });
	}

  /* Returns the currently selected suggestion in the unordered list or
  * null if no such suggestion exists. */
  function getSelectedSuggestion() {
  	return $('#suggestions .selected');
  }

  /* Sets the selected suggestion and deselects the old selected suggestion.
   *
   * Arguments:
   * $suggestion -- the new suggestion to select
   * $oldSuggestion -- the old suggestion to deselect
   */
   function setSelectedSuggestion($suggestion, $oldSuggestion) {
   	if ($oldSuggestion) {
   		$oldSuggestion.removeClass('selected');
   	}

   	$suggestion.addClass('selected');
   }

  /* Moves the selected suggestion to the next list element. */
  function selectNextSuggestion($suggestions) {
   	var $selected = getSelectedSuggestion();

   	if ($selected.length === 0) {
      // no selected suggestion; select the first one
        setSelectedSuggestion($suggestions.children().eq(0));
      
      } else if ($selected.next().length > 0) {
      	setSelectedSuggestion($selected.next(), $selected);
      }
    }

  /* Moves the selected suggestion to the previous list element. */
  function selectPreviousSuggestion() {
  	var $selected = getSelectedSuggestion();

  	if ($selected.length !== 0) {
  		if ($selected.prev().length > 0) {
  			setSelectedSuggestion($selected.prev(), $selected);
  		} else {
          // no previous suggestion; deselect all suggestions
          setSelectedSuggestion($(), $selected);
        }
      }
    }

  /* Use the currently selected suggestion, setting the value of the search
  * input to it. */
  function useSelectedSuggestion($search, $suggestions) {
  	var $selected = getSelectedSuggestion();

  	if ($selected.length !== 0) {
  		$search.val($selected.text());
  	}

  	$suggestions.html('');
  }


 	window.SearchBar = SearchBar;
})(this, this.document);