const path = require('path');
const fs = require('fs');

const data = require(path.resolve(global.appDir, './modules/data.js'));

module.exports = function(req, res, next){


	res.locals.renderData = res.locals.renderData || {};
	res.locals.renderData.cid = req.cid;



	res.render('case/detail');
};