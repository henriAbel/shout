var _ = require("lodash");
var User = require("../../models/user");

module.exports = function(irc, network) {
	var client = this;
	irc.on("names", function(data) {
		var chan = _.findWhere(network.channels, {name: data.channel});
		if (typeof chan === "undefined") {
			return;
		}
		var users = chan.users;
		chan.users = [];
		_.each(data.names, function(u) {
			chan.users.push(new User(u));
		});
		_.each(users, function(u) {
			chan.findUser(u.name).away = u.away;
		});
		chan.sortUsers();
		client.emit("users", {
			chan: chan.id,
			users: chan.users
		});
	});
};
