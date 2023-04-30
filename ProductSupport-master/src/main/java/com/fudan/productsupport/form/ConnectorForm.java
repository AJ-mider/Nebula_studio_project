package com.fudan.productsupport.form;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import io.restassured.http.ContentType;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * @ClassName ConnectForm
 * Description TODO 连接器表单
 * @Author WillemGavin
 * @Date 2021/6/26 15:06
 * Version 0.0.1
 */
@Data
@ApiModel(value = "连接器表单")
public class ConnectorForm {
    @ApiModelProperty("连接器接口")
    private String uri;

    @ApiModelProperty(name = "请求头",
            value = "{" +
                    "User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36," +
                    "Connection: keep-alive," +
                    "}")
    private JSONObject header;

    @ApiModelProperty(name = "请求方法（POST/GET）", value = "POST")
    private String httpMethod;

    @ApiModelProperty("请求参数")
    private JSONObject params;

    @ApiModelProperty("请求体")
    private JSONObject body;

//    ANY(new String[]{"*/*"}),
//    TEXT(new String[]{"text/plain"}),
//    JSON(new String[]{"application/json", "application/javascript", "text/javascript", "text/json"}),
//    XML(new String[]{"application/xml", "text/xml", "application/xhtml+xml"}),
//    HTML(new String[]{"text/html"}),
//    URLENC(new String[]{"application/x-www-form-urlencoded"}),
//    BINARY(new String[]{"application/octet-stream"});
    @ApiModelProperty(name = "请求体格式", value = "application/json")
    private String contentType;

    @ApiModelProperty("连接器名称")
    private String name;

    @ApiModelProperty("连接器类型（0为RestFul，1为Kafka）")
    private int type;

    @ApiModelProperty("更新方式（0为全量，1为增量）")
    private int updateType;

    @ApiModelProperty("访问周期, cron表达式（-1 为手动）")
    private String cron;

    @ApiModelProperty("备注")
    private String remark;
}
