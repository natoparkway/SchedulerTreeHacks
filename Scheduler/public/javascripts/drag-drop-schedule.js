console.log("Hi!");

$(function () {
	$('[data-toggle="popover"]').popover({
	  	placement: 'top',
	  	html: true,
	});

	$('#testbutton').attr("data-content", '<button class="btn"><a href="http://test.com">Like</a></button>');

	
	$( "#autumn, #winter" ).sortable({
		connectWith: ".connectedSortable"
	}).disableSelection();
});



