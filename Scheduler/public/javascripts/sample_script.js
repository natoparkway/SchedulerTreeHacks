$("#btn1").click(function(event) {
	$.get("/courses", function(data) {
		console.log("Recieved: " + data);
	})
});