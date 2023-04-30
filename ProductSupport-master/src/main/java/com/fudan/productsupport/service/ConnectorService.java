package com.fudan.productsupport.service;

import com.fudan.productsupport.entity.mongodb.ConnectorEntity;
import com.fudan.productsupport.form.ConnectorForm;
import com.fudan.productsupport.utils.CommonResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

/**
 * @ClassName ConnectorService
 * Description TODO 连接器服务层
 * @Author WillemGavin
 * @Date 2021/6/20 16:03
 * Version 0.0.1
 */
public interface ConnectorService {
    // 保存连接器
    String save(ConnectorForm connectorForm);

    // 通过id查询连接器
    ConnectorEntity queryById(String id);

    // 条件查询连接器
    Page<ConnectorEntity> query(ConnectorEntity connectorEntity, PageRequest pageRequest);

    // 获取所有连接器
    Page<ConnectorEntity> queryAll(PageRequest pageRequest);

    // 删除连接器
    void delete(List<String> ids);

    // 修改连接器
    void update(ConnectorEntity connectorEntity);

    // 访问连接器
    CommonResult request(String id);

    // 运行连接器任务
    boolean run(String id, String cron);

    // 暂停连接器任务
    boolean stop(String id);
}
