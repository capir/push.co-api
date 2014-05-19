var request 			= require('https').request;
var util 					= require('util');
var querystring 	= require('querystring');
var _							= require('lodash');
var EventEmitter	= require('eventemitter2').EventEmitter2;

var Push = function Push( key, secret ){
	this.postData = {
		api_key			: key,
		api_secret	: secret,
	};
	EventEmitter.call(this);
};

util.inherits(Push, EventEmitter);

Push.prototype.pushMessage = function( msg, notification_type, article, image ) {
	if(!_.isString(msg)){
		throw new Error('A message must be defined in the first param.');
	}

	this.postData.message 	= msg;
	
	if(notification_type && notification_type != '*'){	
		this.postData.notification_type = notification_type;
	}
	if(article){
		this.postData.article = article;
	}
	if(image){
		this.postData.image = image;
	}

	this.push();
};

Push.prototype.pushUrl = function( msg, url, notification_type ) {
	if(!_.isString(msg)){
		throw new Error('A message must be defined in the first param.');
	}
	else if(!_.isString(url)){
		throw new Error('An url must be defined in the firssecond param.');
	}

	this.postData.message 	= msg;
	this.postData.view_type	= 1;
	
	if(notification_type){	
		this.postData.notification_type = notification_type;
	}

	if(url){	
		this.postData.url = url;
	}

	this.push();
};

Push.prototype.pushLocation = function( msg, lat, lng, notification_type ) {
	if(!_.isString(msg)){
		throw new Error('A message must be defined in the first param.');
	}
	else if(_.isEmpty(lat)){
		throw new Error('Coordonates must be defined.');
	}

	this.postData.message 	= msg;
	this.postData.view_type = 2;
	
	if(_.isString(lat)){	
		this.postData.latitude 	= lat;
		this.postData.longitude = lng;
	}
	else if(_.isArray(lat)){
		this.postData.latitude	= lat[0];
		this.postData.longitude	= lat[1];
		if(lng){notification_type = lng;}
	}
	else if(_.isObject(lat)){
		this.postData.latitude	= lat.latitude;
		this.postData.longitude = lat.longitude;
		if(lng){notification_type = lng;}
	}

	if(notification_type){	
		this.postData.notification_type = notification_type;
	}

	this.push();
};

Push.prototype.push = function( data ) {

	data = data || {};

	this.postData = _.defaults(data, this.postData);

	var strData 			= querystring.stringify(this.postData);
	var pushco 				= this;
	var post_options 	= {
		host: 'api.push.co',
		port: '443',
		path: '/1.0/push',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': strData.length
		}
	};

	// Set up the request
	console.debug('Doing Request');
	var req = request(post_options, function(res) {
		console.debug('Response recieved;');
		res.setEncoding('utf8');
		var data ='';
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function () {
			console.debug('End Res Called;');
			var parsedData = JSON.parse(data);
			if(parsedData.success){
				pushco.emit('response', parsedData.message, parsedData);
			}else{
				pushco.emit('error', parsedData.error);
			}
		});
	});
	req.write(strData);
	req.end();
};

module.exports = Push;