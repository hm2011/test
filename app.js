const path = require('path');

const express = require('express');
const pug = require('pug');
const cookieParser = require('cookie-parser');


const app = express();



//console.log(process.env.NODE_ENV);
//app.set('env','production');


// 指定应用程序目录，以方便路径相关处理
global.appDir = __dirname;

//读取网站配置
global.appConfig = app.locals.config = app.get('env') === 'development' ? require('./config.dev.json') : require('./config.json');



//定义模板引擎
app.engine('pug', pug.renderFile);

//设置模板路径
app.set('views', path.resolve(global.appDir, './view'));

//设置要使用的模板引擎
app.set('view engine','pug');

//pug配置
//app.get('env') === 'development' && (app.locals.pretty = '\t'); //开发环境下不压缩渲染出来的 HTML
app.locals.basedir = path.resolve(global.appDir, './view');//指定pug的基准路径


//console.log(app.locals);


//静态资源路由设置
//app.use('/static',express.static(
    //path.join(__dirname, 'static')//, //静态资源根目录
    //{
        //dotfiles: 'ignore', //忽略“.”号开头的文件/目录
        //etag: true, //启用etag
        //extenstions: false, //设置文件扩展名
        //fallthrough: "",
        //index: false, //禁用目录索引
        //lastModified: true, //将header中的Last-Modified设置为操作系统上文件的最后修改日期。
        //maxAge: 0, //设置Cache-Control头的max-age属性
        //redirect: true, //当访问路径名为目录时自动尾随“/”,
        //setHeaders: fn(res, path, stat){
        	//
        //}
    //}
//));


app.use(cookieParser());

app.use(function(req, res, next){
    //console.log(req);
    next();
});


// 路由设置
app.use('/static', express.static(path.resolve(global.appDir, './static'), { maxAge: 315350000000 }));
app.use('/', require(path.resolve(global.appDir, './router.js')));


// 能到达这里表示未找到对应的路由，生成404错误
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// 最终错误处理
app.use(function(err, req, res, next){
	if(err.status === 404){
		res.status(404).render('404');
	}else{
		res.status(500).render('500', {
			stack: err.stack
		});
	}
});


// 启动 server
app.listen(global.appConfig.port);