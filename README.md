#[PUSH.co](http://push.co/) API#

A nodejs implementation for the PUSH.co Notification Service API.

## Instalation: ##
npm
```
$ npm install pushco
```
## Usage: ##

##### 1. Load it #####
```javascript
var pushco	= require('pushco');
```

##### 2. Create Instance: #####
```javascript
var pusher = new pushco.Push(api_key, api_secret);
```

##### 3a. Push Message #####
```javascript
pusher.pushMessage( message[, notification_type, article, imageUrl] );
```
__NOTE:__ To send to all channels use `notification_type = '*'`


##### 3b. Push Url #####
```javascript
pusher.pushUrl( message, url[, notification_type] );
```

##### 3c. Push Location #####
```javascript
//as params
pusher.pushLocation( message, latitude, longitude[, notification_type] );

// or as array
pusher.pushLocation( message, [latitude, longitude][, notification_type] );

// or as object
pusher.pushLocation( message, {latitude:'latitude' ,longitude: 'longitude'}[, notification_type] );
```

##### 4a. Listen for response #####
```javascript
pusher.on('response', function( response ){
	console.info( response );
});
```

##### 4b. Listen for errors #####
```javascript
pusher.on('error', function( err, response ){
	console.error(err);
});
```
## Todo: ##

* Create User Class

	* Authorize methods
	* Subscription methods
	* Clannel methods

## API Docs: ##
[push.co/api](http://push.co/api)