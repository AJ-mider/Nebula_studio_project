package com.fudan.productsupport.entity.mongodb;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;
import lombok.NonNull;
import org.bson.BsonTimestamp;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * @ClassName Record
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/6/20 15:33
 * Version 0.0.1
 */
@Data
@Document(collection = "record")
public class RecordEntity {
    //记录id
    @Id
    private String id;
    // 连接器id
    @NonNull
    private String connectorId;
    // 访问时间
    private BsonTimestamp requestTime;
    // 查询耗时 单位ms
    @NonNull
    private long timeConsuming;
    // 访问状态 0 未知， 1 正常， 2 访问失败
    @NonNull
    private int status;
    // 大文件地址
    private List<String> fileId;
    // 数据信息
    private String data;
    // 抽取ER后数据
    private JSONObject eRData;
}
