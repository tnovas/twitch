let axios = require('axios');
let OAuth2 = require('oauth20');
let credentials = Symbol('credentials');
let urls = Symbol('urls');
let get = Symbol('get');

class Twitch extends OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, scopes, userLogin='', userId='', accessToken='', refreshToken='') {
		super(clientId, clientSecret, redirectUrl, scopes, 'https://api.twitch.tv/kraken/oauth2/', 'authorize', 'token');
		
		this[credentials] = {
			userLogin: userLogin,
			userId: userId
		};
		
		this[urls] = {
			base: 'https://api.twitch.tv/helix/',
			channels: 'users',
			streams: 'streams'
		};

		axios.defaults.baseurl = this[urls].base;
	}

	getStream(success, error) {
		let url = `${this[urls].streams}/${this[credentials].userId}`;

		this[get](url, success, error);
	}

	[get](url, success, error) {
		axios({
		    method: 'GET',
		    url: url
		})
		.then(success)
	    .catch(error);
	}
}

module.exports = Twitch;