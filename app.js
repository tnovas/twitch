let request = require('axios');
let OAuth2 = require('oauth20');

class Twitch extends OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, scopes, userLogin='', userId='', accessToken='', refreshToken='') {
		super(clientId, clientSecret, redirectUrl, scopes, 'https://api.twitch.tv/kraken/oauth2/', 'authorize', 'token');
		
		this.__credentials = {
			userLogin: userLogin,
			userId: userId
		};
		
		this.__urlApi = {
			base: 'https://api.twitch.tv/helix/',
			channels: 'users',
			streams: 'streams'
		};
	}

	getStream(success, error) {
		let url = `${this.__urlApi.base}${this.__urlApi.streams}/${this.__credentials.channelId}`;

		this.__get(url, {}, success, error);
	}

	__get(url, qs={}, success, error) {
		request({
		    method: 'GET',
		    url: url,
		    qs: qs,
		    json: true
		})
		.then(success)
	    .catch(error);
	}
}

module.exports = Twitch;