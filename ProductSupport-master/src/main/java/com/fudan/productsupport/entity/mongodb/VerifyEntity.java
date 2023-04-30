package com.fudan.productsupport.entity.mongodb;

import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @ClassName VerifyEntity
 * Description TODO 校验规则实体
 * @Author WillemGavin
 * @Date 2021/10/11 14:45
 * Version 0.0.1
 */
@Data
@Document(collection = "verify")
public class VerifyEntity {
    //校验规则id
    @Id
    private String id;
    //校验对象1的tag
    @NonNull
    private String tag1;
    //校验对象1的校验属性
    @NonNull
    private String property1;
    //校验标准
    @NonNull
    private String standard;
    //校验对象2的tag
    @NonNull
    private String tag2;
    //校验对象2的校验属性
    @NonNull
    private String property2;
    //告警类型 0 仅标注， 1 邮件及标注
    @NonNull
    private int type;
    //邮箱地址
    private String email;
    //校验对象1的邮箱属性值
    private String emailProperty1;
    //校验对象2的邮箱属性值
    private String emailProperty2;
}
