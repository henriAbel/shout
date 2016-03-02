var _ = require("lodash");

module.exports = function(irc, network) {
	var client = this;
	var changes = false;
	irc.on("data", function(msg) {
		if (msg.command !== 'RPL_WHOREPLY' && msg.command !== 'RPL_ENDOFWHO') return;
		if (msg.command === 'RPL_ENDOFWHO') {
			if (changes) {
				changes = false;
				var chan = _.findWhere(network.channels, {name: msg.params.split(' ')[1]});
				client.emit("users", {
					chan: chan.id,
					users: chan.users
				});
			}
			return;
		}

		var split = msg.params.split(' ');
		var away = split[6].indexOf('G') !== -1;
		var user = split[5].replace('~', '');

		var chan = _.findWhere(network.channels, {name: split[1]});
		if (typeof chan === "undefined") {
			return;
		}

		var chanUser = chan.findUser(user);
		if (chanUser !== undefined) {
			var usr = chan.findUser(user);
			if (usr.away !== away) {
					usr.away = away;
					changes = true;
			}
		}
		else {
			console.log(msg);
		}
	});
};
