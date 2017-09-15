# 项目说明

## 使用说明

### 准备工作


1.  本应用使用的架构需运行在 node v6.10.0 以上版本，请升级您的 node 至符合要求的某个版本。


2.  为了更好的使用各种操作，请将您的npm升级至最新版本：

    ```bash
    npm install npm -g
    ```

    并将源仓库地址设置为公司内部仓库 `http://192.168.3.224:4873`：

    ```bash
    npm set registry http://192.168.3.224:4873
    ```


3.  本项目使用 gulp（gulp4）作为构建工具，您需要全局安装 gulp：

    ```bash
    npm install gulpjs/gulp#4.0 -g
    ```
 
4.  由于 后端接口服务器 与 输出页面的渲染层服务器 不是同一个服务器，同时后端接口出于业务上的考虑需要区分请求的 host，为了调
    试时不会跨域，需要借助 nginx 转发相关请求，您需要安装一个 nginx 服务器。请前往`\\192.168.3.224\平台前端\软件\nginx`获取。


5.  为了方便调试渲染层服务器与后端接口服务器的数据交互，您需要安装一个代理服务来监查相关请求：

    ```bash
    npm install anyproxy -g
    ```


### 项目配置

以下配置假设该项目:

*   项目名称： `"xiaoguotu"`

*   域名：`"xiaoguotu.fuwo.com"`

*   开发环境接口服务器IP: `"192.168.3.93"`

*   开发环境接口服务器监听端口号：`80`

*   开发环境该应用监听端口号：`8051`

*   接口调试代理：`"http://127.0.0.1:8001"`


#### hosts 配置

修改 hosts 文件，添加以下内容：

```
127.0.0.1  dev.xiaoguotu.fuwo.com
192.168.3.93  xiaoguotu.fuwo.com
```

#### nginx 配置

1.  在 `nginx程序目录/conf/nginx.conf` 文件中的 http 块中追加以下内容：

    ```nginx
    include server/xiaoguotu.conf;
    ```

2.  在 `nginx程序目录/conf/server` 目录下复制 `demo.conf` 文件并将副本文件改名为 `xiaoguotu.conf`，
    在 `xiaoguotu.conf` 中查找所有的`demo`并将其替换为`xiaoguotu`。


3.  修改文件 nginx程序目录/conf/server/upstream.conf ，在其中添加以下内容：

    ```nginx
    upstream xiaoguotu_api_server {
        server xiaoguotu.fuwo.com:80 max_fails=2 fail_timeout=10s;
        keepalive 16;
    }
    upstream xiaoguotu_view_server {
        server 127.0.0.1:8051 max_fails=2 fail_timeout=10s;
        keepalive 16;
    }
    ```

#### 应用配置

修改 config.dev.json 文件，将各项设置正确：

```js
{
    // 应用所监听的端口号
    "port": 8051,

    // 应用绑定的域名（后端所提供的API需要区分域名）
    "hostname": "xiaoguotu.fuwo.com",

    // 静态资源访问基准路径， 开发环境约定设置为 "/static/"
    "staticBaseUrl": "/static/",

    // API代理
    // 为了调试渲染层api的调用，可以设置此代理，您需要确保您的代理服务正常工作
    // 此选项仅在开发环境下有效
    // anyproxy 默认端口为 8001，通常不需要更改此项
    // 如果不想使用代理，请将值设置为 null 或去除此项。
    "apiProxy": "http://127.0.0.1:8001"
}
```


### 启动开发

1.  启动 nginx 代理服务

2.  启动 anyproxy 渲染层接口调试代理。

3.  如果您是第一次启动开发，您可能需要安装一下相关依赖

    ```bash
    npm install
    ```

4.  以开发模式启动应用

    ```bash
    npm run dev
    ```

### 相关 npm 命令

*   构建资源

    ```bash
    npm run build
    ```
    此操作会将src目录下的静态资源和模板资源构建为需要的文件分别存放于static目录和view目录中。

*   启动应用

    ```bash
    npm start
    ```

    或者

    ```bash
    npm run start
    ```

    此操作会启动该应用，如果相关资源还未构建，您需要在此操作前先执行构建资源。

*   监视任务

    ```bash
    npm run watch
    ```

    监视任务会负责监听文件变更，并将变更效果呈现给浏览器。

    该任务启动后会自动打开您的默认浏览器浏览（为了方便开发调试，建议将chrome设置为默认浏览器）本地3000端口。如果是服务端文
    件发生变更，则会自动重启服务并刷新浏览器；如果是模板或静态资源发生变更，则会重新构建资源，然后刷新浏览器。在每次保存文
    件时请尽量确保代码的完整性和正确性，如果编译发生错误，监视任务将会中止，此时您需要更正错误后手动启动监视任务。

*   启动开发

    ```bash
    npm run dev
    ```

    此操作相当于先执行构建资源，然后执行监视任务。




## 目录/文件说明

### controllers 目录

本目录用于存放 nodejs 服务端流程控制类文件。


### modules 目录

本目录用于存放 nodejs 服务端功能模块类文件。


### node_modules 目录

本目录由 npm 包管理工具自动生成，用于存放下载的第三方模块。


### src 目录

本目录为源码目录，用于存放构建前的源码文件。具体信息参见该目录下的 readme.md 文件


### static 目录

本目录由构建工具自动生成，用于存放构建后的静态资源文件。


### view 目录

本目录由构建工具自动生成，用于存放构建后的模板文件。


### app.js 文件

应用的入口文件


### router.js 文件

应用的路由管理文件


### config.json 文件

应用的线上环境配置文件


### config.dev.json 文件

应用的开发环境配置文件


### gulpfile.dev.js 文件

开发环境下 gulp 构建工具的配置文件


### gulpfile.js 文件

发布时 gulp 构建工具的配置文件


### package.json 文件

应用的包管理相关文件


### package-lock.json 文件

应用的包管理相关文件




