package com.fudan.productsupport.entity.mongodb;

import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * @ClassName VerifyRecordEntity
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/16 16:50
 * Version 0.0.1
 */
@Data
@Document(collection = "verifyRecord")
public class VerifyRecordEntity {
    //校验结果id
    @Id
    private String id;
    //校验对象1id
    @NonNull
    private String entityId1;
    // 校验对象2 id
    @NonNull
    private String entityId2;
    //校验对象类型
    @NonNull
    private String tag;
    //校验时间
    @NonNull
    private Date date;
    //通知结果
    @NonNull
    private String inform;
}
