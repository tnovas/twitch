var chai = require('chai');
var expect = chai.expect;
var Twitch = require('../app');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);

describe('Twitch', () => {
	var twitch, scope, urls, credentials;

	before(() => {
	    twitch = new Twitch(
			"clientId", 
			"clientSecret", 
			"redirectUrl", 
			"scopes",
			"userId"
		);

	    credentials = {
	    	clientId: "clientId", 
			clientSecret: "clientSecret", 
			redirectUrl: "redirectUrl", 
			scopes: "scopes",
			userId: "userId"
	    };

	    urls = {
			baseAuth: 'https://api.twitch.tv/kraken/oauth2/',
			authorizate: 'authorize',
			token: 'token',
			base: 'https://api.twitch.tv/helix/',
			channels: 'users',
			streams: 'streams'
		};
	  });

	it('authorizationUrl() should return Url of authorization', () => 
		expect(twitch.authorizationUrl()).to.equal(`${urls.baseAuth}${urls.authorizate}?response_type=code&client_id=${credentials.clientId}&redirect_uri=${credentials.redirectUrl}&scope=${credentials.scopes}`)
	);

	it('connect() should connect to twitch and get accessToken with code', () => {	
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token'
		};
		
		mock.onPost(urls.token).replyOnce(200, {access_token: 'token', refresh_token: 'token'});

		twitch.connect('code').then(() => expect(JSON.stringify(twitch.getCredentials())).to.equal(JSON.stringify(credentials)));
	});

	it('connect() should throw error with a message', () => {	
		mock.onPost(urls.token).replyOnce(500, { error: 'error' });

		twitch.connect('code').catch((err) => expect(500).to.equal(err.response.status));
	});

	it('getStream() should get stream of user with user id', () => {	
		var stream = {
			viewer_count: 1000
		};
		
		mock.onGet(`${urls.streams}/${credentials.userId}`).replyOnce(200, {viewer_count: 1000});

		twitch.getStream().then((response) => expect(JSON.stringify(response.data)).to.equal(JSON.stringify(stream)));
	});

	it('getStream() should throw error with a message', () => {	
		mock.onGet(`${urls.streams}/${credentials.userId}`).replyOnce(500, { error: 'error' });

		twitch.getStream().catch((err) => expect(500).to.equal(err.response.status));
	});	

	it('getCredentials() should get credentials', () => {
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token'
		};

		var result = twitch.getCredentials();

		expect(JSON.stringify(result)).to.equal(JSON.stringify(credentials));
	});

});