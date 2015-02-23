(function(window, document, undefined) {

//Majors list. This should eventually be changed to be all possible majors.
var majors = [
'Computer Science',
'HumBio',
'Mathematics',
'MCS',
'Architectural Design',
'Biomechanical Engineering',
'Biomedical Computation',
'Chemical Engineering',
'Civil and Environmental Engineering',
'Electrical Engineering',
'Engineering Physics',
'Management Science and Engineering',
'Materials Science and Engineering',
'Mechanical Engineering',
'Product Design'
];

//Search bar.
var $search = $('#search-major');

// create unordered list to hold suggestions
var $suggestions = $('<ul></ul>').attr('id', 'suggestions').attr('class', 'list-group');	//id="suggestions"
$search.after($suggestions);	//Insert $suggestions after $search

//Search bar module sets up 'suggestion' functionality
SearchBar.setUp($search, $suggestions, majors);

//If we click the next button, move to next screen.
//We DO NOT currently pass major information
$(".nxt-btn").click(function(event) {
	//If indicated major is not in the given list, indicate to try again.
	if(majors.indexOf($("#search-major").val()) === -1) {
		//If we have already inserted a div here, remove it.
		$existingLabel = $("#no-major");
		if($existingLabel) $existingLabel.remove();

		//Then add a new label.
		event.preventDefault();
		var $noMajor = $('<div></div>')
			.attr('id', 'no-major')
			.text('Please enter a valid Stanford Major');

		$('#go-btn').before($noMajor);
		return;
	}
  window.location.href = "/courses";// + $("#search-major").val();
});


})(this, this.document);
