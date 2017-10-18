let axios = require('axios');
let OAuth2 = require('oauth20');
let credentialsTwitch = Symbol('credentialsTwitch');
let urlsTwitch = Symbol('urlsTwitch');
let getTwitch = Symbol('getTwitch');

class Twitch extends OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, scopes, userLogin, accessToken='') {
		super(clientId, clientSecret, redirectUrl, scopes, accessToken, 'https://api.twitch.tv/kraken/oauth2/');
		
		this[credentialsTwitch] = {
			userLogin: userLogin,
			clientId: clientId,
			userId: ''
		};
		
		this[urlsTwitch] = {
			channels: 'users',
			streams: 'streams'
		};

		axios = axios.create({
		  baseURL: 'https://api.twitch.tv/helix/'
		});
	}

	getStream() {
		let url = this[urlsTwitch].streams;
		let params = {
			'user_login': this[credentialsTwitch].userLogin
		};

		return this[getTwitch](url, params);
	}

	[getTwitch](url, params) {
		return axios({
		    method: 'GET',
		    url: url,
		    params: params,
		    headers: {
		    	Authorization: `OAuth ${this.getCredentials().accessToken}`,
		    	'Client-ID': this[credentialsTwitch].clientId
			}
		});
	}
}

module.exports = Twitch;