package com.fudan.productsupport.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import io.restassured.RestAssured;
import static io.restassured.RestAssured.*;
import static io.restassured.matcher.RestAssuredMatchers.*;

import io.restassured.http.ContentType;
import io.restassured.http.Method;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;


/**
 * @ClassName RestAssuredTest
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/7/27 15:00
 * Version 0.0.1
 */

@Slf4j
@SpringBootTest
public class RestAssuredTest {

    @Resource
    private RestAssuredUtil restAssuredUtil;

    @Test
    void testRestAssured(){
        JSONObject params = new JSONObject();
        params.put("page", "1");
        params.put("rows", "10");
        params.put("sortBy", "id");
        params.put("sortDirection", "DESC");
        String url = "http://localhost:8080/connector/list";
        JSONObject res = restAssuredUtil.httpRequest("GET", url, null, params, null, "ContentType.JSON" );
        log.info(res.toString());
    }

    @Test
    void doGet(){

        Map<String, String> params = new HashMap<>();
        params.put("page", "1");
        params.put("rows", "10");
        params.put("sortBy", "id");
        params.put("sortDirection", "DESC");
        Response response = given()
                .params(params)
                .get("http://localhost:8080/connector/list");
        int code  = response.getStatusCode();
        // us
        long time = response.getTime();
        log.info(response.getBody().asString());

    }

    @Test
    void doConnector(){

//        String body =
//        "{ \"httpMethod\": \"GET\"," +
//                "\"name\": \"getConnector\"," +
//                "\"period\": 7," +
//                "\"uri\": \"http://localhost:8080/connector/list\"" +
//                "}";

        JSONObject body = new JSONObject();
        body.put("httpMethod", "GET");
        body.put("name", "getConnector");
        body.put("period", 7);
        body.put("uri", "http://localhost:8080/connector/list");

        Response response = given()
                .body(body.toString()).contentType(ContentType.JSON)
                .request(Method.POST,"http://localhost:8080/connector/save");

        int code  = response.getStatusCode();
        long time = response.getTime();
        log.info(response.getBody().asString());

    }
//    }
}
