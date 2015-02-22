(function(window, document, undefined) {

$('[data-toggle="popover"]').popover({
  	placement: 'top',
  	html: true,
});

$('#class1').attr('title', 'CS103');
$('#class1').attr("data-content", '<button class="btn"><a href="http://test.com">Like</a></button>');



$( "#autumn, #winter" ).sortable({
	connectWith: ".connectedSortable"
}).disableSelection();

})(this, this.document);

