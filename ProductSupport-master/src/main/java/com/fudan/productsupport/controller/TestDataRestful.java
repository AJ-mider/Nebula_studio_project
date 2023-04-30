package com.fudan.productsupport.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.utils.CommonResult;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @ClassName TestDataRestful
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/6/2 10:23
 * Version 0.0.1
 */
@RestController
@RequestMapping("/data")
@Api(tags = "测试数据接口")
public class TestDataRestful {

    @GetMapping("/vulnerability")
    @ApiOperation(value = "获取漏洞测试数据", httpMethod = "GET")
    public CommonResult<JSONArray> vulnerability(){
        JSONArray jsonArray = new JSONArray();
        JSONObject item = new JSONObject();
        item.put("CVEID", "CVE20220606-11223");
        item.put("componentId", "");
        jsonArray.add(item);
        return CommonResult.success(jsonArray);
    }

    @GetMapping("/nodes")
    @ApiOperation(value = "获取节点测试数据", httpMethod = "GET")
    public CommonResult<JSONObject> nodes(){
        JSONObject result;
//        String json = "{project:[{project: \"001\"}]}";
        String json = "{project : [{id :\"project001\", value:\"001\"},{id:\"project002\", value:\"002\"}], " +
                "module : [{id :\"module001\", value:\"001\"},{id :\"module002\", value:\"002\"},{id :\"module003\", value:\"003\"},{id :\"module004\", value:\"004\"}]," +
                "board : [{id :\"board001\", value:\"001\"},{id :\"board002\", value:\"002\"},{id :\"board003\", value:\"003\"},{id :\"board004\", value:\"004\"}]," +
                "component : [{id :\"component001\", value:\"001\"},{id :\"component002\", value:\"002\"},{id :\"component003\", value:\"003\"},{id :\"component004\", value:\"004\"},{id :\"component005\", value:\"005\"}]}";
        result = JSON.parseObject(json);
//        JSONArray jsonArray = new JSONArray();
//        JSONObject item = new JSONObject();
//        item.put("id", "project001");
//        item.put("value", "001");
//        jsonArray.add(item);
//        item = new JSONObject();
//        item.put("id", "project002");
//        item.put("value", "002");
//        jsonArray.add(item);
//        item.clear();
//        result.put("project", jsonArray);
//        jsonArray.clear();
//
//        item.put("id", "module001");
//        item.put("value", "001");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "module002");
//        item.put("value", "002");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "module003");
//        item.put("value", "003");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "module004");
//        item.put("value", "004");
//        jsonArray.add(item);
//        item.clear();
//        result.put("module", jsonArray);
//        jsonArray.clear();
//
//        item.put("id", "board001");
//        item.put("value", "001");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "board002");
//        item.put("value", "002");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "board003");
//        item.put("value", "003");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "board004");
//        item.put("value", "004");
//        jsonArray.add(item);
//        item.clear();
//        result.put("board", jsonArray);
//        jsonArray.clear();
//
//        item.put("id", "component001");
//        item.put("value", "001");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "component002");
//        item.put("value", "002");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "component003");
//        item.put("value", "003");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "component004");
//        item.put("value", "004");
//        jsonArray.add(item);
//        item.clear();
//        item.put("id", "component005");
//        item.put("value", "005");
//        jsonArray.add(item);
//        item.clear();
//        result.put("component", jsonArray);
//        jsonArray.clear();
        return CommonResult.success(result);
    }

}
