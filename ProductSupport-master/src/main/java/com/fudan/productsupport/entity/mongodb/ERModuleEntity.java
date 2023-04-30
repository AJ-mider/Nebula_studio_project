package com.fudan.productsupport.entity.mongodb;

import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * @ClassName ERModuleEntity
 * Description TODO 实体/关系的模型、对应的抽取代码
 * @Author WillemGavin
 * @Date 2021/8/17 22:31
 * Version 0.0.1
 */
@Data
@Document(collection = "ERModule")
public class ERModuleEntity {
    // 模型id
    @Id
    private String id;
    // 对应的connectorId
    @NonNull
    private String connectorId;
    // 名称，用于nebular节点的TAG名称/关系名称
    @NonNull
    private String name;
    // 模型类型：0 节点， 1 关系
    @NonNull
    private int type;
    // 实体的属性名及其类型
    private List<Property> properties;
    // 主键属性
    private String key;
    // 属性抽取代码
    private String code;
    // 受影响的节点id属性（漏洞节点）
    private String affected;
}
