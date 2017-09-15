const request = require('request');


const config = global.appConfig;


const defaultOptions = {
	// 除了 uri/url是必须的外，其他都是可选的
	//
	// uri: '',// 同url
	// url: '', // 来自url.parse（）的完全限定的uri或解析的url对象
	baseUrl: 'http://' + config.hostname + '/', // 完全合格的uri字符串用作基本URL。对request.defaults最有用，例如当您想要向同一个域执行许多请求时。 如果baseUrl是https://example.com/api/，那么请求/end/point?test=true将提取https://example.com/api/end/point?test=true。当给出baseUrl时，uri也必须是一个字符串。
	// method: 'GET', // http方法（默认："GET"）
	headers: {
		'User-Agent': 'FEServer',
		// 'X-Api-Version': '0.1.0',
		//'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
		//'Accept-Encoding':'gzip, deflate',
		//'Accept-Language':'zh-CN,zh;q=0.8',
		//'Cache-Control':'no-cache',
		//'Connection': 'keep-alive',
		//'Pragma':'no-cache',
		//'Content-type': 'application/json',
		//'Accept': 'application/json',
		//'Host': 'xiaoguotu.fuwo.com'
	}, // http标头（默认值：{}）

	qs: {a: 1, b: 2}, // 包含要附加到uri的querystring值的对象
	// qsParseOptions: { //包含选项的对象传递给qs.parse方法。或者将选项传递给querystring.parse方法，使用此格式{sep：';'，eq：'：'，options：{}}
	// 	sep: ';',
	// 	eq: ':',
	// 	options: {}
	// },
	// qsStringifyOptions: { // 包含选项的对象传递给qs.stringify方法。或者使用此格式{sep：';'，eq：'：'，options：{}}将query options选项传递给querystring.stringify方法。 例如，要更改使用qs模块将数组转换为查询字符串的方式，请将arrayFormat选项与索引| bracket | repeat重复
	// 	sep: ';',
	// 	eq: ':',
	// 	options: {}
	// },
	// useQuerystring: false, //是否使用 querystring 来处理查询字符串，默认为 false 表示使用 qs 来处理。 如果为true，请使用querystring来字符串和解析querystrings，否则使用qs（default：false）。如果需要将数组序列化为foo = bar＆foo = baz而不是默认foo [0] = bar＆foo [1] = baz，请将此选项设置为true。

	// body: , // 用于PATCH，POST和PUT请求的实体主体。必须是 Buffer、String 或 ReadStream。如果 json 是 true，那么body必须是一个可JSON序列化的对象。
	// form: , // 当传递一个对象或一个querystring时，它会将body设置为一个querystring值的表示形式，并添加Content-type：application / x-www-form-urlencoded头。 当没有选项传递时，会返回一个FormData实例（并且被管道化为请求）。请参阅上面的“表单”部分。
	// formData: , // 要传递 multipart/form-data 请求的数据。请参阅上面的表格部分。
	// multipart: , // 包含自己头文件和body属性的对象数组。发送一个 multipart/related 请求。请参阅上面的表格部分。 或者，您可以传入一个对象{chunked：false，data：[]}，其中使用分块来指定请求是否以分块传输编码发送。在非分块请求中，不允许具有主体流的数据项。
	// preambleCRLF: , // 在 multipart/form-data 请求的边界之前附加换行符/CRLF。
	// postambleCRLF:, // 在 multipart/form-data 请求的边界末尾附加换行符/CRLF。
	// json: true, // 将body设置为JSON的值表示，并添加 Content-type: application/json头。另外，以JSON解析响应体。
	// jsonReviver:, // 一个在分析JSON响应体时将被传递给JSON.parse()的reviver函数。
	// jsonReplacer:, // 一个替换器函数，当将JSON请求体的字符串化时传递给 JSON.stringify()。

	// auth:, // 包含值：user/username, pass/password 和 sendImmediately（可选）的一个哈希值。参见上面的文档。
	// oauth:, // OAuth HMAC-SHA1签名的选项。参见上面的文档。
	// hawk:, // Hawk 签名选项。credentials 键必须包含必要的签名信息，有关详细信息，请参阅hawk文档（https://github.com/hueniverse/hawk#usage-example）
	// aws:, // 包含AWS签名信息的对象. 应该具有 key，secret 和 session（可选，请注意，这仅适用于需要会话作为规范字符串一部分的服务）这些属性。还需要属性 bucket，除非您将 bucket 指定为路径的一部分，或者该请求不使用bucket（例如 GET服务）。 如果要使用AWS标志版本4，请使用值为4的参数sign_version，否则默认值为版本2，注意：您需要先安装npm install aws4。
	// httpSignature:, // 使用Joyent的库的HTTP签名方案的选项，必须指定keyId和key属性。有关其他选项，请参阅文档。

	// followRedirect: true, // 是否按照HTTP 3xx响应作为重定向（默认值：true）。该属性也可以被实现为将响应对象作为单个参数获取的函数，如果重定向应该继续，则返回true，否则返回false。
	// followAllRedirects: false, // 遵循非GET HTTP 3xx响应作为重定向（默认值：false）
	// followOriginalHttpMethod:, // 默认情况下，我们重定向到HTTP方法GET。您可以启用此属性重定向到原始HTTP方法（默认值：false）
	// maxRedirects: 10, // 要重定向的最大次数（默认值：10）
	// removeRefererHeader: false, //当重定向发生时，删除引用标题（默认值：false）。注意：如果为true，则在重定向链中会保留初始请求中设置的引用头。

	// encoding: undefined, // 编码要在响应数据的setEncoding使用。 如果为 null，则将body作为一个buffer返回。 其他任何值（包括默认值 undefined）都将作为 encoding参数传递给toString()（这意味着默认情况下为utf8）。 （注意：如果你期望二进制数据，你应该设置encoding：null。）
	// gzip:, // 如果为true，请添加Accept-Encoding标头以从服务器请求压缩的内容编码（如果尚未存在），并解码响应中支持的内容编码。 注意：响应内容的自动解码是通过请求（通过请求流传递到回调函数）返回的身体数据执行的，但不会在响应流（可从响应事件中获取）（未被修改的http） 可能包含压缩数据的IncomingMessage对象。 参见下面的例子。
	// jar:, // 如果为true，将会记住Cookie以备将来使用（或定义您的自定义饼干罐;请参阅示例部分）

	// agent:, // 要使用的 http(s)实例
	// agentClass:, // 要么指定代理的类名
	// agentOptions:, // 传递给他的选项  注意：对于HTTPS，请参阅用于TLS/SSL选项的tls API文档 以及上述文档。
	// forever:, // 设置为true以使用永久代理  注意：在 node 0.12+ 中默认为 http(s).Agent({keepAlive：true})
	// pool:, // 描述用于请求的代理的对象。 如果省略此选项，请求将使用全局代理（只要您的选项允许）。否则，请求将在池中搜索您的自定义代理。如果没有找到自定义代理，将创建一个新代理并将其添加到池中。 注意：仅当未指定 agent 选项时，才使用 pool。
	// timeout:, // 整数，包含等待服务器在中止请求之前发送响应头（并启动响应主体）的毫秒数。  请注意，如果底层TCP连接无法建立，则OS范围的TCP连接超时将会超过超时选项（Linux中的默认值可能在20-120秒之间）。

	// localAddress:, //用于绑定网络连接的本地接口。
	proxy: config.apiProxy ? config.apiProxy : undefined,
	// strictSSL: true, //如果为true，则需要SSL证书有效。 注意：要使用您自己的证书颁发机构，您需要指定使用该CA创建的代理作为选项。
	// tunnel: undefined, // true表示始终通过代理来访问，false表示get类型的请求直接请求目标服务器。  默认值：当https时默认为true，其他默认为false
	// proxyHeaderWhiteList:, // 标头的白名单发送到隧道代理
	// proxyHeaderExclusiveList:, // 标题的白名单，专门发送到隧道代理，而不是目的地。

	// time:, //用于时间统计，统计信息会被添加到response对象上
	// har:, // 此选项中的值会覆盖本选项对象中相应的值
	// callback: function(error, response, responseBody){} //用于在选项对象中指定回调函数，与request方法的第二个参数功能相同。
};


var optis = {
	url: '',
	data: {},
	cache: false
};


module.exports = {
	request: function(req, options, callback){
		let optionsList = [];
		let pList = [];
		let err = null;

		optionsList = Object.prototype.toString.call(options) === '[object Array]' ? options : [options];

		optionsList.forEach(function(opts, index){
			if(typeof options !== 'object'){
				err = new Error('options参数必须是一个配置对象或多个配置对象组成的数组');
				return false;
			}
			if(typeof opts.url !== 'string'){
				err = new Error('配置项url必须是一个路径字符串');
				return false;
			}

			pList.push(new Promise(function(resolve, reject){
				let requestOptions = {};

				requestOptions.baseUrl = 'http://' + config.hostname + '/';
				requestOptions.url = opts.url || req.path;
				requestOptions.headers = {
					'Accept': 'application/json, text/javascript, */*; q=0.01',
					'Accept-Encoding': 'gzip, deflate',
					'Accept-Language': 'zh-CN,zh;q=0.8',
					'Cache-Control': 'no-cache',
					'Connection': 'keep-alive',
					'Cookie': req.headers.cookie,
					'Host': config.hostname || req.get('host') || req.headers.host,
					'Pragma': 'no-cache',
					'Referer': req.protocol + '://' + req.get('host') + req.originalUrl,
					'User-Agent': 'FEServer/1.0',
					'X-Requested-With': 'XMLHttpRequest'
				};
				requestOptions.qs = options.data || {};
				requestOptions.proxy = config.apiProxy || undefined;

				request(Object.assign({}, defaultOptions, opts), function(err, res, body){
					if(err){
						reject(err);
					}else{
						if(res.statusCode !== 200){
							reject(new Error('请求'+ res.req.path +'失败'));
						}
						let resultData = {};
						try{
							resultData = JSON.parse(body);
						}catch(e){
							reject(new Error('解析失败：返回结果不是JSON字符串'));
						}
						resolve(resultData);
					}
				});
			}));
		});

		if(err){
			callback(err);
			return false;
		}else{
			Promise.all(pList).then(function(result){
				callback(err, ...result);
			},function(err){
				callback(err);
			});
		}

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