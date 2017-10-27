var Twitch = require('../app');
var express = require('express');
var app = express();

let twitch = new Twitch(
		"clientId", 
		"clientSecret", 
		"http://www.localhost.com/connect", 
		"user:edit+user:read:email+chat_login",
		"userLogin"
);

app.get('/connect', (req, res) => {
	twitch.connect(req.query.code).then((result) => res.json(result.data)).catch((err) => res.json(err.response.data));
});

app.get('/connectChat', (req, res) => {
	twitch.connectChat();
});

app.get('/chat', (req, res) => {
	twitch.chat((from, msg)=> console.log(`${from} ${msg}`));
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