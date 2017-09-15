
const listParams = {
	index: 0,
	count: 10
};


module.exports = {

	list: {
		desc: '获取用户列表',
		method: 'get',
		url: '/users',
		params: Object.assign({}, listParams, {
			index: 0,
			count: 10,
			sort: [{
				key: 'createTime',
				type: 'desc' // 'asc': 升序; 'desc': 降序。
			},{
				key: 'name',
				type: 'asc'
			}]
		}),
		type: 'json'
	},

	info: {
		desc: '获取某个用户的信息',
		method: 'get',
		urlPartn: '/user/:id', // 请求时自动将:id 替换成 params.id 的值
		params: {
			id: '12345'
		},
		type: 'json', // 'form-data', 'query'
	},

	exists: {
		desc: '判断用户名是否已存在',
		method: 'get',
		url: '/'
	}
	
};



// /user?page=1 
// url.query
// url.hash
var pageSize = 20;
var pageNumber = parseInt(url.query('page'));
pageNumber = !isNaN(pageNumber) && pageNumber > 0 ? pageNumber : 1;
var index =  pageSize * (pageNumber - 1);


api.list(); // 查看全部api
// user:info 根据某个用户的id获取该用户的信息
// user:list 获取用户列表
// user:exists 判断用户名是否已存在

api.list('user'); // 查看 user 模块中的全部api
// user:info 根据某个用户的id获取该用户的信息
// user:list 获取用户列表
// user:exists 判断用户名是否已存在


// 发送请求
request(api('user:list', {
	type: 'get',
	dataType: 'json',
	params: {
		index: index,
		count: pageSize,
		sort: [{
			key: 'createTime',
			type: 'desc' // 'asc': 升序; 'desc': 降序。
		},{
			key: 'name',
			type: 'asc'
		}]
	}
})).then(function(list){
	console.log(list);
},function(msg){
	console.log(msg);
});
