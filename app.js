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

	getStream() {
		let url = `${this[urls].streams}/${this[credentials].userId}`;

		let request = this[get](url);
		request.catch((err) => {
			console.log(`status: ${err.response.status}, url: ${err.response.config.url}, params: ${err.response.config.params}, message: ${JSON.stringify(err.response.data)}`);
		});

		return request;
	}

	[get](url) {
		return axios({
		    method: 'GET',
		    url: url
		});
	}
}

module.exports = Twitch;