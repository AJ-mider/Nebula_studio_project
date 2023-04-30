package com.fudan.productsupport.utils;

import static io.restassured.RestAssured.*;

import com.alibaba.fastjson.JSONObject;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.net.ConnectException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * @ClassName RestAssuredUtil
 * Description TODO 访问连接器
 * @Author WillemGavin
 * @Date 2021/7/28 11:05
 * Version 0.0.1
 */
@Component
public class RestAssuredUtil {
    public JSONObject httpRequest(String method, String url, JSONObject headers,
                                         JSONObject params, JSONObject body, String contentType){

        RequestSpecification request = given();

        // 设置headers
        if(headers != null)
            request.headers(headers);
        //设置params
        if(params != null)
            request.queryParams(params);
        //设置body
        if(body != null)
            request.body(body.toString()).contentType(contentType);

        JSONObject result = new JSONObject();
        //访问请求
        try {
            Response response = request.request(String.valueOf(method), url);
            result.put("code", response.getStatusCode());
            result.put("time", response.getTimeIn(TimeUnit.MILLISECONDS));
            result.put("body", response.getBody().asString());
        }catch (Exception e){
            //捕捉uri错误访问异常等情况
            result.put("code", Constant.ConnectorStatus.EXCEPTION.getValue());
            result.put("msg", "访问失败！");
        }

        return result;
    }
}
