(function(window, document, undefined) {
	var SCHEDULE_DATA_URL = '/data/schedule';
	var STATUS_OK = 200;
	// var $courses = [];
	var courses = [];

	var selectedId = false;

	var courseTemplate = document.getElementById('draggable-class-template');
	var renderCourse = Handlebars.compile(courseTemplate.innerHTML);

	var renderAndPlaceCourse = function(course) {
		
		var courseHTML = renderCourse(course);
		var $course = $(courseHTML);

		courses.push(course);
		// $courses.push($course);

		if (!course.quarter) {
			$('#unscheduled-bucket').append($course);
		} else {
			var divId = '#' + course.quarter;
			$(divId).append($course);
		}
		$('.remove').click(function(event){
			event.preventDefault();
			var $course = $(this).parent();

			setQuarter($course, false);

			$('#unscheduled-bucket').append($course);
		});
	}
	
	var loadAll = function(callback) {
		var request = new XMLHttpRequest();
		request.addEventListener('load', function() {
			if (request.status !== STATUS_OK) {
				callback(request.responseText, null);
			} else {
				var results = JSON.parse(request.responseText);
				callback(null, results);
			}
		});
		request.open('GET', SCHEDULE_DATA_URL, true);
		request.send();
	}

	function parseFromUrl(key) {
		var result = false, tmp = [];
		var items = location.search.substr(1).split("&");
		for (var index = 0; index<items.length; index++) {
			var equalityIndex = items[index].indexOf("=");
			var thisKey = items[index].substr(0, equalityIndex);
			var thisVal = items[index].substr(equalityIndex+1);
			console.log(thisKey);
			if (thisKey === key) result = decodeURIComponent(thisVal);
		}
		console.log(result);
		return result;
	}

	function renderFromJSON(json) {
		var courseChoices = JSON.parse(json);
		courseChoices.forEach(function(course) {
			renderAndPlaceCourse(course);
		});
	}	
	function renderFromUrl() {
		console.log("Rendering...");
		var encodedCourses = parseFromUrl("courses");

		// Demo fallback if the URL has no courses encoded
		if (!encodedCourses) {
			loadAll(function(error, courseSchedule) {
				if (error) {
					throw error;
				} else {
					courseSchedule.data.forEach(function(course) {
						renderAndPlaceCourse(course);
					});
				}
			});
		} else {
			var coursesJSON = atob(encodedCourses);
			renderFromJSON(coursesJSON);
		}
	}

	function renderFromLocalStorage() {
		var coursesJSON = window.localStorage.getItem('courses');
		renderFromJSON(coursesJSON);
	}

	// console.log("Localstorage: " + window.localStorage.getItem('courses'));
	// window.localStorage.setItem('courses', 1);

	if (window.localStorage.getItem('courses') === "1") {
		renderFromUrl();
	}
	else {
		renderFromLocalStorage();
	}


	function matchId(element, index, array) {
		return (selectedId === element.databaseId);
	}

	function getCourseIndex($course) {
		var selectedId = $course.attr("id"); // eg course97
		var databaseId = parseInt(selectedId.substr(6)); // eg 97
		var idArray = courses.map(function(x) {return x.databaseId});
		return idArray.indexOf(databaseId);
	}

	function setQuarter($course, quarter) {
		var index = getCourseIndex($course);

		if (index !== -1)
			courses[index].quarter = quarter;

		var courseJSON = JSON.stringify(courses);
		window.localStorage.setItem('courses', courseJSON);
		console.log(window.localStorage.getItem('courses'));
	}

	$(function () {
		$('[data-toggle="popover"]').popover({
		  	placement: 'right',
		  	html: true
		});

		$( ".connectedSortable" ).sortable({
			connectWith: ".connectedSortable",
			items: "div:not(.drag-disabled)",
			receive: function(event, ui) {
				var quarter = event.target.id; // TEST THIS
				setQuarter($(ui.item), quarter);
			}
		}).disableSelection();
	});

$( "#autumn, #winter" ).sortable({
	connectWith: ".connectedSortable"
}).disableSelection();

})(this, this.document);

/*
 * Matt To Do's:
 * Saving to localStorage - done!
 * Integrate with Kenny's algorithm
 * Calling from database
 */
