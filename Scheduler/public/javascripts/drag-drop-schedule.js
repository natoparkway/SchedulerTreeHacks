(function(window, document, undefined) {
	var SCHEDULE_DATA_URL = '/data/schedule';
	var STATUS_OK = 200;
	var schedule = {};

	var courseTemplate = document.getElementById('draggable-class-template');
	var renderCourse = Handlebars.compile(courseTemplate.innerHTML);


	var renderPost = function(course) {
		var courseHTML = renderCourse(course);
		var $course = $(courseHTML);
		if (!course.quarter) {
			$('#unscheduled-bucket').append(course);
		} else {
			var divId = '#' + course.quarter;
			$(divId).append($course);
		}
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
	loadAll(function(error, courseSchedule) {
		if (error) {
			throw error;
		} else {
			courseSchedule.data.forEach(function(course) {
				renderPost(course);
			})
		}
	});


	$(function () {
		$('[data-toggle="popover"]').popover({
		  	placement: 'right',
		  	html: true
		});

		$( ".connectedSortable" ).sortable({
			connectWith: ".connectedSortable",
			items: "div:not(.drag-disabled)",
			receive: function(event, ui) {
				var quarter = event.target.id;
				ui.item

			}
		}).disableSelection();
	});

$( "#autumn, #winter" ).sortable({
	connectWith: ".connectedSortable"
}).disableSelection();

})(this, this.document);

})(this, this.document);
