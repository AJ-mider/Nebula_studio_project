package com.fudan.productsupport.service;

import com.alibaba.fastjson.JSONArray;
import com.fudan.productsupport.entity.mongodb.ERModuleEntity;
import com.fudan.productsupport.entity.mongodb.RecordEntity;

import java.util.List;

/**
 * @ClassName ERModuleService
 * Description TODO 模型服务层
 * @Author WillemGavin
 * @Date 2021/8/18 10:08
 * Version 0.0.1
 */
public interface ERModuleService {
    // 保存模型
    String save(ERModuleEntity erModuleEntity);

    // 通过connectorId查模型
    List<ERModuleEntity> queryByConnectorId(String connectorId);

    // 通过Id查模型
    ERModuleEntity queryById(String id);

    // 通过name查模型
    List<ERModuleEntity> queryByName(String name);

    // 通过id删除模型
    void delete(List<String> ids);

    // 数据处理
    void dataHandle(RecordEntity recordEntity);

    // 判断模型是否存在
    boolean isExist(String connectorId, String name, int type);

    // 测试函数
    JSONArray codeTest(String recordId, String code);
}