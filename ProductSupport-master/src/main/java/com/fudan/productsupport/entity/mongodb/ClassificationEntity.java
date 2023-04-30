package com.fudan.productsupport.entity.mongodb;

import lombok.Data;
import lombok.NonNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @ClassName RoleEntity
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/12 22:24
 * Version 0.0.1
 */
@Data
@Document(collection = "classification")
public class ClassificationEntity {
    // 角色id
    @Id
    private String id;
    // 角色
    @NonNull
    private String classification;

    public ClassificationEntity(){

    }
}
