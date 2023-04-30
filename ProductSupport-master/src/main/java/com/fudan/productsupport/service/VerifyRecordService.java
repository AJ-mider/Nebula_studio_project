package com.fudan.productsupport.service;

import com.fudan.productsupport.entity.mongodb.VerifyRecordEntity;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

/**
 * @ClassName VerifyRecordService
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/16 16:58
 * Version 0.0.1
 */
public interface VerifyRecordService {
    //保存校验结果
    void save(VerifyRecordEntity verifyRecordEntity);

    //查看校验结果
    Page<VerifyRecordEntity> queryAll(PageRequest pageRequest);

    //删除校验结果
    void delete(List<String> ids);

    // 获取校验结果
    void receiveVerifyData(ConsumerRecord<?, ?> record);
}
