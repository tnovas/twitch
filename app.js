let request = require('request-promise');

class Twitch {

	constructor(clientId, clientSecret, redirectUrl, scopes, accessToken='', refreshToken='', userLogin='', userId='') {
		this.__credentials = {
			clientId: clientId,
			clientSecret: clientSecret,
			redirectUrl: redirectUrl,
			scopes: scopes,
			accessToken: accessToken,
			refreshToken: refreshToken,
			userLogin: userLogin,
			userId: userId
		};
		
		this.__urlApi = {
			base: 'https://api.twitch.tv/',
			authorizate: 'kraken/oauth2/authorize',
			accessTokenPath: 'kraken/oauth2/token',
			channels: 'helix/users',
			streams: 'helix/streams'
		};
	}

	authorizationUrl() {
		return `${this.__urlApi.base}${this.__urlApi.authorizate}?response_type=code&client_id=${this.__credentials.clientId}&redirect_uri=${this.__credentials.redirectUrl}&scope=${this.__credentials.scopes}`;
	}

	getCredentials() {
		return {
			accessToken: this.__credentials.accessToken,
			refreshToken: this.__credentials.refreshToken,
			channelId: this.__credentials.channelId
		}
	}

	getStream(error) {
		let url = `${this.__urlApi.base}${this.__urlApi.streams}/${this.__credentials.channelId}`;

		this.__get(url, {}, (result) => result, error);
	}

	connect(code, success, error) {
		let url = this.__urlApi.base + this.__urlApi.accessTokenPath;
		let body = {
			grant_type: 'authorization_code',
			client_id: this.__credentials.clientId,
			client_secret: this.__credentials.clientSecret,
			redirect_uri: this.__credentials.redirectUrl,
			code: code
		};

		this.__post(url, body, (result) => {
			this.__credentials.accessToken = result.access_token;
			this.__credentials.refreshToken = result.refresh_token;
			success();
	    }, error);
	}

	__get(url, qs, success, error) {
		request({
		    method: 'GET',
		    url: url,
		    qs: qs,
		    json: true
		})
		.then(success)
	    .catch(error);
	}

	__post(url, body, success, error) {
		request({
		    method: 'POST',
		    uri: url,
		    body: body,
		    json: true
		})
		.then(success)
	    .catch(error);
	}
}

module.exports = Twitch;