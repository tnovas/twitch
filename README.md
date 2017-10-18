# Twitch

[![Build Status](https://travis-ci.org/tnovas/twitch.svg?branch=master)](https://travis-ci.org/tnovas/twitch)
[![Coverage Status](https://coveralls.io/repos/github/tnovas/twitch/badge.svg)](https://coveralls.io/github/tnovas/twitch)

#### This module is a implementation of New Twitch API https://dev.twitch.tv/docs/api/reference

You need nodejs version > 6x because this module was made with ES6.
```
node --version
```

## Installation:
Add the latest version of `twitch` to your package.json:
```
npm install twitch --save
```

## Usage:
```js
let twitchApi = require('twitch');
```

Give the credentials of the youtube to the constructor

| Params       | Description     | Optional | 
| --------     |:---------------| :-----:|
| **ClientId**     | *The Client Id* | **false** |
| **ClientSecret** | *The Client Secret* | **false** |
| **RedirectUrl**  | *The RedirectUrl with format 'http://yourdomain/youraction'* | **false** |
| **Scopes**       | *They are 2 scopes: user:edit user:read:email* | **false** |
| **UserLogin**  | *The name of your user login*  | **false** |

```js
let twitch = new twitchApi('clientId', 'clientSecret', 'http://yourdomain/youraction', 'user:edit+user:read:email', 'channelName');
```

### Authorization
To authenticate with OAuth you will call `authorizationUrl` and will return an URL, you will make a request with a browser and authorizate in OAuth. After that you will be redirect to `RedirectUrl` and you will get a `code` on QueryString `?code='hjqweassxzass'`

```js
let urlAuthorization = twitch.authorizationUrl();
```

### Get Access Token
For generate an access token and refresh token you have to call `connect` with the `code` you got on QueryString

| Params   | Description     | Optional | 
| -------- |:---------------| :-----:|
| **Code**  | *The code you got in the querystring* | **false** |

```js
twitch.connect(code);
```

### Refresh Access Token
If you need refresh the access token, you have to call `reconnect` and send the `refreshToken`

| Params   | Description     | Optional | 
| -------- |:---------------| :-----:|
| **RefreshToken**  | *The refresh token you got in credentials* | **false** |

```js
twitch.reconnect(refreshToken);
```

### Get Stream:
For get your stream information you have to call `getStream`

```js
twitch.getStream();
```

### Get Credentials:
If you need to save credentials, you have to call `getCredentials` and you will get an object

```js
{
  accessToken,
  refreshToken,
  userId
}
```

### Promises
If you add `then` to call you will take the success of response and if you add `catch` you will take the error of response.
```js
twitch.getStream()
	.then((res) => console.log(res)))
	.catch((err) => console.log(err)))
```

## Test Integration:
You can test the module with your productive credentials. 
First change the `clientId` and `clientSecret` in `tests/integration.js` with yours credentials, open a console and run `npm start`, open browser and type `http://localhost:8080/`

### Urls:
- `http://localhost:8080/` return the url of [authorization](#authorization), copy and paste into the url of the browser
- `http://localhost:8080/getStream` return information of your [stream](#get-channel)
- `http://localhost:8080/credentials` [get credentials](#get-credentials)
- `http://localhost:8080/reconnect` [refresh access token](#refresh-access-token)

