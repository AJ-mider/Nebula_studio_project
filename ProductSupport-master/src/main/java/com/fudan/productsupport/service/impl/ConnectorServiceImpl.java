package com.fudan.productsupport.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.fudan.productsupport.dao.mongodb.ConnectorRepository;
import com.fudan.productsupport.dao.mongodb.RecordRepository;
import com.fudan.productsupport.entity.ScheduleTask;
import com.fudan.productsupport.entity.mongodb.ConnectorEntity;
import com.fudan.productsupport.entity.mongodb.ERModuleEntity;
import com.fudan.productsupport.entity.mongodb.RecordEntity;
import com.fudan.productsupport.form.ConnectorForm;
import com.fudan.productsupport.service.ConnectorService;
import com.fudan.productsupport.service.ERModuleService;
import com.fudan.productsupport.service.RecordService;
import com.fudan.productsupport.utils.*;
import com.fudan.productsupport.utils.Exception.ResultCode;
import com.sun.tools.jxc.ap.Const;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.bson.BsonTimestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.*;

/**
 * @ClassName ConnectorServiceImpl
 * Description TODO
 * @Author WillemGavin
 * @Date 2021/6/20 16:03
 * Version 0.0.1
 */
@Service
@ResponseBody
@Slf4j
public class ConnectorServiceImpl implements ConnectorService {

    @Autowired
    private ConnectorRepository connectorRepository;
    @Resource
    private RestAssuredUtil restAssuredUtil;
    @Resource
    private RecordService recordService;
    @Resource
    private KafkaUtil kafkaUtil;
    @Resource
    private ERModuleService erModuleService;

    /**
     * TODO 保存连接器
     * @param connectorForm
     */
    @Override
    public String save(ConnectorForm connectorForm){
        log.info("保存连接器:" + connectorForm.toString());
        ConnectorEntity connectorEntity = new ConnectorEntity(
                connectorForm.getType(), connectorForm.getName());
        connectorEntity.setUri(connectorForm.getUri());
        connectorEntity.setStatus(Constant.ConnectorStatus.UNKONW.getValue());
        connectorEntity.setCron(connectorForm.getCron());
        connectorEntity.setParams(connectorForm.getParams());
        connectorEntity.setHttpMethod(connectorForm.getHttpMethod());
        connectorEntity.setBody(connectorForm.getBody());
        connectorEntity.setContentType(connectorForm.getContentType());
        connectorEntity.setHeader(connectorForm.getHeader());
        connectorEntity.setRemark(connectorForm.getRemark());
        connectorEntity.setUpdateType(connectorForm.getUpdateType());
        ConnectorEntity result =  connectorRepository.save(connectorEntity);
        // 保存kafka topic
        if(connectorForm.getType() == Constant.ConnectorType.KAFKA.getValue()){
            String topicName = Constant.TOPIC_FIRST_NAME + "-" + result.getId();
            // Kafka连接器把topic保存在uri中
            connectorEntity.setUri(topicName);
            connectorRepository.save(result);
            kafkaUtil.createTopic(topicName);
            return topicName;
        }
        return null;
    }

    /**
     * TODO 通过id查询连接器
     * @param id
     * @return
     */
    @Override
    public ConnectorEntity queryById(String id){
        log.info("查询连接器（id）：" + id);
        if(connectorRepository.findById(id).isEmpty())
            return null;
        return connectorRepository.findById(id).get();
    }

    /**
     * TODO 条件查询连接器, 目前仅支持name、uri，模糊匹配查询
     * @return
     */
    @Override
    public Page<ConnectorEntity> query(ConnectorEntity connectorEntity, PageRequest pageRequest){
        log.info("查询连接器：" + connectorEntity.toString());
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING) //改变字符串为：模糊查询
//                .withMatcher("name", ExampleMatcher.GenericPropertyMatcher.of(ExampleMatcher.StringMatcher.CONTAINING))
//                .withMatcher("uri", ExampleMatcher.GenericPropertyMatcher.of(ExampleMatcher.StringMatcher.CONTAINING))
//                .withMatcher("remark", ExampleMatcher.GenericPropertyMatcher.of(ExampleMatcher.StringMatcher.CONTAINING))
                .withIgnorePaths("header") //
                .withIgnorePaths("httpMethod")
                .withIgnorePaths("params")
                .withIgnorePaths("body")
                .withIgnorePaths("contentType")
                .withIgnorePaths("remark")
                .withIgnorePaths("cron")
                .withIgnorePaths("updateType")
                .withIgnoreNullValues();

        if(connectorEntity.getStatus() == Constant.NOT_USE)
            matcher = matcher.withIgnorePaths("status");

        Example<ConnectorEntity> example = Example.of(connectorEntity, matcher);
        return connectorRepository.findAll(example, pageRequest);
    }

    /**
     * TODO 获取所有连接器
     * @param pageRequest 页面结构实例
     * @return
     */
    @Override
    public Page<ConnectorEntity> queryAll(PageRequest pageRequest){
        log.info("获取所所有连接器");
        return connectorRepository.findAll(pageRequest);
    }

    /**
     * TODO 删除连接器
     * @param ids
     */
    @Override
    public void delete(List<String> ids){
        log.info("删除连接器：" + ids);
        for(String id : ids){
            // 删除kafka topic
            // kafkaUtil.deleteTopics(id);
            // 停止定时任务
            this.stop(id);
            // 先删除记录和模型
            List<RecordEntity> recordEntities = recordService.queryByConnectorId(id);
            List<String> deleteRecords = new ArrayList<>();
            for(RecordEntity entity : recordEntities){
                deleteRecords.add(entity.getId());
            }
            List<ERModuleEntity> erModuleEntities = erModuleService.queryByConnectorId(id);
            List<String> deleteERModules = new ArrayList<>();
            for(ERModuleEntity entity : erModuleEntities){
                deleteERModules.add(entity.getId());
            }
            recordService.delete(deleteRecords);
            erModuleService.delete(deleteERModules);
            connectorRepository.deleteById(id);
        }
    }

    /**
     * TODO 更新连接器
     * @param connectorEntity
     */
    @Override
    public void update(ConnectorEntity connectorEntity){
        log.info("更新连接器" + connectorEntity);
        connectorRepository.save(connectorEntity);
    }

    /**
     * TODO 访问连接器
     * @param id
     * @return
     */
    @Override
    public CommonResult<String> request(String id){
        log.info("访问连接器：" + id);
        ConnectorEntity connectorEntity = connectorRepository.findById(id).get();
        JSONObject result = restAssuredUtil.httpRequest(
                connectorEntity.getHttpMethod(),
                connectorEntity.getUri(),
                connectorEntity.getHeader(),
                connectorEntity.getParams(),
                connectorEntity.getBody(),
                connectorEntity.getContentType()
        );

        RecordEntity recordEntity = new RecordEntity(connectorEntity.getId(), Constant.NOT_USE, Constant.NOT_USE);
        recordEntity.setRequestTime(new BsonTimestamp(new Date().getTime()));
        if(Integer.parseInt(result.get("code").toString()) == ResultCode.SUCCESS.getCode()){
            connectorEntity.setStatus(Constant.ConnectorStatus.NORMAL.getValue());
            this.update(connectorEntity);
            // 保存RecordEntity
            recordEntity.setStatus(Constant.ConnectorStatus.NORMAL.getValue());
            recordEntity.setTimeConsuming(Integer.parseInt(result.get("time").toString()));
            recordEntity.setData(result.get("body").toString());
            recordService.save(recordEntity);
            // 进行下一步实体关系提取处理
            erModuleService.dataHandle(recordEntity);
            //返回状态
            return CommonResult.success("连接器访问成功！");
        }

        connectorEntity.setStatus(Constant.ConnectorStatus.EXCEPTION.getValue());

        //暂停连接器进程
        this.stop(connectorEntity.getId());

        //更新连接器状态
        this.update(connectorEntity);

        // 保存错误信息到RecordEntity
        recordEntity.setStatus(Constant.ConnectorStatus.EXCEPTION.getValue());
        recordService.save(recordEntity);

        return CommonResult.failed("访问失败，请检查连接器信息！");
    }

    /**
     * TODO 运行连接器任务
     * @param id
     */

    @Override
    public boolean run(String id, String cron){
        log.info("连接器定时任务开启：" + id);
        return ScheduleUtil.start(new ScheduleTask(id, this, null), cron);
    }

    /**
     * TODO 停止连接器任务
     * @param id
     */
    @Override
    public boolean stop(String id){
        log.info("连接器定时任务停止：" + id);
        ConnectorEntity connectorEntity = this.queryById(id);
        connectorEntity.setStatus(Constant.ConnectorStatus.NORMAL.getValue());
        this.update(connectorEntity);
        return ScheduleUtil.stop(new ScheduleTask(id, this, null));
    }
}
