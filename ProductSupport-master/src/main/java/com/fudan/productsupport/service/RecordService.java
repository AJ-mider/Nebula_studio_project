package com.fudan.productsupport.service;

import com.fudan.productsupport.entity.mongodb.RecordEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Date;
import java.util.List;

/**
 * @ClassName RecordService
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/7/29 10:21
 * Version 0.0.1
 */
public interface RecordService {

    //保存记录信息
    void save(RecordEntity recordEntity);

    //查询连接器的记录
    Page<RecordEntity> queryByConnectorId(String id, PageRequest pageRequest);

    List<RecordEntity> queryByConnectorId(String id);

    //查询记录
    Page<RecordEntity> query(RecordEntity recordEntity, PageRequest pageRequest, Date startTime, Date endTime);

    //删除记录
    void delete(List<String> ids);

    //通过id查记录
    RecordEntity queryById(String id);

    //查询连接器的上一条记录
    RecordEntity queryLast(String connectorId);

}
