package com.fudan.productsupport.service;

import com.fudan.productsupport.entity.mongodb.ClassificationEntity;
import java.util.List;

/**
 * @ClassName ClassificationService
 * Description TODO
 * @Author WillemGavin
 * @Date 2022/5/13 14:46
 * Version 0.0.1
 */
public interface ClassificationService {
    // 保存角色
    void save(ClassificationEntity classificationEntity);

    // 删除角色
    void delete(List<String> ids);

    // 获取所有角色类型
    List<ClassificationEntity> getClassification();
}
