let axios = require('axios');
let OAuth2 = require('oauth20');
let credentialsTwitch = Symbol('credentialsTwitch');
let urlsTwitch = Symbol('urlsTwitch');
let getTwitch = Symbol('getTwitch');

class Twitch extends OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, scopes, userId) {
		super(clientId, clientSecret, redirectUrl, scopes, 'https://api.twitch.tv/kraken/oauth2/', 'authorize', 'token');
		
		this[credentialsTwitch] = {
			userId: userId
		};
		
		this[urlsTwitch] = {
			channels: 'users',
			streams: 'streams'
		};

		axios.defaults.baseurl = 'https://api.twitch.tv/helix/';
	}

	getStream() {
		let url = `${this[urlsTwitch].streams}/${this[credentialsTwitch].userId}`;

		return this[getTwitch](url);
	}

	[getTwitch](url) {
		return axios({
		    method: 'GET',
		    url: url
		}).catch((err) => console.log(`status: ${err.response.status}, url: ${err.response.config.url}, params: ${err.response.config.params}, message: ${JSON.stringify(err.response.data)}`));
	}
}

module.exports = Twitch;