package com.fudan.productsupport.entity.mongodb;

import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @ClassName RoleRelationEntity
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/13 22:09
 * Version 0.0.1
 */
@Data
@Document(collection = "classificationRelation")
public class ClassificationRelationshipEntity {
    @Id
    private String id;

    //角色名称
    @NonNull
    private String classificationName;

    //节点类型名 tag
    private String tagName;
}
