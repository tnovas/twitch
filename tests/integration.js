var Twitch = require('../app');
var express = require('express');
var app = express();

let twitch = new Twitch(
		"jhzfdytf5y10a36v48p9t798qkdvpo", 
		"930a3e0c9mi91brng09b1z80fj2qxw", 
		"http://www.localhost.com/connect", 
		"user:edit+user:read:email+chat_login",
		"tpnovas",
		"pepe"
);

app.get('/connect', (req, res) => {
	twitch.connect(req.query.code).then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/connectChat', (req, res) => {
	twitch.connectChat().then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/liveChat', (req, res) => {
	twitch.liveChat().then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/reconnect', (req, res) => {
	twitch.reconnect(twitch.getCredentials().refreshToken).then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/getStream', (req, res) => {
	twitch.getStream().then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/credentials', (req, res) => {
	res.json(twitch.getCredentials());
})

app.get('/', (req, res) => {
	res.json(twitch.authorizationUrl());
});

app.listen(80);