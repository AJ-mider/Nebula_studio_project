package com.fudan.productsupport.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.config.KafkaConfig;
import com.fudan.productsupport.dao.mongodb.VerifyRepository;
import com.fudan.productsupport.entity.mongodb.VerifyEntity;
import com.fudan.productsupport.service.VerifyService;
import com.fudan.productsupport.utils.Constant;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;

/**
 * @ClassName VerifyServiceImpl
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/10/11 15:30
 * Version 0.0.1
 */
@Service
@ResponseBody
@Slf4j
public class VerifyServiceImpl implements VerifyService {

    @Resource
    private VerifyRepository verifyRepository;
    @Resource
    private MongoTemplate mongoTemplate;
    @Autowired
    private KafkaTemplate kafkaTemplate;

    /**
     * TODO 保存和更新校验规则
     * @param verifyEntity
     */
    @Override
    public void save(VerifyEntity verifyEntity) {
        if(verifyEntity.getId() == null)
            log.info("保存校验规则" + verifyEntity.getTag1() + "&" + verifyEntity.getTag2());
        else
            log.info("更新校验规则" + verifyEntity.getId());
        verifyRepository.save(verifyEntity);
    }

    /**
     * TODO 获取所有的校验规则
     * @param pageRequest
     * @return
     */
    @Override
    public Page<VerifyEntity> query(PageRequest pageRequest) {
        log.info("获取所有校验规则");
        return verifyRepository.findAll(pageRequest);
    }

    /**
     * TODO 通过id获取校验规则
     * @param id
     * @return
     */
    @Override
    public VerifyEntity queryById(String id){
        log.info("通过id获取校验标准：" + id);
        return verifyRepository.findById(id).get();
    }

    /**
     * TODO 通过tag查询校验规则
     * @param tag
     * @param pageRequest
     * @return
     */
    @Override
    public Page<VerifyEntity> queryByTag(String tag, PageRequest pageRequest){
        List<VerifyEntity> verifyEntities = this.queryByTag(tag);
        return new PageImpl<>(verifyEntities, pageRequest, verifyEntities.size());
    }

    /**
     * TODO 通过tag查询校验规则
     * @param tag
     * @return
     */
    @Override
    public List<VerifyEntity> queryByTag(String tag){
        log.info("查询" + tag + "的校验规则");
        Query query = new Query();
        query.addCriteria(Criteria.where("tag1").is(tag));
        //先找tag1满足的
        List<VerifyEntity> verifyEntities = mongoTemplate.find(query, VerifyEntity.class);
        query = new Query();
        query.addCriteria(Criteria.where("tag2").is(tag));
        //再找tag2满足的
        verifyEntities.addAll(mongoTemplate.find(query, VerifyEntity.class));
        return verifyEntities;
    }

    /**
     * TODO 删除校验规则
     * @param ids
     */
    @Override
    public void delete(List<String> ids) {
        log.info("删除校验规则:" + ids);
        for(String id : ids){
            verifyRepository.deleteById(id);
        }
    }

    /**
     * TODO 发送需校验的数据
     * @param data
     */
    @Override
    public void sendVerifyData(JSONObject data){
        // 获取tag下所有的校验规则
        List<VerifyEntity> verifyEntities = this.queryByTag(data.getString("tag"));
        data.put("rules", verifyEntities);
        kafkaTemplate.send(Constant.VERIFY_DATA, data.toJSONString());
        kafkaTemplate.flush();
        log.info("向:" + Constant.VERIFY_DATA + "发送:" + data.toJSONString());
    }
}
