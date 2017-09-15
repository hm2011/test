//var requireDir = require('require-dir');
//const user = require(path.resolve(global.appDir, './module/user.js'));

const path = require('path');
const fs = require('fs');

const data = require(path.resolve(global.appDir, './modules/data.js'));

module.exports = function(req, res, next){
	// console.log(req.headers);
	// console.log(req.protocol);
	// console.log(req.hostname);
	// console.log(req.get('host'));
	// console.log(req.originalUrl);
	//console.log(req.baseUrl);

	res.locals.renderData = {};

	data.request(req, {
		url: '/v1/renderServerRquest'
	}, function(err, result){
		console.log(err);
	});

	res.render('home');

};