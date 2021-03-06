let axios = require('axios');
let OAuth2 = require('oauth20');
var irc = require('twitch-irc-lite');
let credentialsTwitch = Symbol('credentialsTwitch');
let chatTwitch = Symbol('chatTwitch');
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

		this.axiosTwitch = axios.create({
		  baseURL: 'https://api.twitch.tv/helix/'
		});
	}

	connectChat() {
		this[chatTwitch] = new irc(`oauth:${this.getCredentials().accessToken}`, this[credentialsTwitch].userLogin);
		this[chatTwitch].join(this[credentialsTwitch].userLogin);
	}

	getStream() {
		let url = this[urlsTwitch].streams;
		let params = {
			'user_login': this[credentialsTwitch].userLogin
		};

		return this[getTwitch](url, params);
	}

	chat(callback) {
		this[chatTwitch].chatEvents.addListener('message', (channel, from, msg) => {
			callback(from, msg);
		});
	}

	[getTwitch](url, params) {
		return this.axiosTwitch({
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