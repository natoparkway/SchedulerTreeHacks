$("#btn1").click(function(event) {
	$.get("/data/major_info", function(data) {
		console.log("Recieved: " + data);
	})
});