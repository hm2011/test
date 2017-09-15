# src 目录组织

## static 静态资源目录

*用途*：用于存放页面中引入的相关资源文件


### data 数据目录

*用途*：用于存放数据类的文件

原则上我们期望这类文件由后端管理（比如存入数据库），如有必要可使用该目录。


#### image 图片数据目录

*用途*：用于存放图片类数据文件

类似的还可以有其他类型的目录，如 audio（音频类）、video（视频类）、flash（flash类）等等。



### style 样式资源目录

*用途*：用于存放样式相关资源文件

关于scss文件中引用分块的路径，统一基于`项目目录/src/static/style/_unit/`目录，此时引用路径例如：`@import "variable.scss";`
表示导入了`项目目录/src/static/style/_unit/_variable.scss`分块，注意分块文件名以“`_`”开头，而导入时不需要写前面的下划线。

关于样式表中引用资源的路径，可以用相对于当前scss文件的相对路径（样式分块文件以其被导入文件为基准），也可以使用统一
基于`项目目录/src/staic/`目录的路径，此时引用路径需要以`/`开头，例如：`url("/style/_asset/image/icon.png")`。建议使
用后者。

#### _unit 样式分块目录

*用途*：用于存放样式分块文件

#### _asset 样式引用资源目录

*用途*：用于存放样式表中引用的相关资源文件

##### image 样式图片目录

*用途*：用于存放样式表中引用的图片类资源文件

类似的还可以有其他类型的目录，如 font（字体类）等等。



### script 脚本资源目录

*用途*：用于存放js脚本资源文件

**注意**：本目录下的 require.config.js 文件为 requirejs 的配置文件，其中所有本地模块路径均要加上后缀名“`.js`”
（原本 requirejs 配置规定是不让带上后缀名的 ），只是因为没有后缀时，构建工具在处理替换时容易产生错误：比如有两个
路径分别为`"module/private/a"`和`"module/private/abc"`，其revision后的路径分别为`"module/private/a.d41d8cd98f"`
和`"module/private/abc.273c2c123f"`，替换时可能会把`"module/private/abc"`替换成了`"module/private/a.d41d8cd98fbc"`。

构建工具构建在执行替换后会自动将后缀删除以满足 requirejs 的规定。


#### entry 页面入口文件目录

*用途*：用于存放页面入口脚本文件，该文件包含页面的一整套逻辑信息

#### module 项目脚本模块目录

*用途*：用于存放整个项目页面所用到的一些模块脚本文件

##### private 私有模块目录

*用途*：用于存放公司内部自己开发的一些模块脚本

##### public 第三方模块目录

*用途*：用于存放第三方脚本资源

建议将第三方脚本资源统一托管在 http://static.fuwo.com/common/ 下。


#### plugin 插件目录

*用途*：用于存放 requirejs 的各种插件




## view 模板目录

*用途*：用于存放 pug 模板文件

关于模板文件中引用分块的路径，可以用相对于当前模板文件的相对路径，也可以使用统一基于`项目目录/src/view/`目录的
路径，此时引用路径需要以`/`开头，例如：

```pug
extend /_unit/base.pug
include /_unit/header.pug
```
建议使用后者。

关于模板文件中引用静态资源必须使用 _static 方法（此方法存在于文件`项目目录/src/view/_unit/processor.pug`中），
传入的路径参数是该静态资源基于`项目目录/src/static/`目录的相对路径。列如：

```pug
img.banner(src=`{{ _static("data/image/banner.png") }}`)
```


### _unit 模板分块目录

*用途*：用于存放 pug 模板分块文件



