$("#btn1").click(function(event) {
	$.get("/major_info", function(data) {
		console.log(data);
	})
});