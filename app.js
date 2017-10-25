let axios = require('axios');
let OAuth2 = require('oauth20');
var irc = require('twitch-irc-lite');
let credentialsTwitch = Symbol('credentialsTwitch');
let chatTwitch = Symbol('chatTwitch');
let urlsTwitch = Symbol('urlsTwitch');
let getTwitch = Symbol('getTwitch');

class Twitch extends OAuth2 {
	constructor(clientId, clientSecret, redirectUrl, scopes, userLogin, chatChannel, chatName, accessToken='') {
		super(clientId, clientSecret, redirectUrl, scopes, accessToken, 'https://api.twitch.tv/kraken/oauth2/');
		
		this[credentialsTwitch] = {
			userLogin: userLogin,
			clientId: clientId,
			chatChannel: chatChannel,
			chatName: chatName,
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
		this[chatTwitch] = new irc(`OAuth ${this.getCredentials().accessToken}`, this[credentialsTwitch].chatName).join(this[credentialsTwitch]chatChannel);
	}

	getStream() {
		let url = this[urlsTwitch].streams;
		let params = {
			'user_login': this[credentialsTwitch].userLogin
		};

		return this[getTwitch](url, params);
	}

	liveChat() {
		return this[chatTwitch].chatEvents.addListener('message', new Promise((channel, from, message) => {
			return {
				from: from,
				message: message
			}
		}));
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