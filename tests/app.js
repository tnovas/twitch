var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var nock = require('nock');
var Twitch = require('../app');

describe('Twitch', function() {
	var twitch, scope, urlApi, headers;

	before(function() {
	    twitch = new Twitch(
			"clientId", 
			"clientSecret", 
			"redirectUrl", 
			"user:edit+user:read:email");

	    urlApi = {
			base: 'https://api.twitch.tv/',
			authorizate: 'kraken/oauth2/authorize',
			accessTokenPath: 'kraken/oauth2/token',
			channels: 'helix/users',
			streams: 'helix/streams'
		};

		headers = {
	      Authorization: `${twitch.accessToken}?OAuth ${twitch.accessToken}`,
	      'Client-ID': twitch.clientId
	    };

	  });


	it('constructor() should make credentials with params', function() {
		var credentials = {
			clientId: "clientId",
			clientSecret: "clientSecret",
			redirectUrl: "redirectUrl",
			scopes: "user:edit+user:read:email",
			accessToken: '',
			refreshToken: '',
			userLogin: '',
			userId: ''
		};
		
		expect(JSON.stringify(twitch.__credentials)).to.equal(JSON.stringify(credentials));
		expect(JSON.stringify(twitch.__urlApi)).to.equal(JSON.stringify(urlApi));
	});

	it('authorizationUrl() should return Url of authorization', function() {
		expect(twitch.authorizationUrl()).to.equal(`${urlApi.base}${urlApi.authorizate}?response_type=code&client_id=${twitch.__credentials.clientId}&redirect_uri=${twitch.__credentials.redirectUrl}&scope=${twitch.__credentials.scopes}`);
	});

	it('connect() should connect to Twitch and get accessToken with code', function() {
		var scope = nock(`${urlApi.base}${urlApi.accessTokenPath}`, {
			      reqheaders: headers
			    })
                .post()             
                .reply(200, {access_token: 'token', refresh_token: 'token'});

		twitch.connect('code', () => expect(twitch.__credentials.accessToken).to.equal("token"));
	})

	it('getStream() should get live stream information', function() {
		var scope = nock(urlApi.base, {
			      reqheaders: headers
			    })
                .get(`${urlApi.streams}${twitch.__credentials.userId}`)
                .reply(200, {stream: { viewers: 10 }});

		twitch.getStream((live) => expect(10).to.equal(live.stream.viewers));
	});

	it('getStream() should get offline stream information', function() {
		var scope = nock(urlApi.base, {
			      reqheaders: headers
			    })
                .get(`${urlApi.streams}/${twitch.userId}`)
                .reply(200, {stream: null});

		twitch.getStream((live) => expect(null).to.equal(live.stream));
	});

	it('getStream() should get error', function() {
		var scope = nock(urlApi.base, {
			      reqheaders: headers
			    })
                .get(`${urlApi.streams}/${twitch.userId}`)
                .reply(500, {});

		twitch.getStream((err) => console.log(err));
	});

	it('getCredentials() should get credentials', function() {
		var credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			channelId: 'channelId'	
		};

		twitch.__credentials = {
			accessToken: 'token',
			refreshToken: 'token',
			channelId: 'channelId'		
		}

		var result = twitch.getCredentials();

		expect(JSON.stringify(result)).to.equal(JSON.stringify(credentials));
	});

});