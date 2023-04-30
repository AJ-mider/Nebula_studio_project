package com.fudan.productsupport.entity.mongodb;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @ClassName Connector
 * Description TODO 连接器集合实体
 * @Author WillemGavin
 * @Date 2021/6/18 22:53
 * Version 0.0.1
 */
@Data
@Document(collection = "connector")
public class ConnectorEntity {
    // 连接器id
    @Id
    private String id;
    // 接口
    private String uri;
    // 请求头
    private JSONObject header;
    // 请求方法
    private String httpMethod;
    // 请求参数
    private JSONObject params;
    // 请求体
    private JSONObject body;
    // 请求体格式
    private String contentType;
    // 连接器类型    0 RestFul， 1 kafka
    @NonNull
    private int type;
    // 接口状态     0 未知， 1 正常， 2 访问失败
    private int status;
    // 更新方式     0为全量，1为增量
    private int updateType;
    // 名称
    @NonNull
    private String name;
    // 访问周期  天  手动运行为"-1"
    private String cron;
    // 备注
    private String remark;
}
