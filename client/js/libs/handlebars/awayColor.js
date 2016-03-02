Handlebars.registerHelper(
	'awayColor', function(str) {
    console.log(str);
		return str ? 'user-away' : 'user-back';
	}
);
