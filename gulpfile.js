var path = require('path');
var fs = require('fs');

var gulp = require('gulp');

var del = require('del');
var merge = require('merge-stream');
var rev = require('gulp-rev');
var revFormat = require('gulp-rev-format');
var revReplace = require('gulp-rev-replace');
var gulpif = require('gulp-if');

var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var cssAsset = require('gulp-css-asset');
var imagemin = require('gulp-imagemin');

var uglify = require('gulp-uglify');
var rjs = require('requirejs');




// 配置信息
var config = require('./config.json');

var sassOptions = {
    includePaths: ['./src/static/style/_unit/'],
    outputStyle: 'expanded',
    sourceComments: true
};
var revFormatOptions = {
    prefix: '.',
    suffix: '',
    lastExt: true
};


// 基础方法
// 断言文件后缀名类型
var typeAssert = function(type, boolean){
    if(boolean){
        return function(file){
            return  file.extname.toLowerCase().replace(/^\./,'') === type;
        }
    }else{
        return function(file){
            return  file.extname.toLowerCase().replace(/^\./,'') !== type;
        }
    }
}



// script 相关任务 -------------------------------------------------------------

gulp.task('cleanScript',function(){
    return del([
        './static/map/script/**', //map文件
        './static/mainifest/script_*.json', //替换信息文件
        './static/script/**' //脚本资源文件
    ]);
});

gulp.task('buildComponentStyleAsset',function(){
    return gulp.src('./src/static/script/module/private/*/*.scss',{ base: './src/static/' })
        .pipe(sass(sassOptions))
        .pipe(cssAsset({
            tabSize: 2,
            staticPath: config.staticBaseUrl,
            base64: function(filePath){
                return fs.statSync(filePath).size < 1024; // 对小于1kb（1024b）的资源文件进行base64转码
            },
            sprite: function(imagePath){
               return /^_/.test(path.basename(imagePath)) ? 'style/_asset/image/_component.png' : ''; // 将以“_”开头命名的图片合并
            }
        }))
        .pipe(imagemin(/*{verbose: true}*/))
        .pipe(gulpif(typeAssert('css', false), rev()))
        .pipe(gulpif(typeAssert('css', false), revFormat(revFormatOptions)))
        .pipe(gulpif(typeAssert('css', false), gulp.dest('./static/')))
        .pipe(gulpif(typeAssert('css', false), rev.manifest('./script_component_style_asset_manifest.json')))
        .pipe(gulpif(typeAssert('css', false), gulp.dest('./static/mainifest/')))
        .pipe(gulpif(typeAssert('css', true), gulp.dest('./static/.tmp/')));
});
gulp.task('updateComponentCSS', function(){
    return gulp.src('./static/.tmp/script/module/private/**/*.css',{ base: './static/.tmp/' })
        .pipe(revReplace({
            canonicalUris: true, //用正斜杠("/")替换非正斜杠
            replaceInExtensions: ['.css'],//要处理的文件类型
            prefix: '',//替换前缀
            manifest: gulp.src('./static/mainifest/script_component_style_asset_manifest.json', {
                allowEmpty: true
            })
        }))
        .pipe(autoprefixer({browsers: ['last 3 Explorer versions']}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./static/.tmp/'));
});
gulp.task('buildComponentStyle',gulp.series('buildComponentStyleAsset', 'updateComponentCSS'));

gulp.task('prepareComponentResources', gulp.parallel('buildComponentStyle', function(){
    return gulp.src([
            './src/static/script/module/private/*/index.js', //模块入口文件
            './src/static/script/module/private/*/*.tpl', //模板文件
            './src/static/script/plugin/**/*.js' //requirejs插件 
        ],{base: './src/static/'})
        .pipe(gulp.dest('./static/.tmp/'));
}));
gulp.task('mergeComponentResources',function(callback){
    var configs = [];
    var pList = [];
    var componentPath = path.resolve(process.cwd(),'src/static/script/module/private');
    fs.readdirSync(componentPath).forEach(function(item){
        var pathsObj = {},
            excludeArr;
        if(fs.lstatSync(path.join(componentPath, item)).isDirectory()){
            pathsObj[item] = 'module/private/'+ item +'/index';
            var define = function(a,b){
                var modules = [];
                if(Object.prototype.toString.call(a) === '[object Array]'){
                    modules = a;
                }else if(Object.prototype.toString.call(b) === '[object Array]'){
                    modules = b;
                }
                excludeArr = [];
                modules.forEach(function(module){
                    var textFileName,
                        styleFileName;
                    if(/^text!/.test(module)){
                        textFileName =  module.replace(/^text!/,'').replace(/.[0-9a-zA-Z]{0,4}$/,'');
                        !excludeArr.includes('text') && excludeArr.push('text');
                        pathsObj['text'] = 'plugin/text/text';
                        pathsObj[textFileName] = 'module/private/'+ item +'/'+ textFileName;
                    }else if(/^css!/.test(module)){
                        styleFileName =  module.replace(/^css!/,'');
                        !excludeArr.includes('css') && excludeArr.push('css');
                        pathsObj['css'] = 'plugin/css/css';
                        pathsObj['css-builder'] = 'plugin/css/css-builder';
                        pathsObj['normalize'] = 'plugin/css/normalize';
                        pathsObj[styleFileName] = 'module/private/'+ item +'/'+ styleFileName.replace(/.(css|scss)$/,'');
                    }else{
                        //excludeArr.push(module);
                        pathsObj[module] = 'empty:';
                    }
                });
            };
            eval(fs.readFileSync(path.resolve(componentPath, item, 'index.js')).toString());
            configs.push({
                baseUrl:'./static/.tmp/script',// 模块基准目录
                paths: pathsObj, //模块路径配置
                name: item,//组件名（模块名）
                exclude: excludeArr, //不合并进来的模块名数组
                out: './static/.tmp/script/module/private/'+ item +'.js',//输出
                optimize: 'none', //不使用优化器
                wrap: {
                    start: '/* ++++++++++++++++++++ src/static/script/module/private/'+ item +'/index.js ++++++++++++++++++++ */', //合并后的文件开始位置添加的内容
                    end: '' //合并后的文件结束位置添加的内容
                },
                //inlineText: true,
                waitSeconds: 7, //超时等待时间（秒）
            });
        }
    });
    configs.forEach(function(option){
        pList.push(new Promise(function(resolve, reject){
            rjs.optimize(option, function(result){
                resolve();
            },function(err){
                reject(err);
            });
        }));
    });
    Promise.all(pList).then(function(){
        callback();
    },function(err){
        console.log(err);
    });
});
gulp.task('buildComponent',gulp.series('prepareComponentResources', 'mergeComponentResources',function(){
    return gulp.src('./static/.tmp/script/module/private/*.js',{base: './static/.tmp/script/'})
        .pipe(uglify())
        .pipe(rev())
        .pipe(revFormat(revFormatOptions))
        .pipe(gulp.dest('./static/script/'))
        .pipe(rev.manifest('./script_component_manifest.json'))
        .pipe(gulp.dest('./static/mainifest/'));
}));

gulp.task('buildModule',function(){
    return gulp.src([
            './src/static/script/module/private/*.js', //js内部模块
            './src/static/script/module/public/*.js', //js第三方模块
            './src/static/script/plugin/text/text.js', //requirejs text插件
            './src/static/script/plugin/css/css.js' //requirejs css插件
        ],{
            base: './src/static/script/',
            allowEmpty: true
        })
        .pipe(gulpif(function(file){
            return !/.*\.min\.js$/.test(file.path); //不压缩已压缩过的文件（针对一些已压缩过的第三方模块）
        }, uglify()))
        .pipe(rev())
        .pipe(revFormat(revFormatOptions))
        .pipe(gulp.dest('./static/script/'))
        .pipe(rev.manifest('./script_module_manifest.json'))
        .pipe(gulp.dest('./static/mainifest/'));
});

gulp.task('buildEntry',function(){
    return gulp.src('./src/static/script/entry/**/*.js',{ base: './src/static/' })
        .pipe(uglify())
        .pipe(rev())
        .pipe(revFormat(revFormatOptions))
        .pipe(gulp.dest('./static/'))
        .pipe(rev.manifest('./script_entry_manifest.json'))
        .pipe(gulp.dest('./static/mainifest'));
});

gulp.task('buildRequirejs',function(){
    return gulp.src('./src/static/script/require.js',{ base: './src/static/' })
        .pipe(uglify())
        .pipe(rev())
        .pipe(revFormat(revFormatOptions))
        .pipe(gulp.dest('./static/'))
        .pipe(rev.manifest('./script_requirejs_manifest.json'))
        .pipe(gulp.dest('./static/mainifest'));
});

gulp.task('buildConfig',function(){
    return gulp.src('./src/static/script/require.config.js',{ base: './src/static/' })
        .pipe(revReplace({
            canonicalUris: true, //用正斜杠("/")替换非正斜杠
            replaceInExtensions: ['.js'],//要处理的文件类型
            prefix: '',//替换前缀
            manifest: gulp.src([
                './static/mainifest/script_component_manifest.json',
                './static/mainifest/script_module_manifest.json'
            ],{
                allowEmpty: true
            }),
            modifyUnreved: function(filename){
                return filename;//.replace('.js', '');
            },
            modifyReved: function(filename){
                return filename.replace('.js', '');
            }
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(revFormat(revFormatOptions))
        .pipe(gulp.dest('./static/'))
        .pipe(rev.manifest('./script_config_manifest.json'))
        .pipe(gulp.dest('./static/mainifest'));
});

gulp.task('script', gulp.series(
    'cleanScript',
    gulp.parallel(
        gulp.series(
            gulp.parallel(
                'buildModule',
                'buildComponent'
            ),
            'buildConfig'
        ), 
        'buildRequirejs',
        'buildEntry')
    )
);


// data 相关任务 -------------------------------------------------------------

gulp.task('cleanData',function(){
    return del(['./static/data/**']);
});

gulp.task('buildData',function(){
    return gulp.src('./src/static/data/**/*.*',{ base: './src/static/' })
        .pipe(imagemin(/*{verbose: true}*/))
        .pipe(rev())
        .pipe(revFormat(revFormatOptions))
        .pipe(gulp.dest('./static/'))
        .pipe(rev.manifest('./data_manifest.json'))
        .pipe(gulp.dest('./static/mainifest'));
});

gulp.task('data', gulp.series('cleanData','buildData'));




// style 相关任务 -------------------------------------------------------------

gulp.task('cleanStyle', function(){
    return del([
        './static/map/style/**',
        './static/mainifest/style_*.json',
        './static/style/**'
    ]);
});

gulp.task('buildStyle',function(){
    return gulp.src('./src/static/style/**/*.scss',{ base: './src/static/' })
        .pipe(sass(sassOptions))
        .pipe(cssAsset({
            tabSize: 2,
            staticPath: config.staticBaseUrl,
            base64: function(filePath){
                return fs.statSync(filePath).size < 1024; // 对小于1kb（1024b）的资源文件进行base64转码
            },
            sprite: function(imagePath){
               return /^_/.test(path.basename(imagePath)) ? 'style/_asset/image/_all.png' : ''; // 将以“_”开头命名的图片合并
            }
        }))
        .pipe(imagemin(/*{verbose: true}*/))
        .pipe(gulpif(typeAssert('css', false), rev()))
        .pipe(gulpif(typeAssert('css', false), revFormat(revFormatOptions)))
        .pipe(gulpif(typeAssert('css', false), gulp.dest('./static/')))
        .pipe(gulpif(typeAssert('css', false), rev.manifest('./style_asset_manifest.json')))
        .pipe(gulpif(typeAssert('css', false), gulp.dest('./static/mainifest/')))
        .pipe(gulpif(typeAssert('css', true), gulp.dest('./static/.tmp/')));
});

gulp.task('cssRev',function(){
    return gulp.src('./static/.tmp/style/**/*.css',{ base: './static/.tmp/' })
        .pipe(revReplace({
            canonicalUris: true, //用正斜杠("/")替换非正斜杠
            replaceInExtensions: ['.css'],//要处理的文件类型
            prefix: '',//替换前缀
            manifest: gulp.src('./static/mainifest/style_asset_manifest.json',{
                allowEmpty: true
            })
        }))
        .pipe(autoprefixer({browsers: ['last 3 Explorer versions']}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rev())
        .pipe(revFormat(revFormatOptions))
        .pipe(gulp.dest('./static/'))
        .pipe(rev.manifest('./style_css_manifest.json'))
        .pipe(gulp.dest('./static/mainifest/'));
});


gulp.task('style', gulp.series('cleanStyle','buildStyle','cssRev',function(){
    return del(['./static/.tmp/']);
}));





// template 相关任务 -------------------------------------------------------------

gulp.task('cleanView',function(){
    return del(['./view/**']);
});

gulp.task('buildView',function(){

    return gulp.src('./src/view/**/*.pug',{ base: './src/view/' })
        .pipe(revReplace({
            canonicalUris: true, //用正斜杠("/")替换非正斜杠
            replaceInExtensions: ['.pug'],//要处理的文件类型
            prefix: '',//替换前缀
            manifest: gulp.src([
                './static/mainifest/script_requirejs_manifest.json',
                './static/mainifest/script_config_manifest.json',
                './static/mainifest/script_entry_manifest.json',
                './static/mainifest/data_manifest.json',
                './static/mainifest/style_css_manifest.json'
            ],{
                allowEmpty: true
            }),
            modifyUnreved: function(key){
                return key.replace(/\.css$/, '.scss');
            }
        }))
        .pipe(gulp.dest('./view/'));
});

gulp.task('view', gulp.series('cleanView','buildView'));






// 用户任务 -------------------------------------------------------------

// 发布前构建资源
gulp.task('build', gulp.series(gulp.parallel('script','data','style'),'view',function(cb){
    return del(['./static/mainifest/']);
}));

// 本地环境发布
gulp.task('local', function(){
    return gulp.src('./static/**/*.*',{ base:'./static/' })
        .pipe(gulp.dest('../static/'+ config.name +'/'));
});

// 测试环境发布
gulp.task('test', function(){
    return gulp.src('./static/**/*.*',{ base:'./static/' })
        .pipe(gulp.dest('/data/media/fuwo/'+ config.name +'/'));
});

// 线上环境发布
gulp.task('publish', function(){
    return gulp.src('./static/**/*.*',{ base:'./static/' })
        .pipe(gulp.dest('/data/media/fuwo/'+ config.name +'/'));
});


