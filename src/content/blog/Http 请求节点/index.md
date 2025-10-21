---
title: HTTP 请求节点
publishDate: 2025-09-09
description: 'HTTP 请求节点是客户端与服务器之间通信的基础单元，用于发送和接收数据。本文将简要介绍 HTTP 请求节点的概念、常见请求方法（如 GET 和 POST）以及其实现方式。'
tags:
  - HTTP
heroImage: { src: './thumbnail.jpg', color: '#64574D' }
language: 'Chinese'
---

一个完整的URL通常由以下几部分组成：

`协议://域名或IP地址:端口号/路径?查询字符串#片段标识符`

其中，`?查询字符串` 和 `#片段标识符` 是可选的。

## 1、Get 请求（获取文件）

GET请求的`查询参数(PARAMS)`是直接附加在URL的查询字符串（Query String）部分。

`查询参数(PARAMS)`：像是写在**包裹外部**的“取件码”或“订单号”。快递员（服务器）看到这个号码就能知道要去仓库的哪个区域拿什么东西（获取什么资源）。它直接暴露在URL上，是请求的“标识”。
`语法：`在URL路径后面加上一个问号`?`，然后以`参数键(key)=参数值(value)`的形式添加参数。多个参数之间用`&`符号连接。

**示例**：
假设我们要向一个用户查询接口发送请求，查询年龄为25岁、所在城市为北京的用户。
`URL:https://api.example.com/users?age=25&city=Beijing`

## 2、Post请求（上传文件）

POST请求的参数通常放在`请求体（Request Body）`中，而不是`URL`里。因此，它的URL通常只包含路径，而不包含查询字符串（除非有些参数需要用于路由或服务端逻辑，但这相对少见）。

| 特性         | GET请求                                      | POST请求                 |
| :--------- | :----------------------------------------- | :--------------------- |
| **参数位置**   | **URL的查询字符串（?之后）**                         | **HTTP请求体（Body）**      |
| **URL示例**  | `https://api.com/data?key1=val1&key2=val2` | `https://api.com/data` |
| **数据可见性**  | 完全暴露在URL中（浏览器地址栏、历史记录、日志中可见）               | 对用户不可见，藏在HTTP请求中       |
| **数据长度限制** | 受限于URL最大长度（不同浏览器限制不同，约2048字符以上）            | 理论上无限制（但服务器可能有限制）      |
| **安全性**    | 较低（不应传递密码等敏感信息）                            | 相对较高（但HTTPS才是安全的关键）    |
| **浏览器历史**  | 参数会被保留                                     | 参数不会被保留                |
| **主要用途**   | **获取**数据（查询、搜索、筛选）                         | **创建/更新**数据（提交表单、上传文件） |
## 3、请求头（HEADERS）

位于HTTP请求的==起始行之后，Body之前==。是一系列键值对，浏览器和服务器自动处理很多默认Header。
像是贴在包裹上的**各种功能标签**，比如“易碎品”、“需要签名验收”、“加急”。它们告诉快递员（服务器）和分拣系统如何处理这个包裹（请求），但它们不直接描述包裹里的东西（数据）本身。

| 项的类别                 | 代表什么                            | 示例键 (Key) 及 示例值 (Value) | 解释                                                   |
| -------------------- | ------------------------------- | ----------------------- | ---------------------------------------------------- |
| **Header 键 (Key)**   | **一个预定义的“分类”或“指令”**。通常是标准化的字符串。 | `Content-Type`          | **告诉服务器：** “我发给你的请求体(Body)是JSON格式的，请按这个格式解析。”        |
|                      |                                 | `Authorization`         | **告诉服务器：** “这是我的身份凭证（通常是JWT Token），请验证我是否有权限。”       |
|                      |                                 | `Accept`                | **告诉服务器：** “我希望你返回的数据是JSON格式的，如果是其他格式我可能处理不了。”       |
|                      |                                 | `User-Agent`            | **告诉服务器：** “我是哪个浏览器/设备发起的请求，可用于统计和兼容性处理。”（通常浏览器自动添加） |
| **Header 值 (Value)** | **对该指令的“具体说明”或“内容”**。           | `application/json`      | 具体是JSON格式。                                           |
|                      |                                 | `Bearer ...`            | 具体的令牌字符串。                                            |
|                      |                                 | `application/json`      | 具体希望返回JSON。                                          |
## 4、请求体（body）

`Body` 是HTTP请求中跟在Headers之后的部分，用于携带需要发送给服务器的**主要数据**。是HTTP请求的“主体”或“载荷”，就像寄送包裹时**包裹箱子里装的实物**。而 `form-data`, `x-www-form-urlencoded`, `JSON` 等，则决定了这些实物如何被打包和标注（是用纸箱、泡沫箱，还是信封）。

### 请求体的类型：
| 类型                      | 是什么                                                               | 对应 `Content-Type`                              | 适用场景                                               | 前端代码示例（使用fetch）                                                                                                                                                                                                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `none`                  | **没有请求体。**                                                        | (无)                                            | **GET**、**HEAD** 或 **DELETE** (有时) 请求。             | `fetch('/api/data', { method: 'GET' })`                                                                                                                                                                                                                                                                                                   |
| `x-www-form-urlencoded` | 表单数据被编码成**键值对**，格式与**URL查询字符串一模一样** (`key1=value1&key2=value2`)。  | `application/x-www-form-urlencoded`            | 提交**简单的HTML表单**。不能上传文件。                            | `javascript<br>const data = new URLSearchParams();<br>data.append('username', 'john');<br>data.append('password', 'secret');<br><br>fetch('/login', {<br> method: 'POST',<br> headers: {<br> 'Content-Type': 'application/x-www-form-urlencoded'<br> },<br> body: data // 直接传入URLSearchParams对象<br>});<br>`                               |
| `form-data`             | 将表单数据编码为多部分（multipart）格式，用**边界符（boundary）分隔**。                    | `multipart/form-data`                          | **必须用于包含文件上传的表单**。也可以传输普通键值对，是**唯一能高效上传文件**的格式。    | ``javascript<br>const formData = new FormData();<br>formData.append('username', 'john');<br>formData.append('avatar', fileInput.files[0]); // 假设是文件对象<br><br>// 关键：**不要手动设置Content-Type头！**<br>// 浏览器会自动生成并加上正确的 `multipart/form-data` 和边界信息。<br>fetch('/upload', {<br> method: 'POST',<br> body: formData // 直接传入FormData对象<br>});<br>`` |
| `JSON`                  | 使用**JavaScript对象表示法**格式。是现代Web API（尤其是RESTful API）**最常用**的数据交换格式。 | `application/json`                             | **绝大多数AJAX请求**。用于发送结构化的数据，如创建用户、更新文章等。             | `javascript<br>const data = {<br> username: 'john',<br> email: 'john@example.com'<br>};<br><br>fetch('/api/users', {<br> method: 'POST',<br> headers: {<br> 'Content-Type': 'application/json' // 必须明确指定！<br> },<br> body: JSON.stringify(data) // 必须将对象转为JSON字符串！<br>});<br>`                                                            |
| `raw`                   | **原始的、未经处理的任意格式数据**。你可以发送任何文本格式（XML, Text, HTML等）。                | 由开发者自定义（如 `text/plain`, `application/xml`）     | 需要与期望特定原始文本格式的**老旧系统或特定API**交互。                    | ``javascript<br>const xmlData = `<user><name>John</name></user>`;<br><br>fetch('/api/legacy', {<br> method: 'POST',<br> headers: {<br> 'Content-Type': 'application/xml' // 自定义类型<br> },<br> body: xmlData // 直接传入字符串<br>});<br>``                                                                                                        |
| `binary`                | 发送**纯粹的二进制数据**，不是一个文本格式。                                          | 通常是文件的MIME类型（如 `image/png`, `application/pdf`） | 直接上传一个**单一的二进制文件**（而不是通过`form-data`包装）。例如直接上传一张图片。 | `javascript<br>// 假设fileInput是一个文件选择输入框<br>const file = fileInput.files[0];<br><br>fetch('/api/upload-raw-image', {<br> method: 'POST',<br> headers: {<br> 'Content-Type': 'image/png' // 告诉服务器这是PNG图片数据<br> },<br> body: file // 直接传入文件对象（Blob）<br>});<br>`                                                                              |

### 如何选择：
| 如果你的需求是...                | 应选择的Body类型                            | 原因                      |
| :------------------------ | :------------------------------------ | :---------------------- |
| 提交一个==带有文件上传==的HTML表单     | **form-data** (`multipart/form-data`) | 唯一标准且高效的方式。             |
| 提交一个==不包含文件==的简单HTML表单    | **x-www-form-urlencoded**             | 传统表单的默认提交格式，简单高效。       |
| 与**现代API**交互，发送/接收结构化数据   | **JSON** (`application/json`)         | 标准、流行、可读性好、支持复杂数据结构。    |
| 上传**单个文件**（如图片、PDF）且API支持 | **binary** (直接发送 `Blob`)              | 最直接，省去`form-data`的封装开销。 |
| 与需要**特定文本格式**（如XML）的旧系统交互 | **raw**                               | 灵活性最高，可以发送任何文本字符串。      |
| 只是从服务器**获取数据**            | **none**                              | GET请求不需要Body。           |
