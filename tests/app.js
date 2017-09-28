var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var Twitch = require('../app');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');

var mock = new MockAdapter(axios);

describe('Twitch', function() {
	var twitch, scope, urlApi, headers;

	before(function() {
	    twitch = new Twitch(
			"clientId", 
			"clientSecret", 
			"redirectUrl", 
			"user:edit+user:read:email",
			"userLogin",
			"userId");

	    urlApi = {
			base: 'https://api.twitch.tv/helix/',
			baseAuth: 'https://api.twitch.tv/kraken/oauth2/',
			authorizate: 'authorize',
			accessTokenPath: 'token',
			channels: 'users',
			streams: 'streams'
		};

		headers = {
	      Authorization: `${twitch.accessToken}?OAuth ${twitch.accessToken}`,
	      'Client-ID': twitch.clientId
	    };

	  });


	it('constructor() should make credentials with params', function() {
		var credentials = {
			userLogin: 'userLogin',
			userId: 'userId'
		};

		var urls = {
			base: 'https://api.twitch.tv/helix/',
			channels: 'users',
			streams: 'streams'
		};
		
		expect(JSON.stringify(twitch.__credentials)).to.equal(JSON.stringify(credentials));
		expect(JSON.stringify(twitch.__urlApi)).to.equal(JSON.stringify(urls));
	});

	it('authorizationUrl() should return Url of authorization', function() {
		expect(twitch.authorizationUrl()).to.equal(`${urlApi.baseAuth}${urlApi.authorizate}?response_type=code&client_id=${twitch.__credentials.clientId}&redirect_uri=${twitch.__credentials.redirectUrl}&scope=${twitch.__credentials.scopes}`);
	});

	it('connect() should connect to Twitch and get accessToken with code', function() {
		mock.onPost(`${urlApi.baseAuth}${urlApi.accessTokenPath}`)
                .reply(200, {access_token: 'token', refresh_token: 'token'});

		twitch.connect('code', () => expect(twitch.__credentials.accessToken).to.equal("token"), () => {});
	})

	it('getStream() should get live stream information', function() {
		mock.onGet(`${urlApi.base}${urlApi.streams}${twitch.__credentials.userId}`)
                .reply(200, {stream: { viewers: 10 }});

		twitch.getStream((live) => expect(10).to.equal(live.stream.viewers), () => {});
	});

	it('getStream() should get offline stream information', function() {
		mock.onGet(`${urlApi.base}${urlApi.streams}${twitch.__credentials.userId}`)
                .reply(200, {stream: null});

		twitch.getStream((live) => expect(null).to.equal(live.stream), () => {});
	});

	it('getCredentials() should get credentials', function() {
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token'
		};

		twitch.__credentials = {
			accessToken: 'token',
			refreshToken: 'token'
		};

		var result = twitch.getCredentials();

		expect(JSON.stringify(result)).to.equal(JSON.stringify(credentials));
	});

});