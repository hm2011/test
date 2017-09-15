const path = require('path');
const fs = require('fs');

const data = require(path.resolve(global.appDir, './modules/data.js'));

module.exports = function(req, res, next){

	// console.log(req.headers.cookie);

	res.locals.renderData = res.locals.renderData || {};

	// console.log(req.query); // get参数
	// console.log(req.params); // url参数

	// console.log(req.headers);
	// console.log(req.protocol);
	// console.log(req.hostname);
	// console.log(req.get('host'));
	// console.log(req.originalUrl);

	// 请求数据
	data.request(req,[
		// 分类项
		{
			url: '/v1/conf',
			data: {
				a: 1,
				b: 2,
			},
			cache: true // 设置为对该数据进行缓存
		}

		// // 相关推荐
		// {
		// 	url: '/v1/null'
		// },

		// // 列表
		// {
		// 	// version: 'v1', // 可以手动指定API版本, 默认为配置文件中的 defaultApiVersion 项
		// 	url: '/v1/photo/all',
		// 	data: {
		// 		size: 20, // 每页显示数量 固定为20
		// 		page: req.query.page || 1, // 页码数
		// 		sourceType: req.query.source, // 来源
		// 		houseType: req.query.layout, // 户型
		// 		styleType: req.query.style, // 风格
		// 		areaType: req.query.area, // 面积
		// 		colorType: req.query.color, // 颜色
		// 	}
		// }
	], function(
		err,
		screenData
		//s,
		//photoList
	){
		// 错误处理
		if(err){
			next(err);
			return;
		}
		// console.log(screenData);
		// console.log(photoList);

		// // 筛选信息
		// res.locals.renderData.screenInfo = {};
		// res.locals.renderData.screenInfo.currentConditions = [];
		// req.query.layout && res.locals.renderData.screenInfo.currentConditions.push({})
		// res.locals.renderData.screenInfo.conditions = [{
		// 	key: 'style',
		// 	name: '风格',
		// 	options: [{
		// 		id: '1',
		// 		name: '现代',
		// 		isSelected: false,
		// 	}]
		// }];

		// let styleData = {
		// 	key: 'style',
		// 	name: '风格',
		// 	options: []
		// };

		// screenData.styleTypes.forEach(function(item){
		// 	styleData.options.push({
		// 		id: item.id,
		// 		isSelected: (item.id + '') === req.query.style,
		// 		name: item.name
		// 	});
		// });


		// // 列表信息
		// res.locals.renderData.list = [];
		// photoList.rows.forEach(function(item){
		// 	res.locals.renderData.list.push({
		// 		url: '/photo/' + item.info.photoId,
		// 		file: item.imgUrl,
		// 		title: item.info.title
		// 	});
		// });

		// // 页码信息
		// let maxPage = Math.ceil(photoList.total / photoList.size);
		// let currentPage = photoList.page;
		// res.locals.renderData.pageInfo = {
		// 	currentPage: currentPage,
		// 	maxPage: maxPage,
		// 	prevPage: photoList.page - 1 || null,
		// 	nextPage: (photoList.page + 1) < maxPage ? photoList.page + 1 : maxPage,
		// };

		//res.render('photo/list');
	});

	res.render('photo/list');
};