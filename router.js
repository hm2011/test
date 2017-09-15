var path = require('path');
var express = require('express');

const homeController = require(path.resolve(global.appDir, './controllers/home.js'));

const photoListController = require(path.resolve(global.appDir, './controllers/photo_list.js'));
const photoDetailController = require(path.resolve(global.appDir, './controllers/photo_detail.js'));

const albumListController = require(path.resolve(global.appDir, './controllers/album_list.js'));
const albumDetailController = require(path.resolve(global.appDir, './controllers/album_detail.js'));

const caseListController = require(path.resolve(global.appDir, './controllers/case_list.js'));
const caseDetailController = require(path.resolve(global.appDir, './controllers/case_detail.js'));

const publicListController = require(path.resolve(global.appDir, './controllers/public_list.js'));
const publicDetailController = require(path.resolve(global.appDir, './controllers/public_detail.js'));

const searchController = require(path.resolve(global.appDir, './controllers/search.js'));

const tagListController = require(path.resolve(global.appDir, './controllers/tag_list.js'));
const tagDetailController = require(path.resolve(global.appDir, './controllers/tag_detail.js'));



var router = express.Router();


// url 参数
// 单图id
router.param('id',function(req, res, next, id){
	//req.id = id;
	next();
});
// 图册id
router.param('aid',function(req, res, next, aid){
	//req.aid = aid;
	next();
});
// 案例id
router.param('cid',function(req, res, next, cid){
	//req.cid = cid;
	next();
});
// 公装图册id
router.param('pid',function(req, res, next, pid){
	//req.pid = pid;
	next();
});
// 标签id
router.param('tid',function(req, res, next, tid){
	//req.tid = tid;
	next();
});


// 搜索
router.get('/search', searchController);

// 标签
router.get('/tag', tagListController);
router.get('/tag/:tid(\\d+)', tagDetailController);

// 家居美图
router.get('/photo', photoListController);
router.get('/photo/:id(\\d+)', photoDetailController);

// 家居图册
router.get('/album', albumListController);
router.get('/album/:aid(\\d+)', albumDetailController);

// 装修案例
router.get('/case', caseListController);
router.get('/case/:cid(\\d+)', caseDetailController);

// 公装图册
router.get('/public', publicListController);
router.get('/public/:pid(\\d+)', publicDetailController);

// 首页
router.get('/home', homeController);
router.get('/', homeController);


module.exports = router;