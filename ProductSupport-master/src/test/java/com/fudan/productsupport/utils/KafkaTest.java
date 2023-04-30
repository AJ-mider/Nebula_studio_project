package com.fudan.productsupport.utils;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

/**
 * @ClassName KafkaTest
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/8/8 14:33
 * Version 0.0.1
 */
@SpringBootTest
@Component
@Slf4j
public class KafkaTest {
    @Autowired
    private KafkaTemplate kafkaTemplate;

    @Autowired
    private KafkaUtil kafkaUtil;

    @Test
    void testSend() throws InterruptedException {
        kafkaTemplate.send("verify_data", "{\"ids\":[\"board_1\",\"board_2\"],\"rules\":[{\"email\":\"1111000018@qq.com\",\"emailProperty1\":\"attr02_\",\"emailProperty2\":\"\",\"id\":\"61685032323f575cf9389db4\",\"property1\":\"board_generation\",\"property2\":\"attr02_\",\"standard\":\"=\",\"tag1\":\"board\",\"tag2\":\"region\",\"type\":1},{\"email\":\"1111000018@qq.com\",\"emailProperty1\":\"attr01_\",\"emailProperty2\":\"\",\"id\":\"616852fe323f575cf9389db5\",\"property1\":\"board_eox\",\"property2\":\"attr01_\",\"standard\":\">\",\"tag1\":\"board\",\"tag2\":\"region\",\"type\":1},{\"email\":\"1111000011@qq.com\",\"emailProperty1\":\"board_description\",\"emailProperty2\":\"board_description\",\"id\":\"6169927468524e06fddedfcf\",\"property1\":\"board_name\",\"property2\":\"board_name\",\"standard\":\">\",\"tag1\":\"board\",\"tag2\":\"board\",\"type\":1},{\"email\":\"\",\"emailProperty1\":\"\",\"emailProperty2\":\"\",\"id\":\"6169999c68524e06fddedfdd\",\"property1\":\"tag\",\"property2\":\"board_id\",\"standard\":\"\",\"tag1\":\"board\",\"tag2\":\"board\",\"type\":0},{\"email\":\"\",\"emailProperty1\":\"\",\"emailProperty2\":\"\",\"id\":\"61699a1968524e06fddedfde\",\"property1\":\"board_description\",\"property2\":\"attr01_\",\"standard\":\"=\",\"tag1\":\"board\",\"tag2\":\"region\",\"type\":0},{\"email\":\"\",\"emailProperty1\":\"\",\"emailProperty2\":\"\",\"id\":\"616991c168524e06fddedfce\",\"property1\":\"attr01_\",\"property2\":\"board_version\",\"standard\":\"=\",\"tag1\":\"region\",\"tag2\":\"board\",\"type\":0},{\"email\":\"1111000011@qq.com\",\"emailProperty1\":\"board_description\",\"emailProperty2\":\"board_description\",\"id\":\"6169927468524e06fddedfcf\",\"property1\":\"board_name\",\"property2\":\"board_name\",\"standard\":\">\",\"tag1\":\"board\",\"tag2\":\"board\",\"type\":1},{\"email\":\"\",\"emailProperty1\":\"\",\"emailProperty2\":\"\",\"id\":\"6169999c68524e06fddedfdd\",\"property1\":\"tag\",\"property2\":\"board_id\",\"standard\":\"\",\"tag1\":\"board\",\"tag2\":\"board\",\"type\":0}],\"tag\":\"board\"}");
        Thread.sleep(5000);
    }

    @Test
    void testGet(){
        String str1 = "connector-111";
        log.info(str1.substring(10));
    }

    @Test
    void sendVerifyResult() throws InterruptedException{
        kafkaTemplate.send("verify-result", "{\"tag\":\"board\", \"id1\":\"board_1\", \"id2\":\"chip_1\", \"ruleId\":\"61685032323f575cf9389db4\"}");
        Thread.sleep(5000);
    }

    @Test
    void testCreateTopic(){
        String name = Constant.TOPIC_FIRST_NAME + "-" + "test";
        kafkaUtil.createTopic("verify_data");
        kafkaUtil.createTopic("verify_result");
    }
}
