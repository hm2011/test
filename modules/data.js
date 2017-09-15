const request = require('request');

const config = global.appConfig;


module.exports = {
	request: function(req, options, callback){
		let optionsList = [];
		let pList = [];

		optionsList = Object.prototype.toString.call(options) === '[object Array]' ? options : [options];

		optionsList.forEach(function(opts, index){
			pList.push(new Promise(function(resolve, reject){
				let requestOptions = {};

				requestOptions.baseUrl = 'http://' + config.apiHost + '/';
				console.log(requestOptions.baseUrl);
				requestOptions.url = opts.url || req.path;
				requestOptions.headers = {
					'Accept': 'application/json',
					//'Accept': 'application/json, text/javascript, */*; q=0.01',
					//'Accept-Encoding': 'gzip, deflate',
					//'Accept-Language': 'zh-CN,zh;q=0.8',
					//'Cache-Control': 'no-cache',
					'Connection': 'keep-alive',
					'Cookie': req.headers.cookie,
					'Host': config.hostname || req.get('host') || req.headers.host,
					//'Pragma': 'no-cache',
					//'Referer': req.protocol + '://' + req.get('host') + req.originalUrl,
					'User-Agent': 'FEServer 1.0'
				};
				requestOptions.qs = opts.data || {};
				requestOptions.proxy = config.apiProxy || undefined;

				request(requestOptions, function(err, res, body){
					if(err){
						reject(err);
					}else{
						if(res.statusCode !== 200){
							//reject(new Error('请求'+ res.req.path +'失败：' +  JSON.parse(body).msg ));
							reject(new Error('请求'+ res.req.path +'失败' ));
						}else{
							let resultData = {};
							let errInfo = null;
							try{
								resultData = JSON.parse(body);
							}catch(e){
								errInfo = '解析失败：请求'+ res.req.path +'返回结果不是JSON字符串';
							}
							if(errInfo){
								reject(new Error(errInfo));
							}else{
								resolve(resultData);
							}
						}
					}
				});
			}));
		});

		Promise.all(pList).then(function(result){
			callback(null, ...result);
		},function(err){
			callback(err);
		});

		// 自定义header
		// request({
		// 	proxy: 'http://127.0.0.1:8080',
		// 	url: 'http:127.0.0.1:80/home/banner',
		// 	headers: {
		// 		'User-Agent': 'feserver',
		// 	},
		// 	cert: fs.readFileSync(path.resolve(__dirname, 'ssl/client.crt')),
		// 	key: fs.readFileSync(path.resolve(__dirname, 'ssl/client.key')),
		// 	passphrase: 'password',
		// 	ca: fs.readFileSync(path.resolve(__dirname, 'ssl/ca.cert.pem')) 
		// 	oauth: {
		// 		callback: 'http://mysite.com/callback/',
		// 		consumer_key: CONSUMER_KEY,
		// 		consumer_secret: CONSUMER_SECRET,
		// 	}
		// }, function(err, res, body){
		// 	//
		// });


		// // 文件下载
		// request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'));
		// // 文件上传
		// fs.createReadStream('file.json').pipe(request.put('http://mysite.com/obj.json'));
		// // 下载并上传
		// request.get('http://google.com/img.png').pipe(request.put('http://mysite.com/img.png'))

		// // form (application/x-www-form-urlencoded)
		// request.post('http://service.com/upload', {form:{key:'value'}});
		// request.post('http://service.com/upload').form({key:'value'});
		// request.post({
		// 	url:'http://service.com/upload',
		// 	form: {
		// 		key: 'value'
		// 	}
		// }, function(err, httpResponse, body){
		// 	//
		// });
		// // form (multipart/form-data)
		// request.post({
		// 	url:'http://service.com/upload',
		// 	formData: {
		// 		key: 'value',
		// 		file1: fs.createReadStream(__dirname + '/unicycle.jpg'),
		// 		file2: new Buffer([1, 2, 3]),
		// 		files: []
		// 	}
		// }, function(err, httpResponse, body){
		// 	//
		// });
	}
};