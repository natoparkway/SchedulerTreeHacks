(function(window, document, undefined) {

	var reqTemplate = document.getElementById('requirements-template');
	var renderRequirements = Handlebars.compile(reqTemplate.innerHTML);

	var classes = [
		'CS 106A',
		'CS 106B',
		'CS 107',
		'CS 109',
		'CS 110',
		'CS 124'
	];

	$.get()

	var courses = [];

	var $search = $("#search-class");

	// create unordered list to hold suggestions
	var $suggestions = $('<ul></ul>').attr('id', 'suggestions').attr('class', 'list-group');	//id="suggestions"
	$search.after($suggestions);	//Insert $suggestions after $search

	SearchBar.setUp($search, $suggestions, classes, createIcon, courses);

	$modal = $("#class-up-close");

	$("body").click(function(event) {
		if(event.target.type === 'button') {
			if(event.target.className.indexOf('course') !== -1) {
				$('#class-up-close .modal-title').text(event.target.innerHTML);
				return;
			}
			
			//If the user clicks 'Delete Course' button
			if(event.target.innerHTML === 'Delete Course') {
				var courseName = $('.modal-title').text();
				$('.course').each(function(index) {
					if($(this).text() === courseName) {
						$(this).remove();
						var index = courses.indexOf(courseName);
						courses.splice(index, 1);

						return;
					}
				});
			}
		}
	});

//If we click the next button, move to next screen
	$(".nxt-btn").click(function(event) {
	  courses = processCoursesAndSend(courses);
	});


	var courseObjects = [];
	function addCourse(course, courses){
		course.quarter = "unscheduled-bucket";
		// courseObject = {"titleCode": elem, "quarter": false, "databaseId": index++};
		courseObjects.push(course);
		if (courseObjects.length === courses.length) {
			window.localStorage.setItem('courses', JSON.stringify(courseObjects));
	  		window.location.href = '/schedule';
		}
	}

	function processCoursesAndSend(courses) {
		var index = 0;
		courses.forEach(function(elem) {
			$.get("/data/classes/" + elem, function(response) {
				addCourse(response, courses);
			});
		});

		return courseObjects;
	}

	//Creates an icon for a given course. Passed as callback to searchBar.setup
	function createIcon(course, courses_array) {
		$searchBarArea = $("#enter-class-bar");
		var $newClass = $('<button></button>')
			.attr('type', 'button')
			.attr('data-toggle', 'modal')
			.attr('data-target', '#class-up-close')
			.attr('class', 'btn btn-lg course')
			.text(course);
		$searchBarArea.after($newClass);
		courses_array.push(course);
	}

	$.get("/data/requirements", function(json) {
		// console.log("Received: " + json);

		var requirements = JSON.parse(json);
		requirements.requirements.forEach(function(requirement){
			var requirementHTML = renderRequirements(requirement);
			var $requirement = $(requirementHTML);
			$('#requirements-wrapper').append($requirement);
		});
	});

	$.get("/data/course_names", function(json) {
		classes = JSON.parse(json);
		console.log(classes);
	});

  })(this, this.document);