var Entry = require('../../models/course.js');

var dbQuery = {};

dbQuery.getClass = function(subject, code){
	var result;

	var query = Entry.where({'subject': subject, 'code': code});

	query.findOne(function(error, myclass){
		if(error) throw error;

		/* If the class exists */
		if(myclass){
			result = myclass;
		}
	});

	return result;
}

window.DBQuery = dbQuery;

