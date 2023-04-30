package com.fudan.productsupport.utils;

import com.alibaba.fastjson.JSON;
import com.fudan.productsupport.config.KafkaConfig;
import com.fudan.productsupport.entity.mongodb.RecordEntity;
import com.fudan.productsupport.service.RecordService;
import com.fudan.productsupport.utils.Exception.ApiException;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.*;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.bson.BsonTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ExecutionException;

/**
 * @ClassName KafkaUtil
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/10 15:15
 * Version 0.0.1
 */

@Component
@Slf4j
public class KafkaUtil {

    @Autowired
    private KafkaConfig kafkaConfig;
    @Resource
    private RecordService recordService;

    /**
     * topicPattern使用表达式匹配，spring-kafka会自动扫描相关的topic并加入Listen
     * @param record
     */
//    topicPartern = connector-xxxxxx
    @KafkaListener(topicPattern = Constant.TOPIC_FIRST_NAME + ".*")
    public void listen(ConsumerRecord<?, ?> record){
        log.info("topic=" +record.topic() + "timestamp" + record.timestamp() + ";offset=" + record.offset());
        // 获得连接器id
        String connectorId = record.topic().substring(Constant.TOPIC_FIRST_NAME.length() + 1);
        // 保存记录
        RecordEntity recordEntity = new RecordEntity(connectorId, Constant.NOT_USE, Constant.ConnectorStatus.NORMAL.getValue());
        recordEntity.setRequestTime(new BsonTimestamp(record.timestamp()));
        recordEntity.setData(record.value().toString());
        recordService.save(recordEntity);
    }

    /**
     * 为每个connector创建一个topic
     * @param topicName
     * @return
     */
    public CreateTopicsResult createTopic(String topicName){
        AdminClient adminClient = KafkaAdminClient.create(kafkaConfig.consumerFactory().getConfigurationProperties());
        NewTopic topic = new NewTopic(topicName, 1,(short) 1);
        CreateTopicsResult result =  adminClient.createTopics(Collections.singletonList(topic));
        adminClient.close();
        return result;
    }

    /**
     * 删除topic
     * @param connectorId
     * @return
     */
    public DeleteTopicsResult deleteTopics(String connectorId){
        AdminClient adminClient = KafkaAdminClient.create(kafkaConfig.consumerFactory().getConfigurationProperties());
        String topicName = Constant.TOPIC_FIRST_NAME + "-" + connectorId;
        DeleteTopicsResult result = null;
        try {
            Set<String> topics = adminClient.listTopics().names().get();
            if(topics.contains(topicName)){
                result = adminClient.deleteTopics(Collections.singletonList(topicName));
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            throw new ApiException("系统异常！");
        }
        adminClient.close();
        return result;
    }

}
