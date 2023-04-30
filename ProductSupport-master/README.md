# 接口及测试数据

## Swagger入口
`/swagger-ui/index.html`

## 连接器

----
#### 条件查询连接器
接口：`/connector/info`  
方法：POST  
params参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| page  | 页码 | 从0开始 |
| rows  | 每页行数 ||
| sortBy | 排序字段 ||
| sortDirection | 排序规则 | DESC降序，ASC升序|
```
    page=1&rows=10&sortBy=name&sortDirection=desc
```
body参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| type  | 类型 | 0 为RestFul连接器， 1 为Kafka连接器 |
| status | 连接器状态 | -1 不查询状态， 0 位置， 1 正常， 2 异常， 3 运行中 |
| name | 连接器名 ||
测试用例：
```json
     {
        "type": 0,
        "status": -1,
        "name": "it"
      }
```
测试结果：[点击查看](#connectorResult)

----
#### id查询连接器
接口：`/connector/info`  
方法：GET  
params参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| id  | 连接器id |  |
测试用例：
```
    id=612b41df91d27408edeec81c
```
测试结果：
```json
{
  "code": 200,
  "message": "连接器查询成功！",
  "data": {
    "id": "612b41df91d27408edeec81c",
    "uri": null,
    "header": {},
    "httpMethod": "GET",
    "params": {},
    "body": {},
    "contentType": "application/json",
    "type": 0,
    "status": -1,
    "name": "it_1",
    "cron": "-1",
    "remark": ""
  }
}
```

----

#### 获取所有连接器
接口：`/connector/list`  
方法：GET  
params参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| page  | 页码 | 从1开始 |
| rows  | 每页行数 ||
| sortBy | 排序字段 ||
| sortDirection | 排序规则 | DESC降序，ASC升序|
测试用例：
```
    page=1&rows=10&sortBy=name&sortDirection=desc
```
<p id="connectorResult">测试结果：</p>

```json
{
  "code": 200,
  "message": "连接器获取成功",
  "data": {
    "content": [
      {
        "id": "612b41df91d27408edeec81c",
        "uri": null,
        "header": {},
        "httpMethod": "GET",
        "params": {},
        "body": {},
        "contentType": "application/json",
        "type": 0,
        "status": -1,
        "name": "it_1",
        "cron": "-1",
        "remark": ""
      }
    ],
    "pageable": {
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 10,
      "unpaged": false,
      "paged": true
    },
    "last": true,
    "totalPages": 1,
    "totalElements": 1,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "first": true,
    "numberOfElements": 1,
    "empty": false
  }
}
```

----
#### 访问连接器
接口：`/connector/request`  
方法：GET  
测试结果：
```json
{
  "code": 200,
  "message": "连接器访问成功！",
  "data": null
}
```
错误：  
“节点插入失败”
* 数据格式不对 time， timestamp等等

----
#### 运行连接器定时任务
接口：`/connector/run`  
方法：GET  
测试结果：
```json
{
  "code": 200,
  "message": "连接器已运行！",
  "data": null
}
```

----
#### 停止连接器定时任务
接口：`/connector/stop`  
方法：GET  
测试结果：
```json
{
  "code": 200,
  "message": "连接器已暂停！",
  "data": null
}
```

----
#### 保存连接器
接口：`/connector/save`  
方法：POST  
body参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| type  | 类型 | 0 为RestFul连接器， 1 为Kafka连接器 |
| name | 连接器名 | 必填 |
| uri | 接口地址 | RestFul连接器必填|
| header | 请求头 | 可为空 |
| params | 请求参数 | 可为空 |
| httpMethod | 请求方法 | GET 或 POST|
| contentType | 返回数据类型 | 默认：`application/json`|
| updateType | 更新方式 | 0 全量， 1 增量 |
| body | 请求参数 | 可为空 |
| cron | 定时任务表达式 | -1为不开启定时任务 |
| remark | 备注 | 可为空 |
测试用例：
```json
{
  "type":0,
  "name": "it_1",
  "uri": "http://121.37.153.8/json/chip.json",
  "header": {},
  "params": {},
  "httpMethod": "GET",
  "contentType": "application/json",
  "updateType": 0,
  "body": {},
  "cron": "-1",
  "remark": ""
}
```
```json
{
  "code": 200,
  "message": "保存成功！",
  "data": null
}
```
----
#### 更新连接器
接口：`/connector/update`  
方法：POST

<p id="restful_api_body">body参数：</p>

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| id| id| 必填 |
| type  | 类型 | 0 为RestFul连接器， 1 为Kafka连接器 |
| name | 连接器名 | 必填 |
| uri | 接口地址 | RestFul连接器必填|
| header | 请求头 | 可为空 |
| params | 请求参数 | 可为空 |
| httpMethod | 请求方法 | GET 或 POST|
| contentType | 返回数据类型 | 默认：`application/json`|
| updateType | 更新方式 | 0 全量， 1 增量 |
| body | 请求参数 | 可为空 |
| cron | 定时任务表达式 | -1为不开启定时任务 |
| remark | 备注 | 可为空 |
测试用例：
```json
{
  "id": "612b41df91d27408edeec81c",
  "type":0,
  "name": "it_1",
  "uri": "http://localhost:8080/record/getJson",
  "header": {},
  "params": {},
  "httpMethod": "GET",
  "contentType": "application/json",
  "updateType": 0,
  "body": {},
  "cron": "-1",
  "remark": ""
}
```
测试结果：
```json
{
  "code": 200,
  "message": "连接器已更新！",
  "data": null
}
```
----

#### 删除连接器
接口：`/connector/delete`  
方法：DELETE  
body参数：连接器id数组  
测试用例：
```json
[
  "612b41df91d27408edeec81c"
]
```
测试结果：
```json
{
  "code": 200,
  "message": "删除成功！",
  "data": null
}
```

----
##ER模型

----
#### 通过连接器id获取ER模型
接口：`/module/list`  
方法：GET  
params参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| connectorId | 连接器id |  |
测试用例：
```
    ?connectorId=61502f75d1005b07f987d739
```
测试结果：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": "6151315b8b9d8535c21e92a9",
      "connectorId": "61502f75d1005b07f987d739",
      "name": "board",
      "type": 0,
      "properties": [
        {
          "name": "board_id",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "board_name",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "board_description",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "board_version",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "board_generation",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "board_eox",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "board_bom",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "board_final",
          "type": "string",
          "defaultVal": null
        }
      ],
      "key": "board_id",
      "code": "var jsonObj = JSON.parse(data); var resultJson = JSON.stringify(jsonObj, ['board_id','board_name','board_description','board_version','board_generation', 'board_eox', 'board_bom', 'board_final'], '  '); return resultJson;"
    },
    {
      "id": "615135b6bb0d84238448c541",
      "connectorId": "61502f75d1005b07f987d739",
      "name": "chip",
      "type": 0,
      "properties": [
        {
          "name": "chip_id",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "chip_name",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "chip_specification",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "chip_batch",
          "type": "string",
          "defaultVal": null
        },
        {
          "name": "chip_eox",
          "type": "string",
          "defaultVal": null
        }
      ],
      "key": "chip_id",
      "code": "var jsonObj = JSON.parse(data); var resultJson = []; for(i in jsonObj){ for(j in jsonObj[i]['chips']){ resultJson.push(jsonObj[i]['chips'][j]);}} return JSON.stringify(resultJson);"
    },
    {
      "id": "6151387abb0d84238448c542",
      "connectorId": "61502f75d1005b07f987d739",
      "name": "include",
      "type": 1,
      "properties": [],
      "key": "",
      "code": "var jsonObj = JSON.parse(data);var resultJson = [];for(i in jsonObj){ for(j in jsonObj[i]['chips']){resultJson.push({from:jsonObj[i]['board_id'], to:jsonObj[i]['chips'][j]['chip_id']});}}return JSON.stringify(resultJson);"
    }
  ]
}
```
----
#### 通过id获取ER模型
接口：`/module/info`  
方法：GET  
params参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| id | 模型id |  |
测试用例
```
    ?id=6151315b8b9d8535c21e92a9
```
测试结果：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "6151315b8b9d8535c21e92a9",
    "connectorId": "61502f75d1005b07f987d739",
    "name": "board",
    "type": 0,
    "properties": [
      {
        "name": "board_id",
        "type": "string",
        "defaultVal": null
      },
      {
        "name": "board_name",
        "type": "string",
        "defaultVal": null
      },
      {
        "name": "board_description",
        "type": "string",
        "defaultVal": null
      },
      {
        "name": "board_version",
        "type": "string",
        "defaultVal": null
      },
      {
        "name": "board_generation",
        "type": "string",
        "defaultVal": null
      },
      {
        "name": "board_eox",
        "type": "string",
        "defaultVal": null
      },
      {
        "name": "board_bom",
        "type": "string",
        "defaultVal": null
      },
      {
        "name": "board_final",
        "type": "string",
        "defaultVal": null
      }
    ],
    "key": "board_id",
    "code": "var jsonObj = JSON.parse(data); var resultJson = JSON.stringify(jsonObj, ['board_id','board_name','board_description','board_version','board_generation', 'board_eox', 'board_bom', 'board_final'], '  '); return resultJson;"
  }
}
```
----
#### 删除模型
接口：`/module/delete`  
方法：DELETE  
body参数：模型的id数组
测试用例：
```json
[
  "612b41df91d27408edeec81c"
]
```
测试结果：
```json
{
  "code": 200,
  "message": "删除成功！",
  "data": null
}
```

----

#### 保存ER模型
接口：`/module/save`  
方法：POST  
body参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| code | 抽取函数代码 | Js脚本，必填。所有代码放在一行，否则会因无法转成json而报“接口错误” |
| connectorId | 连接器id | 必填 |
| id | 模型id | 不填 |
| key | 主键 | 必填 |
| name | 名称 | 必填 |
| properties | 属性 | 模型的属性列表 |
| properties.defaultVal | 默认值 | 可为空 |
| properties.name | 名称 | 必填，必须字母开头，按照java变量规范 |
| properties.type | 数据类型 | 必填，可选项有：int, double, bool, string, date, time, datetime, timestamp |
测试用例：  
* 节点模型测试数据1  
```json
    {
  "id": "",
  "connectorId": "615036f8d1005b07f987d73c",
  "name": "board",
  "type": 0,
  "properties": [
    {
      "name": "board_id",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "board_name",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "board_description",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "board_version",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "board_generation",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "board_eox",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "board_bom",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "board_final",
      "type": "string",
      "defaultVal": null
    }
  ],
  "key": "board_id",
  "code": "var jsonObj = JSON.parse(data); var resultJson = JSON.stringify(jsonObj, ['board_id','board_name','board_description','board_version','board_generation', 'board_eox', 'board_bom', 'board_final'], '  '); return resultJson;"
}
```
* 节点模型测试数据2  
```json
{
  "code": "var jsonObj = JSON.parse(data); var resultJson = []; for(i in jsonObj){ for(j in jsonObj[i]['chips']){  resultJson.push(jsonObj[i]['chips'][j]); }} return JSON.stringify(resultJson);",
  "connectorId": "615036f8d1005b07f987d73c",
  "id": "",
  "key": "chip_id",
  "name": "chip",
  "properties": [
    {
      "defaultVal": null,
      "name": "chip_id",
      "type": "string"
    },
    {
      "name": "chip_name",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "chip_specification",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "chip_batch",
      "type": "string",
      "defaultVal": null
    },
    {
      "name": "chip_eox",
      "type": "timestamp",
      "defaultVal": null
    }

  ],
  "type": 0
}
```
测试结果：
```json
{
  "code": 200,
  "message": "保存成功！",
  "data": null
}
```
----

#### 运行数据抽取任务
接口：`/module/run`  
方法：GET  
params参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| recordId | 数据记录的id |  |
测试用例：
```
  ?recordId=612b41df91d27408edeec81c
```
测试结果：
```json
{
  "code": 200,
  "message": "任务已运行！",
  "data": null
}
```
----

#### 测试ER抽取函数
接口：`/module/functionTest`  
方法：POST
params参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| recordId | 数据记录的id |  |
测试用例：
```
  ?recordId=61512f37d1005b07f987d73d
```
body参数：函数字符串
```js
// 实体抽取函数1
    var jsonObj = JSON.parse(data); 
    var resultJson = JSON.stringify(jsonObj, ['board_id','board_name','board_description','board_version','board_generation', 'board_eox', 'board_bom', 'board_final'], '  '); 
    return resultJson;
```

```js
// 实体抽取函数2
var jsonObj = JSON.parse(data); 
var resultJson = []; 
for(i in jsonObj){ 
    for(j in jsonObj[i]['chips']){ 
        resultJson.push(jsonObj[i]['chips'][j]);
    }
} 
return JSON.stringify(resultJson);
```

```js
// 关系抽取函数
var jsonObj = JSON.parse(data);
var resultJson = [];
for(i in jsonObj){ 
    for(j in jsonObj[i]['chips']){
        resultJson.push({from:jsonObj[i]['board_id'], to:jsonObj[i]['chips'][j]['chip_id']});
    }
}
return JSON.stringify(resultJson);
```

----
##数据记录

----
#### 获取记录
接口：`/record/list`  
方法：GET  
params参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| connectorId  | 连接器id | 从1开始 |
| page  | 页码 | 从1开始 |
| rows  | 每页行数 ||
| sortBy | 排序字段 ||
| sortDirection | 排序规则 | DESC降序，ASC升序|
测试用例：
```
    connectorId=61502f75d1005b07f987d739c&page=1&rows=10&sortBy=name&sortDirection=desc
```
测试结果：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "content": [
      {
        "id": "6146f71df7d08b2ef16b9ae3",
        "connectorId": "6146f6e1f7d08b2ef16b9ae2",
        "requestTime": {
          "value": 1632040733782,
          "time": 379,
          "bsonType": "TIMESTAMP",
          "inc": -46838698,
          "array": false,
          "null": false,
          "number": false,
          "boolean": false,
          "binary": false,
          "double": false,
          "string": false,
          "int32": false,
          "timestamp": true,
          "javaScript": false,
          "dbpointer": false,
          "int64": false,
          "dateTime": false,
          "symbol": false,
          "decimal128": false,
          "document": false,
          "objectId": false,
          "javaScriptWithScope": false,
          "regularExpression": false
        },
        "timeConsuming": 489,
        "status": 1,
        "fileId": null,
        "data": "[{\n\t\"chip_id\": \"chip-1\",\n\t\"chip_name\": \"电源管理芯片\",\n\t\"components\": [{\n\t\t\"component_id\": \"component-1\",\n\t\t\"component_name\": \"电源管理组件\"\n\t}]\n},\n{\n    \"chip_id\": \"chip-2\",\n    \"chip_name\": \"电池芯片\",\n    \"components\": [{\n        \"component_id\": \"component-3\",\n        \"component_name\": \"电池部分组件\"\n    },{\n        \"component_id\": \"component-2\",\n        \"component_name\": \"芯片组件\"\n    }\n    ]\n}]\n\n",
        "erdata": null
      }
    ],
    "pageable": {
      "sort": {
        "unsorted": false,
        "sorted": true,
        "empty": false
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 10,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalPages": 1,
    "totalElements": 1,
    "size": 10,
    "number": 0,
    "sort": {
      "unsorted": false,
      "sorted": true,
      "empty": false
    },
    "first": true,
    "numberOfElements": 1,
    "empty": false
  }
}
```
----
#### 删除数据记录
接口：`/record/delete`  
方法：DELETE  
body参数：数据记录的id数组
测试用例：
```json
[
  "612b41df91d27408edeec81c"
]
```
测试结果：
```json
{
  "code": 200,
  "message": "删除成功！",
  "data": null
}
```
----

##校验规则管理

----
#### 保存/更新校验规则
接口：`/verify/save`  
方法：POST  
body参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| id| 校验规则编号 |  |
| tag1| 类型1 | 确定需比较数据的类型 |
| tag2  | 类型2 |  |
| property1  | 类型1的属性 | 确定需比较数据的属性 |
| property2 | 类型2的属性 ||
| standard | 比较规则 |  |
| type | 通知方式 | 0 仅标注， 1 邮件通知 |
| email | 额外通知的邮箱 |  |
| emailProperty1 | 类型1的邮箱属性 |  |
| emailProperty2 | 类型2的邮箱属性 |  |
测试用例：
```json
{
  "email": "xxxx@qq.com",
  "emailProperty1": "email",
  "emailProperty2": "e_mail",
  "id": "00001",
  "property1": "eox",
  "property2": "eop",
  "standard": "=",
  "tag1": "board",
  "tag2": "chip",
  "type": 0
}
```
测试结果：
```json
{
  "code": 200,
  "message": "保存成功！",
  "data": null
}
```
----
#### 获取校验规则列表
接口：`/verify/list`  
方法：GET
param参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| tag | 标签 | 可空 |
| page  | 页码 | 从1开始 |
| rows  | 每页行数 |  |
| sortBy | 排序字段 |  |
| sortDirection | 排序规则 | DESC降序，ASC升序|
测试用例：
```
    tag=board&page=1&rows=10&sortBy=name&sortDirection=desc
```
测试结果：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "content": [
      {
        "id": "61698f4668524e06fddedfcd",
        "tag1": "region",
        "property1": "attr02_",
        "standard": "=",
        "tag2": "region",
        "property2": "attr02_",
        "type": 0,
        "email": "1111000018@qq.com",
        "emailProperty1": "region_",
        "emailProperty2": "region"
      },
      {
        "id": "616fb91201cb2d18fd09d578",
        "tag1": "region",
        "property1": "region_",
        "standard": "=",
        "tag2": "region",
        "property2": "attr01_",
        "type": 0,
        "email": "",
        "emailProperty1": "attr01_",
        "emailProperty2": "region_"
      },
      {
        "id": "61710d6f941bea49e8680c23",
        "tag1": "board",
        "property1": "board_eox",
        "standard": ">",
        "tag2": "chip",
        "property2": "chip_eox",
        "type": 0,
        "email": "",
        "emailProperty1": "",
        "emailProperty2": ""
      }
    ],
    "pageable": {
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "pageNumber": 0,
      "pageSize": 10,
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalPages": 1,
    "totalElements": 3,
    "first": true,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "number": 0,
    "numberOfElements": 3,
    "size": 10,
    "empty": false
  }
}
```
----
#### 获取校验规则列表
接口：`/verify/info`  
方法：GET
param参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| id | 校验标准的编号 |  |
测试用例：
```
    id=61710d6f941bea49e8680c23
```
测试结果：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": "61710d6f941bea49e8680c23",
    "tag1": "board",
    "property1": "board_eox",
    "standard": ">",
    "tag2": "chip",
    "property2": "chip_eox",
    "type": 0,
    "email": "",
    "emailProperty1": "",
    "emailProperty2": ""
  }
}
```
----
#### 获取所有的Tag
接口：`/verify/getTags`  
方法：GET
测试结果：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    "board",
    "chip",
    "region"
  ]
}
```
----
#### 获取校验规则列表
接口：`/verify/getTagDescription`  
方法：GET
param参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| tag | 数据类型 |  |
测试用例：
```
    tag=board
```
测试结果：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    "tag",
    "board_id",
    "board_name",
    "board_description",
    "board_version",
    "board_generation",
    "board_eox",
    "board_bom",
    "board_final"
  ]
}
```
----
#### 删除校验规则
接口：`/verify/delete`  
方法：DELETE  
body参数：校验规则的id数组
测试用例：
```json
[
  "61710d6f941bea49e8680c23"
]
```
测试结果：
```json
{
  "code": 200,
  "message": "删除成功！",
  "data": null
}
```
----
##校验记录管理
----
#### 获取校验记录列表
接口：`/verifyRecord/list`  
方法：GET  
param参数：

|  参数名   | 解释  | 备注 |
|  ----  | ----  | ---- |
| tag | 标签 | 可空 |
| page  | 页码 | 从1开始 |
| rows  | 每页行数 |  |
| sortBy | 排序字段 |  |
| sortDirection | 排序规则 | DESC降序，ASC升序|
测试用例：
```
    page=1&rows=10&sortBy=name&sortDirection=desc
```
测试结果：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "content": [
      {
        "id": "616ea79117985e34efb1c737",
        "entityId1": "board_1",
        "entityId2": "chip_1",
        "tag": "board",
        "date": "2021-10-19T11:10:07.006+00:00",
        "inform": "异常已标注！邮箱1111000018@qq.com发送失败！节点board_1邮箱获取失败！节点board_1邮箱获取失败！"
      }
    ],
    "pageable": {
      "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
      },
      "pageNumber": 0,
      "pageSize": 10,
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalPages": 1,
    "totalElements": 1,
    "first": true,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "number": 0,
    "numberOfElements": 1,
    "size": 10,
    "empty": false
  }
}
```
----
#### 删除校验记录
接口：`/verifyRecord/delete`  
方法：DELETE  
body参数：校验记录的id数组
测试用例：
```json
[
  "616ea79117985e34efb1c737"
]
```
测试结果：
```json
{
  "code": 200,
  "message": "删除成功！",
  "data": null
}
```
----
## 获取漏洞图
####获取图中结点ID
接口：`/Vulnergraph/get_vulner_node`  
方法：get_vulner_node  
参数：漏洞结点ID

测试用例：
```
    vulner_id = airplane_1
```
测试结果：
```json
{
  "\"flight_126848\"",
  "\"flight_134903\"",
  "\"flight_134905\"",
  "\"flight_134906\"",
  "\"flight_134908\"",
  "\"flight_134910\"",
  "\"flight_134912\"",
  "\"flight_134916\"",
  "\"flight_134917\"",
  "\"flight_134920\"",
  "\"flight_134922\"",
  "\"flight_134924\"",
  "\"flight_134925\"",
  "\"flight_134928\"",
  "\"flight_134929\"",
  "\"flight_143077\"",
  "\"flight_143084\"",
  "\"flight_143091\"",
  "\"flight_143096\"",
  "\"flight_143097\"",
  "\"flight_151363\"",
  "\"flight_151368\"",
  "\"flight_151378\"",
  "\"flight_151392\"",
  "\"flight_159484\"",
  "\"flight_159491\"",
  "\"flight_159499\"",
  "\"flight_159511\"",
  "\"flight_159513\"",
  "\"flight_159515\"",
  "\"flight_167750\"",
  "\"flight_167757\"",
  "\"flight_167761\"",
  "\"flight_167762\"",
  "\"flight_167769\"",
  "\"flight_167772\"",
  "\"flight_167774\"",
  "\"flight_167779\"",
  "\"flight_167781\"",
  "\"flight_175871\"",
  "\"flight_175878\"",
  "\"flight_175890\"",
  "\"flight_175898\"",
  "\"flight_184152\"",
  "\"flight_184159\"",
  "\"flight_184171\"",
  "\"flight_184172\"",
  "\"flight_184174\"",
  "\"flight_184178\"",
  "\"flight_184185\"",
  "\"flight_184186\"",
  "\"flight_192241\"",
  "\"flight_192242\"",
  "\"flight_192243\"",
  "\"flight_192264\"",
  "\"flight_192272\"",
  "\"flight_200414\"",
  "\"flight_200420\"",
  "\"flight_200431\"",
  "\"flight_200436\"",
  "\"flight_200444\"",
  "\"flight_200445\"",
  "\"flight_200446\"",
  "\"flight_200447\"",
  "\"flight_200448\"",
  "\"flight_20228\"",
  "\"flight_20242\"",
  "\"flight_20248\"",
  "\"flight_20257\"",
  "\"flight_20260\"",
  "\"flight_20261\"",
  "\"flight_208699\"",
  "\"flight_208702\"",
  "\"flight_208708\"",
  "\"flight_208711\"",
  "\"flight_208714\"",
  "\"flight_208716\"",
  "\"flight_208717\"",
  "\"flight_208720\"",
  "\"flight_208727\"",
  "\"flight_208735\"",
  "\"flight_216829\"",
  "\"flight_216837\"",
  "\"flight_216847\"",
  "\"flight_225089\"",
  "\"flight_225093\"",
  "\"flight_225102\"",
  "\"flight_225110\"",
  "\"flight_225112\"",
  "\"flight_225116\"",
  "\"flight_233202\"",
  "\"flight_233208\"",
  "\"flight_233211\"",
  "\"flight_233213\"",
  "\"flight_233215\"",
  "\"flight_233232\"",
  "\"flight_241488\"",
  "\"flight_241490\"",
  "\"flight_241496\"",
  "\"flight_241497\"",
  "\"flight_241502\"",
  "\"flight_241503\"",
  "\"flight_241507\"",
  "\"flight_241519\"",
  "\"flight_241522\"",
  "\"flight_249587\"",
  "\"flight_249588\"",
  "\"flight_249593\"",
  "\"flight_249596\"",
  "\"flight_249599\"",
  "\"flight_257754\"",
  "\"flight_257759\"",
  "\"flight_257760\"",
  "\"flight_257775\"",
  "\"flight_257784\"",
  "\"flight_266037\"",
  "\"flight_266041\"",
  "\"flight_266042\"",
  "\"flight_266045\"",
  "\"flight_266047\"",
  "\"flight_266056\"",
  "\"flight_266061\"",
  "\"flight_266062\"",
  "\"flight_266073\"",
  "\"flight_274157\"",
  "\"flight_274166\"",
  "\"flight_274175\"",
  "\"flight_274176\"",
  "\"flight_274178\"",
}
```

####获取图中边信息
接口：`/Vulnergraph/get_vulner_edge`  
方法：get_vulner_edge  
参数：漏洞结点ID

测试用例：
```
    vulner_id = airplane_1
```

测试结果：
```json
"(\"airplane_1\")-[:dependency@0{}]->(\"flight_102146\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102147\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102148\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102149\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102150\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102151\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102152\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102153\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102154\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102155\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102156\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102157\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102158\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102159\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102160\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102161\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102162\")",
  "(\"airplane_1\")-[:dependency@0{}]->(\"flight_102163\")",
```