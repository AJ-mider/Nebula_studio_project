package com.fudan.productsupport.service;

import com.fudan.productsupport.entity.mongodb.ClassificationRelationshipEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

/**
 * @ClassName RoleService
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/13 14:46
 * Version 0.0.1
 */
public interface ClassificationRelationshipService {
    // 保存类别关联信息
    void save(ClassificationRelationshipEntity classificationRelationshipEntity);

    // 删除类别关联信息
    void delete(List<String> ids);

    // 获取所有类别关联信息
    Page<ClassificationRelationshipEntity> queryAll(PageRequest pageRequest);

    // 查询类别关联信息
    Page<ClassificationRelationshipEntity> query(ClassificationRelationshipEntity classificationRelationshipEntity, PageRequest pageRequest);

    // 查询某种类别的关联信息
    List<ClassificationRelationshipEntity> query(ClassificationRelationshipEntity classificationRelationshipEntity);
}
