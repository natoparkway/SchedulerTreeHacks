(function(window, document, undefined) {

var majors = [
'Computer Science',
'HumBio',
'Mathematics',
'MCS',
'M1',
'M2',
'M3',
'M4',
'M5',
'M6',
'M7'
];

var $search = $('#search-major');

// create unordered list to hold suggestions
var $suggestions = $('<ul></ul>').attr('id', 'suggestions').attr('class', 'list-group');	//id="suggestions"
$search.after($suggestions);	//Insert $suggestions after $search

SearchBar.setUp($search, $suggestions, majors);

//If we click the next button, move to next screen
$(".nxt-btn").click(function(event) {
  window.location.href = "/courses/" + $("#search-major").val();
});


})(this, this.document);
